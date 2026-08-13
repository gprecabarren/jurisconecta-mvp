"use client";

import { CheckCircle2, FilePlus2, PenLine, Plus, Search, ShieldCheck, Trash2, UsersRound } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { defaultHelp, defaultTeam, type HelpArticle, type TeamMember } from "../../components/content-store";
import { PortalShell } from "../../components/portal-shell";

const profiles = [
  ["María Teresa Recabarren", "Derecho Penal · Biobío", "Pendiente de revisión", "mrecabarrend@gmail.com"],
  ["Pablo San Martín", "Derecho Laboral · Metropolitana", "Activo", "pablo@ejemplo.cl"],
  ["Camila Fuentes", "Derecho Familiar · Valparaíso", "Activo", "camila@ejemplo.cl"],
];

export default function AdminPage() {
  const [team, setTeam] = useState(defaultTeam);
  const [help, setHelp] = useState(defaultHelp);
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadContent() {
      try {
        const response = await fetch("/api/admin/content");
        if (!response.ok) throw new Error("No se pudo cargar el contenido");
        const content = await response.json() as { team?: TeamMember[]; help?: HelpArticle[] };
        if (!active) return;
        if (Array.isArray(content.team)) setTeam(content.team);
        if (Array.isArray(content.help)) setHelp(content.help);
      } catch {
        if (active) setNotice("No pudimos conectar el contenido. Revisa la configuración de la base de datos.");
      }
    }
    void loadContent();
    return () => { active = false; };
  }, []);

  async function saveContent(nextTeam: TeamMember[], nextHelp: HelpArticle[]) {
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ team: nextTeam, help: nextHelp }),
      });
      if (!response.ok) throw new Error("No se pudo guardar el contenido");
      setTeam(nextTeam);
      setHelp(nextHelp);
      setNotice("Cambios publicados.");
    } catch {
      setNotice("No pudimos publicar los cambios. Inténtalo nuevamente.");
    } finally {
      setSaving(false);
    }
  }

  function persistTeam(next: TeamMember[]) { void saveContent(next, help); }
  function persistHelp(next: HelpArticle[]) { void saveContent(team, next); }

  return <PortalShell admin>
    <div className="portal-page-heading"><div><p className="eyebrow">Administración</p><h1>Panel de control</h1><p>Gestiona perfiles, equipo y contenido de ayuda del MVP.</p></div><span className="admin-state"><ShieldCheck size={17} /> Administración protegida</span></div>
    {notice && <p className="save-confirmation admin-confirmation"><CheckCircle2 size={17} /> {notice}</p>}
    <section className="metric-grid admin-metrics"><article><span className="metric-icon"><UsersRound size={20} /></span><p>Perfiles profesionales</p><strong>3</strong><small>1 pendiente de revisión</small></article><article><span className="metric-icon"><FilePlus2 size={20} /></span><p>Casos publicados</p><strong>7</strong><small>Últimos 30 días</small></article><article><span className="metric-icon"><ShieldCheck size={20} /></span><p>Contenido público</p><strong>{team.length + help.length}</strong><small>Equipo y soporte</small></article></section>
    <section className="portal-panel admin-panel" id="perfiles"><div className="panel-title"><div><p className="eyebrow">Revisión</p><h2>Perfiles del sitio</h2></div><label className="admin-search"><Search size={16} /><input placeholder="Buscar perfil" /></label></div><div className="profile-table">{profiles.map(([name, specialty, state, email]) => <div className="profile-row" key={email}><span className="profile-mini-avatar">{name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><div><b>{name}</b><small>{email}</small></div><span>{specialty}</span><span className={state === "Activo" ? "state-chip active" : "state-chip"}>{state}</span><button className="icon-action" aria-label={`Editar ${name}`}><PenLine size={16} /></button></div>)}</div></section>
    <section className="admin-content-grid"><TeamManager members={team} onChange={persistTeam} saving={saving} /><HelpManager articles={help} onChange={persistHelp} saving={saving} /></section>
  </PortalShell>;
}

function TeamManager({ members, onChange, saving }: { members: TeamMember[]; onChange: (next: TeamMember[]) => void; saving: boolean }) {
  const [draft, setDraft] = useState({ name: "", role: "", bio: "" });
  function add(event: FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    const initials = draft.name.split(" ").map((word) => word[0]).join("").slice(0, 2).toUpperCase();
    onChange([...members, { id: crypto.randomUUID(), initials, ...draft }]);
    setDraft({ name: "", role: "", bio: "" });
  }
  return <section className="portal-panel content-manager" id="equipo"><div className="panel-title"><div><p className="eyebrow">Sitio público</p><h2>Equipo</h2></div><span className="content-count">{members.length} miembros</span></div><div className="managed-list">{members.map((member) => <div className="managed-row" key={member.id}><span className="team-initials">{member.initials}</span><div><b>{member.name}</b><small>{member.role}</small></div><button disabled={saving} onClick={() => onChange(members.filter((item) => item.id !== member.id))} className="delete-button" aria-label={`Eliminar a ${member.name}`}><Trash2 size={16} /></button></div>)}</div><form className="manager-form" onSubmit={add}><h3>Agregar miembro</h3><input disabled={saving} value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Nombre completo" required /><input disabled={saving} value={draft.role} onChange={(event) => setDraft({ ...draft, role: event.target.value })} placeholder="Rol o cargo" required /><textarea disabled={saving} value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} placeholder="Descripción breve" rows={2} /><button disabled={saving} className="portal-primary-button"><Plus size={16} /> {saving ? "Publicando..." : "Agregar al equipo"}</button></form></section>;
}

function HelpManager({ articles, onChange, saving }: { articles: HelpArticle[]; onChange: (next: HelpArticle[]) => void; saving: boolean }) {
  const [draft, setDraft] = useState({ title: "", category: "Perfil profesional", excerpt: "" });
  function add(event: FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onChange([...articles, { id: crypto.randomUUID(), ...draft }]);
    setDraft({ title: "", category: "Perfil profesional", excerpt: "" });
  }
  return <section className="portal-panel content-manager" id="soporte"><div className="panel-title"><div><p className="eyebrow">Sitio público</p><h2>Centro de ayuda</h2></div><span className="content-count">{articles.length} artículos</span></div><div className="managed-list help-list">{articles.map((article) => <div className="managed-row" key={article.id}><span className="help-category">{article.category}</span><div><b>{article.title}</b><small>{article.excerpt}</small></div><button disabled={saving} onClick={() => onChange(articles.filter((item) => item.id !== article.id))} className="delete-button" aria-label={`Eliminar ${article.title}`}><Trash2 size={16} /></button></div>)}</div><form className="manager-form" onSubmit={add}><h3>Agregar artículo</h3><input disabled={saving} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Título del artículo" required /><select disabled={saving} value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option>Perfil profesional</option><option>Casos y oportunidades</option><option>Plan y facturación</option><option>Cuenta y seguridad</option></select><textarea disabled={saving} value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} placeholder="Resumen del artículo" rows={2} /><button disabled={saving} className="portal-primary-button"><Plus size={16} /> {saving ? "Publicando..." : "Agregar artículo"}</button></form></section>;
}
