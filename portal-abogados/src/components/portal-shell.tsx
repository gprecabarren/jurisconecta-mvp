"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  CircleHelp,
  ClipboardList,
  ContactRound,
  FileCheck2,
  LayoutDashboard,
  Scale,
  Settings2,
  Star,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";

const lawyerItems = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard#preferentes", label: "Casos preferentes", icon: Star },
  { href: "/dashboard#pool", label: "Casos del pool", icon: UsersRound },
  { href: "/dashboard#accedidos", label: "Casos accedidos", icon: FileCheck2 },
  { href: "/dashboard#evaluaciones", label: "Evaluaciones", icon: BarChart3 },
  { href: "/account", label: "Mi cuenta", icon: Settings2 },
];

export function PortalShell({ children, admin = false }: { children: ReactNode; admin?: boolean }) {
  const pathname = usePathname();
  const items = admin
    ? [
        { href: "/admin", label: "Resumen", icon: LayoutDashboard },
        { href: "/admin#perfiles", label: "Perfiles", icon: ContactRound },
        { href: "/admin#equipo", label: "Equipo", icon: UsersRound },
        { href: "/admin#soporte", label: "Centro de ayuda", icon: CircleHelp },
      ]
    : lawyerItems;

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <Link className="portal-logo" href="/"><span><Scale size={22} /></span>Juris<strong>Conecta</strong></Link>
        <p className="portal-caption">{admin ? "Administración" : "Área profesional"}</p>
        <nav className="portal-nav" aria-label="Navegación del portal">
          {items.map(({ href, label, icon: Icon }) => {
            const active = href === "/dashboard" ? pathname === "/dashboard" : href === "/admin" ? pathname === "/admin" : pathname === href;
            return <Link className={active ? "portal-nav-item active" : "portal-nav-item"} key={href} href={href}><Icon size={18} /><span>{label}</span></Link>;
          })}
        </nav>
        <div className="portal-sidebar-bottom">
          <Link href="/soporte"><CircleHelp size={17} /> Ayuda y soporte</Link>
          <Link href="/"><BriefcaseBusiness size={17} /> Ver sitio público</Link>
        </div>
      </aside>
      <section className="portal-workspace">
        <header className="portal-topbar">
          {!admin ? <div className="plan-summary"><span><b>191</b> / 200 créditos del plan</span><span><b>0</b> créditos de reserva</span></div> : <div className="plan-summary"><span><b>JurisConecta</b> gestión interna</span><span>Modo demostración</span></div>}
          <div className="portal-user"><span className="topbar-notice">{admin ? "Administrador" : "Plan Silver"}</span><span className="avatar">MR</span></div>
        </header>
        <main className="portal-main">{children}</main>
      </section>
    </div>
  );
}
