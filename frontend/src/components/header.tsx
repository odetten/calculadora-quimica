import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#inicio", label: "Inicio" },
  { href: "#servicios", label: "Servicios" },
  { href: "#balanceador", label: "Balanceador" },
];

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
          <a href="#inicio" className="text-xl font-bold text-gray-900">
            Química Clara
          </a>

          <nav className="flex gap-4 sm:gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Espaciador para que el contenido no quede tapado por el header fijo */}
      <div className="h-16" />
    </>
  );
}