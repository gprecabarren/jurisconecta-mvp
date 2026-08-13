"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, ContactRound, Filter, LockKeyhole, Mail, MapPin, Phone, Search, SlidersHorizontal, Star, UsersRound } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PortalShell } from "./portal-shell";

type LegalCase = { id: string; category: string; title: string; description: string; region: string | null; status: string; created_at: string; attention_mode: string | null; commune: string | null; credit_cost: number; contact_accessed: number; preferred: number; contact_name: string | null; contact_email: string | null; contact_phone: string | null; contact_region: string | null; contact_commune: string | null; };

function timeAgo(value: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(`${value.replace(" ", "T")}Z`).getTime()) / 86400000));
  return days === 0 ? "Hoy" : days === 1 ? "Ayer" : `Hace ${days} días`;
}

function ContactBlock({ item }: { item: LegalCase }) {
  return <div className="case-contact"><p><ContactRound size={14} /> {item.contact_name}</p><p><Mail size={14} /> <a href={`mailto:${item.contact_email || ""}`}>{item.contact_email}</a></p><p><Phone size={14} /> <a href={`https://wa.me/${(item.contact_phone || "").replace(/\D/g, "")}`} target="_blank" rel="noreferrer">{item.contact_phone || "Sin teléfono"}</a></p><p><MapPin size={14} /> {item.contact_commune || item.contact_region || "Ubicación por definir"}</p></div>;
}

function CaseCard({ item, onAccess, loading }: { item: LegalCase; onAccess: (id: string) => void; loading: boolean }) {
  const accessed = Boolean(item.contact_accessed);
  return <article className="case-list-card case-live-card"><div className="case-card-top"><span className="case-category">{item.category}</span><span className={accessed ? "state-chip active" : "credit-chip"}>{accessed ? "Datos revelados" : `${item.credit_cost} créditos`}</span></div><h2>{item.title}</h2><p><MapPin size={15} /> {item.commune || item.region || "Atención flexible"} <span>·</span> {item.attention_mode === "remote" ? "Remota" : item.attention_mode === "presencial" ? "Presencial" : "Remota o presencial"}</p><p className="case-description">{item.description.slice(0, 190)}{item.description.length > 190 ? "..." : ""}</p>{accessed && <ContactBlock item={item} />}<footer><span><Clock3 size={14} /> {timeAgo(item.created_at)}</span>{accessed ? <span className="contact-ready"><CheckCircle2 size={15} /> Contacta directo</span> : <button className="portal-primary-button" disabled={loading} onClick={() => onAccess(item.id)}><LockKeyhole size={14} /> {loading ? "Desbloqueando..." : "Desbloquear"}</button>}</footer></article>;
}

function CasesView({ view }: { view: "pool" | "preferred" | "accessed" }) {
  const [cases, setCases] = useState<LegalCase[]>([]);
  const [balance, setBalance] = useState(0);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [loadingId, setLoadingId] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setLoading(true); try { const response = await fetch(`/api/lawyer/cases?view=${view}`); const result = await response.json() as { cases?: LegalCase[]; creditBalance?: number; error?: string }; if (!response.ok) throw new Error(result.error || "No pudimos cargar los casos."); setCases(result.cases || []); setBalance(result.creditBalance || 0); } catch (error) { setNotice(error instanceof Error ? error.message : "No pudimos cargar los casos."); } finally { setLoading(false); } }, [view]);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  async function access(caseId: string) { setLoadingId(caseId); setNotice(""); try { const response = await fetch("/api/lawyer/cases?action=access", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ caseId }) }); const result = await response.json() as { error?: string; creditBalance?: number }; if (!response.ok) throw new Error(result.error || "No pudimos desbloquear el caso."); setBalance(result.creditBalance || balance); setNotice("Datos de contacto revelados. Puedes comunicarte directamente con la persona."); await load(); } catch (error) { setNotice(error instanceof Error ? error.message : "No pudimos desbloquear el caso."); } finally { setLoadingId(""); } }
  const visible = useMemo(() => cases.filter((item) => `${item.title} ${item.category} ${item.region || ""}`.toLowerCase().includes(query.toLowerCase())), [cases, query]);
  const heading = view === "pool" ? ["Oportunidades disponibles", "Casos del pool", "Todos los casos abiertos. Tus coincidencias aparecen primero."] : view === "preferred" ? ["Coincidencias profesionales", "Casos preferentes", "Casos que se ajustan a las especialidades de tu perfil."] : ["Historial profesional", "Casos accedidos", "Personas cuyos datos de contacto ya desbloqueaste."];
  return <PortalShell><div className="portal-page-heading"><div><p className="eyebrow">{heading[0]}</p><h1>{heading[1]}</h1><p>{heading[2]}</p></div>{view === "pool" && <span className="credit-availability"><LockKeyhole size={16} /> {balance} créditos disponibles</span>}</div>{notice && <p className="save-confirmation">{notice}</p>}<section className="case-toolbar"><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por materia o región" /></label><button><Filter size={16} /> {view === "preferred" ? "Coincidencias" : "Todos los casos"}</button><span>{loading ? "Cargando..." : `${visible.length} ${visible.length === 1 ? "oportunidad" : "oportunidades"}`}</span></section>{!loading && visible.length === 0 ? <section className="portal-panel preferred-empty"><span className="empty-mark">{view === "preferred" ? <Star size={29} /> : <UsersRound size={29} />}</span><p className="eyebrow">Sin resultados</p><h2>{view === "preferred" ? "Todavía no hay coincidencias para tu perfil." : view === "accessed" ? "Todavía no has desbloqueado casos." : "No hay casos que coincidan con tu búsqueda."}</h2><p>La disponibilidad cambia a medida que las personas publican nuevos casos.</p>{view !== "pool" && <Link className="portal-primary-button" href="/casos/pool">Explorar casos del pool <ArrowRight size={17} /></Link>}</section> : <div className="case-list-grid">{visible.map((item) => <CaseCard item={item} onAccess={access} loading={loadingId === item.id} key={item.id} />)}</div>}<section className="tips-grid"><article><span><ContactRound size={19} /></span><h2>Contacto directo</h2><p>Al desbloquear un caso verás nombre, correo, teléfono y ubicación para comunicarte sin chat interno.</p></article><article><span><SlidersHorizontal size={19} /></span><h2>Créditos claros</h2><p>Cada acceso descuenta el costo definido para ese caso, una sola vez por abogado.</p></article></section></PortalShell>;
}

export function PoolCasesPage() { return <CasesView view="pool" />; }
export function PreferredCasesPage() { return <CasesView view="preferred" />; }
export function AccessedCasesPage() { return <CasesView view="accessed" />; }
