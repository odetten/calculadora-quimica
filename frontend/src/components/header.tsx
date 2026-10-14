import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  isAuthenticated?: boolean
  onLoginClick?: () => void
  onLogoutClick?: () => void
  onBasicCourseClick?: () => void
  onNavigate?: (target: 'courses' | 'balanceador') => void
}

const links = [
  { href: "#balanceador", label: "Balanceador", target: 'balanceador' as const },
];

export default function Header({ isAuthenticated = false, onLoginClick, onLogoutClick, onBasicCourseClick, onNavigate }: HeaderProps) {
  const [hidden, setHidden] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false)
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const diff = y - lastY.current;

      // Ignora movimientos muy pequeños para que no "tiemble"
      if (Math.abs(diff) < 5) return;

      // Bajando y pasada la altura del header -> esconder; subiendo -> mostrar
      setHidden(diff > 0 && y > 80);
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 h-16 border-b border-gray-200 bg-white transition-transform duration-300 ease-in-out ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5">
          <a href="#inicio" className="text-xl font-bold text-gray-900">
            Química Clara
          </a>

          <nav className="flex gap-4 sm:gap-6">
            <div className="group relative">
              <a
                href="#cursos"
                onClick={(event) => {
                  if (onNavigate) {
                    event.preventDefault()
                    onNavigate('courses')
                  }
                }}
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
              >
                Cursos
              </a>
              <div className="invisible absolute left-0 top-full z-50 min-w-36 pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={onBasicCourseClick}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-left text-sm text-gray-700 shadow-lg hover:bg-gray-50 hover:text-gray-900"
                >
                  Básico
                </button>
              </div>
            </div>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => {
                  if (onNavigate) {
                    event.preventDefault()
                    onNavigate(link.target)
                  }
                }}
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
              >
                {link.label}
              </a>
            ))}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setConfirmLogout((open) => !open)}
                  aria-expanded={confirmLogout}
                  aria-controls="logout-confirmation"
                  className="text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
                >
                  Cerrar sesión
                </button>
                {confirmLogout && (
                  <div
                    id="logout-confirmation"
                    role="group"
                    aria-label="Confirmar cierre de sesión"
                    className="absolute right-0 top-full z-50 mt-3 w-64 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-lg"
                  >
                    <p className="text-sm text-gray-800">¿De verdad quieres cerrar la sesión?</p>
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmLogout(false)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmLogout(false)
                          onLogoutClick?.()
                        }}
                        className="rounded-lg bg-teal-700 px-3 py-1.5 text-sm text-white hover:bg-teal-800"
                      >
                        Sí, cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
              >
                Iniciar sesión
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Espaciador para que el contenido no quede tapado por el header fijo */}
      <div className="h-16" />
    </>
  );
}