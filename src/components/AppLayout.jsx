import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Package, LogOut, Menu, X, Leaf, UserRound
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Visão geral", icon: LayoutDashboard },
  { to: "/produtos", label: "Produtos", icon: Package },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-white/10 bg-[#0c110e]">
      <div className="flex h-[76px] items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173d2a] text-[#72d69a]">
          <Leaf size={21} />
        </div>
        <div>
          <p className="font-semibold tracking-wide">VERDE<span className="text-[#72d69a]">.</span></p>
          <p className="text-[10px] uppercase tracking-[.2em] text-gray-500">Admin workspace</p>
        </div>
      </div>

      <div className="px-4 pt-7">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[.2em] text-gray-600">Menu principal</p>
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  isActive
                    ? "bg-[#173d2a] font-medium text-[#8be2ad]"
                    : "text-gray-400 hover:bg-white/[.04] hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto border-t border-white/10 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[.03] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#214b34] text-[#a4edbd]">
            <UserRound size={17} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{user?.firstName || user?.username || "Usuário"}</p>
            <p className="truncate text-xs text-gray-500">{user?.email || "Conta de demonstração"}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-red-500/10 hover:text-red-300">
          <LogOut size={17} /> Sair da conta
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-[#080b09] text-white">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">{sidebar}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button aria-label="Fechar menu" className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-72 max-w-[85vw]">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-white/10 bg-[#080b09]/90 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button aria-label="Abrir menu" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-gray-300 hover:bg-white/5 lg:hidden">
              <Menu size={21} />
            </button>
            <div>
              <p className="text-sm font-medium">Workspace</p>
              <p className="text-xs text-gray-500">Painel administrativo</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#286b45]/40 bg-[#173d2a]/40 px-3 py-1.5 text-xs text-[#8be2ad] sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-[#72d69a]" />
            Ambiente de demonstração
          </div>
        </header>
        <main className="mx-auto max-w-[1600px] p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
