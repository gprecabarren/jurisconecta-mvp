"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, FilePlus2, FolderOpen, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { ClientShell } from "../../components/client-shell";

type LegalCase = { id: string; category: string; title: string; description: string; region: string | null; status: string; created_at: string; attention_mode: string | null; commune: string | null; };

function statusLabel(status: string) {
  return status === "open" ? "Disponible para revisión" : status === "matched" ? "En conversación" : status === "closed" ? "Cerrado" : "Borrador";
}

export default function ClientDashboardPage() {
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { void fetch("/api/cases").then((response) => response.ok ? response.json() : Promise.reject()).then((result: { cases: LegalCase[] }) => setCases(result.cases)).catch(() => undefined).finally(() => setLoading(false)); }, []);
  return <ClientShell><div className="portal-page-heading"><div><p className="eyebrow">Área personal</p><h1>Tu orientación legal, en orden.</h1><p>Desde aquí puedes publicar casos y seguir las respuestas que recibas.</p></div><Link className="portal-primary-button" href="/publicar-caso"><FilePlus2 size={17} /> Publicar un caso</Link></div><section className="client-summary"><article><span className="metric-icon"><FolderOpen size={20} /></span><p>Casos publicados</p><strong>{loading ? "-" : cases.length}</strong><small>Visibles solo para profesionales habilitados</small></article><article><span className="metric-icon"><Clock3 size={20} /></span><p>En revisión</p><strong>{loading ? "-" : cases.filter((item) => item.status === "open").length}</strong><small>Esperando propuestas o contactos</small></article><article><span className="metric-icon"><CheckCircle2 size={20} /></span><p>Tu decisión</p><strong>Siempre tuya</strong><small>No te comprometes al publicar</small></article></section><section className="portal-panel client-cases" id="mis-casos"><div className="panel-title"><div><p className="eyebrow">Mis solicitudes</p><h2>Casos publicados</h2></div>{cases.length > 0 && <span className="content-count">{cases.length} {cases.length === 1 ? "caso" : "casos"}</span>}</div>{loading ? <p className="client-loading">Cargando tus solicitudes...</p> : cases.length === 0 ? <div className="client-empty"><span className="empty-mark"><FilePlus2 size={25} /></span><h2>Aún no has publicado un caso.</h2><p>Elige una materia y cuéntanos brevemente qué necesitas resolver.</p><Link className="portal-primary-button" href="/publicar-caso">Publicar mi primer caso <ArrowRight size={17} /></Link></div> : <div className="client-case-list">{cases.map((legalCase) => <article className="client-case-row" key={legalCase.id}><div><p className="eyebrow">{legalCase.category}</p><h3>{legalCase.title}</h3><p>{legalCase.description}</p><small><MapPin size={13} /> {legalCase.commune || legalCase.region || "Atención por definir"} · {legalCase.attention_mode || "Modalidad por definir"}</small></div><span className={`case-state ${legalCase.status}`}>{statusLabel(legalCase.status)}</span></article>)}</div>}</section></ClientShell>;
}
