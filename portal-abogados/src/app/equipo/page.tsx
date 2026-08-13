"use client";

import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { useEffect, useState } from "react";
import { defaultTeam, readStore, type TeamMember } from "../../components/content-store";

export default function EquipoPage() {
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
  useEffect(() => setTeam(readStore("jurisconecta-team", defaultTeam)), []);
  return <main className="public-content-page"><header className="public-content-header"><Link className="brand" href="/"><span className="brand-mark"><Scale size={21} /></span><span>Juris<span>Conecta</span></span></Link><nav><Link href="/">Inicio</Link><Link href="/soporte">Soporte</Link><Link href="/registro?tipo=abogado">Crear perfil</Link></nav></header><section className="content-hero"><p className="eyebrow">Personas detrás de la plataforma</p><h1>Una forma más clara de conectar con orientación legal.</h1><p>Construimos JurisConecta para que encontrar apoyo jurídico sea una experiencia cercana, informada y respetuosa.</p></section><section className="team-grid">{team.map((member) => <article className="team-card" key={member.id}><span className="team-photo">{member.initials}</span><p className="eyebrow">{member.role}</p><h2>{member.name}</h2><p>{member.bio}</p></article>)}</section><section className="content-cta"><div><p className="eyebrow">Trabajemos juntos</p><h2>¿Eres abogado o abogada?</h2><p>Construye un perfil profesional y recibe oportunidades acordes a tu práctica.</p></div><Link className="primary-button" href="/registro?tipo=abogado">Crear perfil <ArrowRight size={18} /></Link></section></main>;
}
