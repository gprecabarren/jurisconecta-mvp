"use client";

import { Bell, CheckCircle2, ChevronRight, Eye, FileText, Mail, Star, UsersRound } from "lucide-react";
import { PortalShell } from "../../components/portal-shell";

const notices = ["Nuevo caso preferente disponible en Derecho Penal", "Tu perfil recibió una nueva visita", "Recuerda actualizar tu modalidad de atención", "Hay casos del pool que coinciden con tus áreas"];

export default function DashboardPage() {
  return <PortalShell>
    <div className="portal-page-heading"><div><p className="eyebrow">Panel profesional</p><h1>Buenos días, María Teresa.</h1><p>Tu actividad y oportunidades de esta semana.</p></div><button className="portal-outline-button">Ver mi perfil <ChevronRight size={17} /></button></div>
    <section className="metric-grid" aria-label="Resumen de actividad">
      <article><span className="metric-icon"><FileText size={20} /></span><p>Casos derivados</p><strong>7</strong><small>+7 en los últimos 30 días</small></article>
      <article><span className="metric-icon"><Eye size={20} /></span><p>Visitas a tu perfil</p><strong>5</strong><small>+5 en los últimos 30 días</small></article>
      <article><span className="metric-icon"><Star size={20} /></span><p>Valoración promedio</p><strong>Sin evaluaciones</strong><small>Tu reputación se mostrará aquí</small></article>
    </section>
    <section className="dashboard-grid">
      <article className="portal-panel activity-panel">
        <div className="panel-title"><div><p className="eyebrow">Actividad</p><h2>Objetivo de contactos</h2></div><span className="status-badge">Agosto 2026</span></div>
        <div className="activity-chart" aria-label="Gráfico de actividad mensual"><div className="chart-line" /><div className="chart-dot dot-one" /><div className="chart-dot dot-two" /><div className="chart-label start">01 ago</div><div className="chart-label end">31 ago</div><div className="chart-goal">Meta mensual: 12 contactos</div></div>
        <div className="chart-foot"><span><i /> Contactos realizados: 1</span><span><i className="gold" /> Meta definida: 12</span></div>
      </article>
      <article className="portal-panel notifications-panel">
        <div className="panel-title"><div><p className="eyebrow">Bandeja</p><h2>Actividad reciente</h2></div><Bell size={20} /></div>
        <div className="notification-list">{notices.map((notice, index) => <button className="notice-row" key={notice}><span className="notice-icon"><Mail size={16} /></span><span><b>{notice}</b><small>{index < 2 ? "Hoy" : "Esta semana"}</small></span><ChevronRight size={16} /></button>)}</div>
      </article>
    </section>
    <section className="portal-panel opportunities-panel" id="preferentes">
      <div className="panel-title"><div><p className="eyebrow">Oportunidades</p><h2>Casos preferentes para ti</h2></div><a href="#pool">Ver casos del pool <ChevronRight size={16} /></a></div>
      <div className="opportunity-row"><span className="opportunity-icon"><UsersRound size={20} /></span><div><b>Defensa en causa penal</b><p>Región Metropolitana · Atención presencial u online</p></div><span className="credit-chip">8 créditos</span><button className="portal-primary-button">Revisar caso</button></div>
      <div className="opportunity-row" id="pool"><span className="opportunity-icon"><CheckCircle2 size={20} /></span><div><b>Orientación por accidente de tránsito</b><p>Concepción · Atención remota</p></div><span className="credit-chip">5 créditos</span><button className="portal-primary-button">Revisar caso</button></div>
    </section>
  </PortalShell>;
}
