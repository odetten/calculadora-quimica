import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Calculadora" },
  { to: "/cursos", label: "Cursos" },
  { to: "/chat", label: "Chat bot" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap text-sm transition-colors sm:text-base ${
    isActive ? "font-semibold text-teal-700" : "text-gray-600 hover:text-gray-900"
  }`;

export default function Header() {
  const [hidden, setHidden] = useState(false);
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
          <Link to="/" className="hidden whitespace-nowrap font-display text-2xl font-bold tracking-tight text-teal-700 sm:block">
            My Chem
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6" aria-label="Principal">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} end className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-5">
            <NavLink to="/perfil" className={navLinkClass}>
              Perfil
            </NavLink>
            <Link
              to="/login"
              className="whitespace-nowrap rounded-full bg-teal-700 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 sm:px-4 sm:text-base"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      {/* Espaciador para que el contenido no quede tapado por el header fijo */}
      <div className="h-16" />
    </>
  );
}