"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CircleUserRound, Scale } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { chileRegions } from "../../../shared/chile";

function RegistroForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("tipo") === "abogado" ? "lawyer" : "person";
  const [role, setRole] = useState<"person" | "lawyer">(initialRole);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: form.get("fullName"), email: form.get("email"), password: form.get("password"), phone: form.get("phone"), region: form.get("region"), commune: form.get("commune"), role }) });
      const result = await response.json() as { error?: string; destination?: string };
      if (!response.ok || !result.destination) throw new Error(result.error || "No pudimos crear tu cuenta.");
      window.location.assign(result.destination);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No pudimos crear tu cuenta.");
      setLoading(false);
    }
  }

  return <main className="auth-page"><Link className="auth-brand" href="/"><span><Scale size={20} /></span>JurisConecta</Link><section className="auth-card"><p className="eyebrow">Crear una cuenta</p><h1>Comienza de la forma que te sirva.</h1><p className="auth-intro">Las cuentas profesionales quedan pendientes de revisión antes de recibir oportunidades.</p><div className="role-picker"><button className={role === "person" ? "role-option selected" : "role-option"} onClick={() => setRole("person")} type="button"><CircleUserRound size={22} /><span><strong>Busco un abogado</strong><small>Publicaré y revisaré mis casos</small></span></button><button className={role === "lawyer" ? "role-option selected" : "role-option"} onClick={() => setRole("lawyer")} type="button"><BriefcaseBusiness size={22} /><span><strong>Soy abogado/a</strong><small>Crearé mi perfil profesional</small></span></button></div><form className="auth-form" onSubmit={register}><label>Nombre completo<input required name="fullName" autoComplete="name" placeholder="Tu nombre y apellido" /></label><label>Correo electrónico<input required type="email" name="email" autoComplete="email" placeholder="nombre@correo.cl" /></label><label>Teléfono<input name="phone" type="tel" autoComplete="tel" placeholder="+56 9 1234 5678" /></label><div className="form-grid two"><label>Región<select name="region" defaultValue=""><option value="">Selecciona una región</option>{chileRegions.map((region) => <option key={region}>{region}</option>)}</select></label><label>Comuna<input name="commune" placeholder="Tu comuna" /></label></div><label>Contraseña<input required type="password" minLength={8} name="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" /></label><button className="primary-button" disabled={loading}>{loading ? "Creando cuenta..." : "Crear cuenta"}<ArrowRight size={18} /></button></form>{message && <p className="form-message">{message}</p>}<p className="auth-switch">¿Ya tienes una cuenta? <Link href="/ingresar">Ingresa aquí</Link></p></section></main>;
}

export default function RegistroPage() {
  return <Suspense fallback={<main className="auth-page" />}><RegistroForm /></Suspense>;
}
