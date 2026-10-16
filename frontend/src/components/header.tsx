import { useEffect, useRef, useState, type ReactNode } from "react";
import { Atom, ChevronDown, LandPlot, Sigma, User } from "lucide-react";
import logo from "../assets/mychem-logo.png";
import "../index.css";

export type CourseId = 'quimica-1' | 'quimica-2'

type HeaderProps = {
  isAuthenticated?: boolean
  onLoginClick?: () => void
  onLogoutClick?: () => void
  onNavigate?: (target: 'balanceador') => void
  onCourseSelect?: (course: CourseId) => void
  onHomeClick?: () => void
}

const courses: { id: CourseId; label: string }[] = [
  { id: 'quimica-1', label: 'Química 1' },
  { id: 'quimica-2', label: 'Química 2' },
];

type MenuItem = { key: string; label: string; onSelect: () => void }

const navItemClass = "flex flex-col items-center gap-0.5 text-[#1E1C2E] transition-opacity hover:opacity-70"

// El texto va en un span porque un button hereda la fuente por la regla global de index.css
function NavLabel({ children }: { children: ReactNode }) {
  return <span className="font-sans text-xs font-semibold">{children}</span>
}

// Con mouse el menú se abre al pasar el cursor; en celular, con un toque
function NavMenu({ id, label, icon, items, hidden }: { id: string; label: string; icon: ReactNode; items: MenuItem[]; hidden: boolean }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pointerType = useRef("")
  // El menú se mueve con el header; abierto se vería flotando
  const visible = open && !hidden

  useEffect(() => {
    if (!visible) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [visible]);

  return (
    <div
      ref={menuRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true)
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setOpen(false)
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape") return
        setOpen(false)
        event.currentTarget.querySelector("button")?.focus()
      }}
    >
      <button
        type="button"
        onPointerDown={(event) => {
          pointerType.current = event.pointerType
        }}
        onClick={() => {
          // Con mouse ya se abrió al pasar el cursor, así que el clic no lo cierra
          const fromMouse = pointerType.current === "mouse"
          pointerType.current = ""
          setOpen((current) => fromMouse || !current)
        }}
        aria-expanded={visible}
        aria-controls={id}
        className={`${navItemClass} relative`}
      >
        {icon}
        <ChevronDown
          aria-hidden="true"
          size={14}
          absoluteStrokeWidth
          className={`absolute left-full top-[14px] ml-px transition-transform duration-200 motion-reduce:transition-none ${visible ? "rotate-180" : ""}`}
        />
        <NavLabel>{label}</NavLabel>
      </button>

      {/* El pt-3 es un puente invisible para que el mouse llegue al menú sin que se cierre */}
      <div
        className={`absolute left-1/2 top-full z-50 w-44 -translate-x-1/2 pt-3 transition-[opacity,translate,visibility] duration-200 ease-out motion-reduce:transition-none ${
          visible ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <div id={id} className="rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setOpen(false)
                item.onSelect()
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-teal-50 hover:text-teal-800"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Header({ isAuthenticated = false, onLoginClick, onLogoutClick, onNavigate, onCourseSelect, onHomeClick }: HeaderProps) {
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
        <div className="mx-auto grid h-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-5">
          <a
            href="#inicio"
            onClick={(event) => {
              if (onHomeClick) {
                event.preventDefault()
                onHomeClick()
              }
            }}
            aria-label="My Chem, inicio"
            className="flex w-fit items-center"
          >
            <img src={logo} alt="My Chem" className="h-10 w-auto" />
          </a>

          <nav className="flex items-center gap-[38px]">
            <NavMenu
              id="courses-menu"
              label="Cursos"
              icon={<LandPlot size={26} aria-hidden="true" />}
              hidden={hidden}
              items={courses.map((course) => ({ key: course.id, label: course.label, onSelect: () => onCourseSelect?.(course.id) }))}
            />
            <NavMenu
              id="calculators-menu"
              label="Calculadoras"
              icon={<Sigma size={26} aria-hidden="true" />}
              hidden={hidden}
              items={[{ key: 'balanceador', label: 'Balanceador', onSelect: () => onNavigate?.('balanceador') }]}
            />
            <button type="button" className={navItemClass}>
              <Atom size={26} aria-hidden="true" />
              <NavLabel>Experimentar</NavLabel>
            </button>
          </nav>

          <div className="relative flex justify-end">
            <button
              type="button"
              onClick={() => (isAuthenticated ? setConfirmLogout((open) => !open) : onLoginClick?.())}
              aria-label={isAuthenticated ? "Cuenta: cerrar sesión" : "Iniciar sesión"}
              aria-expanded={isAuthenticated ? confirmLogout : undefined}
              aria-controls={isAuthenticated ? "logout-confirmation" : undefined}
              className="flex size-9 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-700"
            >
              <User className="size-5" aria-hidden="true" />
            </button>
            {isAuthenticated && confirmLogout && (
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
        </div>
      </header>

      {/* Espaciador para que el contenido no quede tapado por el header fijo */}
      <div className="h-16" />
    </>
  );
}
