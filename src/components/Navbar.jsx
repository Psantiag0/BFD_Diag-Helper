import { Link } from "react-router-dom";
import {
  FcHome,
  FcPlus,
  FcBusinessman,
  FcClock,
  FcSettings,
  FcPortraitMode,
  FcUnlock,
} from "react-icons/fc";
import Logout from "./Logout";

export default function Navbar({
  expanded,
  setExpanded,
  mobileOpen,
  setMobileOpen,
}) {
  const usuario = JSON.parse(localStorage.getItem("usuario")) || {
    nome: "Usuário",
    email: "admin@app.com",
    perfil: "administrador",
  };

  const avatarPorTipo = {
    recepcionista:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&q=80",
    administrador:
      "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=256&q=80",
    medico:
      "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=256&q=80",
  };

  const avatarFinal =
    avatarPorTipo[usuario.perfil] ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2.25&w=256&q=80";

  const menuItems = [
    { to: "/dashboard", icon: FcHome, label: "Dashboard" },
    { to: "/GerarLaudo", icon: FcPlus, label: "Gerar laudo" },
    { to: "/CadastroPacientes", icon: FcPortraitMode, label: "Paciente" },

    // 🔐 APENAS ADMIN
    usuario.perfil === "administrador" && {
      to: "/CadastroUsuario",
      icon: FcBusinessman,
      label: "Usuários",
    },

    usuario.perfil === "administrador" && {
      to: "/AdminSolicitacoesSenha",
      icon: FcUnlock,
      label: "Solicitações de senha",
    },

    usuario.perfil === "administrador" && {
      to: "/LogsAuditoria",
      icon: FcClock,
      label: "Logs de Auditoria",
    },

    { to: "/Configuracoes", icon: FcSettings, label: "Configurações" },
  ].filter(Boolean);

  return (
    <>
      {/* Backdrop mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 md:hidden ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        onMouseEnter={() => window.innerWidth >= 768 && setExpanded(true)}
        onMouseLeave={() => window.innerWidth >= 768 && setExpanded(false)}
        className={`
          fixed top-0 left-0 h-screen bg-white shadow-xl z-40
          transition-all duration-300 flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${expanded ? "md:w-60 xl:w-64" : "md:w-20"}
        `}
      >
        {/* LOGO */}
        <div className="flex items-center justify-center h-20">
          <img
            src="src/assets/6.svg"
            alt="Logo"
            className={`transition-all ${
              expanded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* MENU */}
        <nav className="flex flex-col px-3 gap-2">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 h-12 px-3 rounded-lg
              bg-slate-100 hover:bg-primary-200 transition"
            >
              <item.icon size={22} />
              {expanded && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* FOOTER */}
        <div className="mt-auto border-t p-3 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <img
              src={avatarFinal}
              className="w-10 h-10 rounded-full ring-2 ring-slate-900"
            />
            {expanded && (
              <div>
                <p className="font-bold text-sm">{usuario.nome}</p>
                <p className="text-xs text-slate-500">{usuario.email}</p>
              </div>
            )}
          </div>

          <Logout expanded={expanded} />
        </div>
      </aside>
    </>
  );
}
