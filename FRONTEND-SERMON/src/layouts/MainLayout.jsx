import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function MainLayout({ children, title, subtitle }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const correo = localStorage.getItem("correo");
  const rol = localStorage.getItem("rol");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const menuCompleto = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Clientes", path: "/clientes" },
    { label: "Equipos", path: "/equipos" },
    { label: "Mantenimientos", path: "/mantenimientos" },
    { label: "Órdenes", path: "/ordenes" },
    { label: "Técnicos", path: "/tecnicos" },
    { label: "Alertas", path: "/alertas" },
    { label: "Reportes", path: "/reportes" },
    { label: "Usuarios", path: "/usuarios" },
  ];

  const menuTecnico = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Equipos", path: "/equipos" },
    { label: "Mantenimientos", path: "/mantenimientos" },
    { label: "Órdenes", path: "/ordenes" },
    { label: "Alertas", path: "/alertas" },
  ];

  const isTecnico = rol === "TECNICO" || rol === "tecnico";
  const menu = isTecnico ? menuTecnico : menuCompleto;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`fixed md:sticky top-0 left-0 z-30 w-64 bg-[#111827] text-white h-screen p-6 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">SERMON</h1>
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-1">Gestión contra incendios</p>

        <nav className="mt-10 space-y-2">
          {menu.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-xl font-medium transition ${
                  active
                    ? "bg-[#E11D2E] text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 w-full overflow-x-hidden">
        <header className="h-20 bg-white flex items-center justify-between px-6 md:px-10 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
              <p className="text-xs md:text-sm text-gray-500 hidden sm:block">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{correo}</p>
              <p className="text-xs text-gray-500">{rol}</p>
            </div>

            <button
              onClick={logout}
              className="bg-[#111827] text-white px-4 py-2 rounded-xl text-sm"
            >
              Salir
            </button>
          </div>
        </header>

        <section className="p-6 md:p-10">{children}</section>
      </main>
    </div>
  );
}