import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const port = Number(process.env.PORT || 3001)
const ollamaUrl = (process.env.OLLAMA_URL || 'http://127.0.0.1:11434').replace(/\/$/, '')
const model = process.env.OLLAMA_MODEL || 'llama3.1:8b'
const promptPath = fileURLToPath(new URL('../quimica systempront.txt', import.meta.url))

let chemistryTutorPrompt = ''
try {
    chemistryTutorPrompt = await readFile(promptPath, 'utf8')
} catch {
    console.warn('No se encontró el prompt educativo; se usará el prompt predeterminado.')
}

const sendJson = (response, status, payload) => {
    response.writeHead(status, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
    })
    response.end(JSON.stringify(payload))
}

const readJson = async (request) => {
    let body = ''
    for await (const chunk of request) {
        body += chunk
        if (body.length > 20_000) throw new Error('La solicitud excede el tamaño permitido.')
    }
    return JSON.parse(body)
}

const countAtoms = (equation) => {
    const [reactants, products] = equation.replace(/→/g, '->').split('->')
    if (!reactants || !products) throw new Error('La ecuación debe separar reactivos y productos con una flecha.')

    const countSide = (side) => {
        const counts = {}
        for (const rawTerm of side.split('+')) {
            const term = rawTerm.trim().replace(/[₀-₉]/g, (digit) => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(digit)))
            const match = term.match(/^(\d*)(.*)$/)
            const coefficient = Number(match?.[1] || 1)
            const formula = (match?.[2] || '').replace(/_/g, '')
            const pattern = /([A-Z][a-z]?)(\d*)/g
            let parsedLength = 0
            let token
            while ((token = pattern.exec(formula)) !== null) {
                if (token.index !== parsedLength) throw new Error('No se pudieron comprobar los átomos de esta fórmula.')
                const element = token[1]
                counts[element] = (counts[element] || 0) + coefficient * Number(token[2] || 1)
                parsedLength = pattern.lastIndex
            }
            if (!parsedLength || parsedLength !== formula.length) throw new Error('No se pudieron comprobar los átomos de esta fórmula.')
        }
        return counts
    }

    return { reactants: countSide(reactants), products: countSide(products) }
}

const server = createServer(async (request, response) => {
    if (request.method === 'GET' && request.url === '/api/health') {
        sendJson(response, 200, { ok: true, model })
        return
    }

    if (request.method !== 'POST' || request.url !== '/api/explain') {
        sendJson(response, 404, { error: 'Ruta no encontrada.' })
        return
    }

    try {
        const payload = await readJson(request)
        const equation = typeof payload.equation === 'string' ? payload.equation.trim() : ''
        const balancedEquation = typeof payload.balancedEquation === 'string' ? payload.balancedEquation.trim() : ''
        if (!equation || !balancedEquation || equation.length > 2_000 || balancedEquation.length > 2_000) {
            sendJson(response, 400, { error: 'Envía una ecuación válida y su balance.' })
            return
        }

        const atomCounts = countAtoms(balancedEquation)
        const readableEquation = (value) => value.replace(/_(\d+)/g, '$1').replace(/->/g, '→')

        const ollamaResponse = await fetch(`${ollamaUrl}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(180_000),
            body: JSON.stringify({
                model,
                stream: false,
                keep_alive: '5m',
                messages: [
                    {
                        role: 'system',
                        content: `${chemistryTutorPrompt.split('\n')[0]} Eres breve, preciso y didáctico. Responde en español, sin introducción. Usa solo los conteos verificados por el programa; no los recalcules ni cambies.`,
                    },
                    {
                        role: 'user',
                        content: `Explica el balanceo en exactamente 3 líneas numeradas, máximo 15 palabras por línea.\nInicial: ${readableEquation(equation)}\nBalanceada: ${readableEquation(balancedEquation)}\nConteo verificado en ambos lados: ${JSON.stringify(atomCounts.reactants)}.\nLínea 1: indica el coeficiente ajustado. Línea 2: explica qué átomo iguala. Línea 3: verifica que ambos lados coinciden.`,
                    },
                ],
                options: { temperature: 0.2, num_predict: 120 },
            }),
        })

        const result = await ollamaResponse.json().catch(() => ({}))
        if (!ollamaResponse.ok) {
            sendJson(response, 502, { error: result.error || `Ollama respondió con estado ${ollamaResponse.status}.` })
            return
        }

        const explanation = result.message?.content?.trim()
        if (!explanation) {
            sendJson(response, 502, { error: 'Ollama no devolvió una explicación.' })
            return
        }
        sendJson(response, 200, { explanation, model })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido al consultar Ollama.'
        const unavailable = error instanceof TypeError || message.includes('fetch failed') || error.name === 'TimeoutError' || error.name === 'AbortError'
        sendJson(response, unavailable ? 503 : 400, {
            error: unavailable
                ? `No se pudo contactar con Ollama en ${ollamaUrl}. Verifica que Ollama esté iniciado y que exista el modelo ${model}.`
                : message,
        })
    }
})

server.listen(port, '127.0.0.1', () => {
    console.log(`Backend listo en http://127.0.0.1:${port} (modelo ${model})`)
})
