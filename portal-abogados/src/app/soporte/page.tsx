"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight, CircleHelp, Scale, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { defaultHelp, readStore, type HelpArticle } from "../../components/content-store";

export default function SupportPage() {
  const [articles, setArticles] = useState<HelpArticle[]>(defaultHelp); const [query, setQuery] = useState("");
  useEffect(() => setArticles(readStore("jurisconecta-help", defaultHelp)), []);
  const categories = Array.from(new Set(articles.map((article) => article.category)));
  const filtered = useMemo(() => articles.filter((article) => `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(query.toLowerCase())), [articles, query]);
  return <main className="support-page"><header className="public-content-header"><Link className="brand" href="/"><span className="brand-mark"><Scale size={21} /></span><span>Juris<span>Conecta</span></span></Link><nav><Link href="/">Inicio</Link><Link href="/equipo">Equipo</Link><Link href="/ingresar">Ingresar</Link></nav></header><section className="support-hero"><CircleHelp size={31} /><p className="eyebrow">Centro de ayuda</p><h1>¿Cómo podemos ayudarte?</h1><label className="support-search"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busca una respuesta" /></label></section><section className="support-content"><div className="support-category-list">{categories.map((category) => <a href={`#${category.replaceAll(" ", "-")}`} key={category}>{category}<ChevronRight size={16} /></a>)}</div><div className="support-groups">{categories.map((category) => { const group = filtered.filter((article) => article.category === category); if (!group.length) return null; return <section id={category.replaceAll(" ", "-")} key={category}><p className="eyebrow">{category}</p><div className="article-grid">{group.map((article) => <button className="article-card" key={article.id}><h2>{article.title}</h2><p>{article.excerpt}</p><span>Ver artículo <ArrowRight size={15} /></span></button>)}</div></section>; })}{!filtered.length && <p className="no-results">No encontramos artículos con esa búsqueda.</p>}</div></section><section className="support-contact"><div><p className="eyebrow">¿Aún necesitas ayuda?</p><h2>Estamos para orientarte.</h2><p>Para cambios importantes en tu cuenta, escríbenos desde soporte.</p></div><a className="secondary-button" href="mailto:hola@jurisconecta.cl">Contactar soporte <ArrowRight size={17} /></a></section></main>;
}
