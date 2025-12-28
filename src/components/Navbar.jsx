import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FcHome,
  FcPlus,
  FcBusinessman,
  FcClock,
  FcSettings,
  FcMenu,
  FcPortraitMode,
} from "react-icons/fc";
import Logout from "./Logout";

const menuItems = [
  { to: "/dashboard", icon: FcHome, label: "Dashboard" },
  { to: "/GerarLaudo", icon: FcPlus, label: "Gerar laudo" },
  { to: "/CadastroUsuario", icon: FcBusinessman, label: "Usuário" },
  { to: "/CadastroPacientes", icon: FcPortraitMode, label: "Paciente" },
  { to: "/LogsAuditoria", icon: FcClock, label: "Logs de Auditoria" },
  { to: "/configuracoes", icon: FcSettings, label: "Configurações" },
];

export default function Navbar({
  expanded,
  setExpanded,
  mobileOpen,
  setMobileOpen,
}) {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {
    nome: "Usuário",
    email: "admin@app.com",
  };

  return (
    <>
      {/* Backdrop Mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 transition-opacity md:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        onMouseEnter={() => window.innerWidth >= 768 && setExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setExpanded(false)}
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-xl z-40
          transition-all duration-300 flex flex-col overflow-hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${expanded ? "md:w-60 xl:w-64" : "md:w-20"}
        `}
      >
        {/* LOGO AREA - Ajustada para escala menor */}
        {/* AREA DO LOGO - Corrigida para Mobile vs Desktop */}
       <div className="flex items-center justify-center h-20 relative shrink-0">
  {/* LOGO EXPANDIDA */}
  <img
    src="src/assets/6.svg"
    alt="Logo"
    className={`
      /* Mobile: h-12 (48px) ou h-14 (56px) para ficar bem visível */
      h-18 w-auto transition-all duration-300
      
      /* Desktop (md): volta para h-8 (32px) para manter a elegância */
      md:h-18 
      
      /* Controle de visibilidade Desktop */
      ${expanded ? "md:opacity-100 md:scale-100" : "md:opacity-0 md:scale-90"}
      block 
    `}
  />

  {/* LOGO ÍCONE (Apenas para Desktop recolhido) */}
  <img
    src="src/assets/icon-diaghelper.svg"
    alt="Icon"
    className={`
      absolute h-10 w-auto transition-all duration-300
      hidden 
      ${
        !expanded
          ? "md:block md:opacity-100 md:scale-110"
          : "md:opacity-0 md:scale-90"
      }
    `}
  />
</div>
        <div className="flex flex-col h-full px-3 pb-4 pt-4 overflow-y-auto no-scrollbar">
          {/* MENU ITEMS */}
          <nav className="flex flex-col items-center w-full space-y-2">
            {menuItems.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`
                            flex items-center rounded-lg transition-all duration-300 group
                            bg-linear-to-r from-slate-100 to-slate-200 
                            hover:from-primary-200 hover:to-primary-400
                            
                            h-12 w-full
                            
                            /* Se for mobile (mobileOpen) OU desktop expandido: alinha à esquerda */
                            /* Caso contrário (desktop recolhido): centraliza */
                            ${
                            expanded || mobileOpen
                              ? "px-3 justify-start gap-3"
                              : "px-0 justify-center"
                            }
                         `}
              >
                <div className="flex items-center justify-center w-10 h-10 shrink-0">
                  <item.icon
                    size={24}
                    className="transition-transform group-hover:scale-110"
                  />
                </div>

                <span
                  className={`
        text-sm font-medium text-slate-700 transition-all duration-300 whitespace-nowrap
        /* Se for mobile OU desktop expandido: mostra o texto */
        ${
          expanded || mobileOpen
            ? "opacity-100 w-auto translate-x-0"
            : "opacity-0 w-0 overflow-hidden -translate-x-2 pointer-events-none"
        }
      `}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* FOOTER NO NAVBAR */}
          <div className="mt-auto border-t border-gray-100 pt-4 flex flex-col gap-4">
            {/* Usuário */}
            <div
              className={`flex items-center h-12 w-full ${
                expanded ? "px-3 gap-3" : "justify-center"
              }`}
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <img
                  src={
                    usuario?.avatarUrl ||
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.25&w=256&q=80"
                  }
                  className="w-10 h-10 rounded-full ring-2 ring-slate-900 object-cover"
                  alt="Avatar"
                />
              </div>
              {expanded && (
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-bold truncate leading-tight">
                    {usuario?.nome}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {usuario?.email}
                  </p>
                </div>
              )}
            </div>

            {/* Logout - Alinhado pelo mesmo container w-10 */}
            <div
              className={`flex items-center h-12 w-full ${
                expanded ? "px-3 gap-3" : "justify-center"
              }`}
            >
              <Logout expanded={expanded} />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
