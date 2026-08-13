"use client";

import { CheckCircle2, FilePlus2, PenLine, Plus, Search, ShieldCheck, Trash2, UsersRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { defaultHelp, defaultTeam, readStore, type HelpArticle, type TeamMember, writeStore } from "../../components/content-store";
import { PortalShell } from "../../components/portal-shell";

const profiles = [
  ["María Teresa Recabarren", "Derecho Penal · Biobío", "Pendiente de revisión", "mrecabarrend@gmail.com"],
  ["Pablo San Martín", "Derecho Laboral · Metropolitana", "Activo", "pablo@ejemplo.cl"],
  ["Camila Fuentes", "Derecho Familiar · Valparaíso", "Activo", "camila@ejemplo.cl"],
];

export default function AdminPage() {
  const [team, setTeam] = useState(defaultTeam); const [help, setHelp] = useState(defaultHelp); const [notice, setNotice] = useState("");
  useEffect(() => { setTeam(readStore("jurisconecta-team", defaultTeam)); setHelp(readStore("jurisconecta-help", defaultHelp)); }, []);
  function persistTeam(next: TeamMember[]) { setTeam(next); writeStore("jurisconecta-team", next); setNotice("Equipo actualizado."); }
  function persistHelp(next: HelpArticle[]) { setHelp(next); writeStore("jurisconecta-help", next); setNotice("Centro de ayuda actualizado."); }
  return <PortalShell admin>
    <div className="portal-page-heading"><div><p className="eyebrow">Administración</p><h1>Panel de control</h1><p>Gestiona perfiles, equipo y contenido de ayuda del MVP.</p></div><span className="admin-state"><ShieldCheck size={17} /> Panel de demostración</span></div>
    {notice && <p className="save-confirmation admin-confirmation"><CheckCircle2 size={17} /> {notice}</p>}
    <section className="metric-grid admin-metrics"><article><span className="metric-icon"><UsersRound size={20} /></span><p>Perfiles profesionales</p><strong>3</strong><small>1 pendiente de revisión</small></article><article><span className="metric-icon"><FilePlus2 size={20} /></span><p>Casos publicados</p><strong>7</strong><small>Últimos 30 días</small></article><article><span className="metric-icon"><ShieldCheck size={20} /></span><p>Contenido público</p><strong>{team.length + help.length}</strong><small>Equipo y soporte</small></article></section>
    <section className="portal-panel admin-panel" id="perfiles"><div className="panel-title"><div><p className="eyebrow">Revisión</p><h2>Perfiles del sitio</h2></div><label className="admin-search"><Search size={16} /><input placeholder="Buscar perfil" /></label></div><div className="profile-table">{profiles.map(([name, specialty, state, email]) => <div className="profile-row" key={email}><span className="profile-mini-avatar">{name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><b>{name}</b><small>{email}</small></div><span>{specialty}</span><span className={state === "Activo" ? "state-chip active" : "state-chip"}>{state}</span><button className="icon-action" aria-label={`Editar ${name}`}><PenLine size={16} /></button></div>)}</div></section>
    <section className="admin-content-grid"><TeamManager members={team} onChange={persistTeam} /><HelpManager articles={help} onChange={persistHelp} /></section>
  </PortalShell>;
}

function TeamManager({ members, onChange }: { members: TeamMember[]; onChange: (next: TeamMember[]) => void }) {
  const [draft, setDraft] = useState({ name: "", role: "", bio: "" });
  function add(event: FormEvent) { event.preventDefault(); if (!draft.name.trim()) return; const initials = draft.name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase(); onChange([...members, { id: crypto.randomUUID(), initials, ...draft }]); setDraft({ name: "", role: "", bio: "" }); }
  return <section className="portal-panel content-manager" id="equipo"><div className="panel-title"><div><p className="eyebrow">Sitio público</p><h2>Equipo</h2></div><span className="content-count">{members.length} miembros</span></div><div className="managed-list">{members.map((member) => <div className="managed-row" key={member.id}><span className="team-initials">{member.initials}</span><div><b>{member.name}</b><small>{member.role}</small></div><button onClick={() => onChange(members.filter((item) => item.id !== member.id))} className="delete-button" aria-label={`Eliminar a ${member.name}`}><Trash2 size={16} /></button></div>)}</div><form className="manager-form" onSubmit={add}><h3>Agregar miembro</h3><input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Nombre completo" required /><input value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} placeholder="Rol o cargo" required /><textarea value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} placeholder="Descripción breve" rows={2} /><button className="portal-primary-button"><Plus size={16} /> Agregar al equipo</button></form></section>;
}

function HelpManager({ articles, onChange }: { articles: HelpArticle[]; onChange: (next: HelpArticle[]) => void }) {
  const [draft, setDraft] = useState({ title: "", category: "Perfil profesional", excerpt: "" });
  function add(event: FormEvent) { event.preventDefault(); if (!draft.title.trim()) return; onChange([...articles, { id: crypto.randomUUID(), ...draft }]); setDraft({ title: "", category: "Perfil profesional", excerpt: "" }); }
  return <section className="portal-panel content-manager" id="soporte"><div className="panel-title"><div><p className="eyebrow">Sitio público</p><h2>Centro de ayuda</h2></div><span className="content-count">{articles.length} artículos</span></div><div className="managed-list help-list">{articles.map((article) => <div className="managed-row" key={article.id}><span className="help-category">{article.category}</span><div><b>{article.title}</b><small>{article.excerpt}</small></div><button onClick={() => onChange(articles.filter((item) => item.id !== article.id))} className="delete-button" aria-label={`Eliminar ${article.title}`}><Trash2 size={16} /></button></div>)}</div><form className="manager-form" onSubmit={add}><h3>Agregar artículo</h3><input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Título del artículo" required /><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option>Perfil profesional</option><option>Casos y oportunidades</option><option>Plan y facturación</option><option>Cuenta y seguridad</option></select><textarea value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} placeholder="Resumen del artículo" rows={2} /><button className="portal-primary-button"><Plus size={16} /> Agregar artículo</button></form></section>;
}
