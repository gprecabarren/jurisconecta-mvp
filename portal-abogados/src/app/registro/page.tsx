"use client";

import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CircleUserRound, Scale } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function RegistroForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("tipo") === "abogado" ? "lawyer" : "person";
  const [role, setRole] = useState<"person" | "lawyer">(initialRole);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) { setMessage("La autenticación se activará al conectar el proyecto de Supabase."); return; }
    setLoading(true); setMessage("");
    const { error } = await supabase.auth.signUp({
      email: String(form.get("email")), password: String(form.get("password")),
      options: { data: { full_name: String(form.get("fullName")), intended_role: role } },
    });
    setLoading(false);
    setMessage(error ? error.message : "Revisa tu correo para confirmar la cuenta. Tu perfil quedará listo para completar.");
  }

  return <main className="auth-page"><Link className="auth-brand" href="/"><span><Scale size={20}/></span>JurisConecta</Link><section className="auth-card"><p className="eyebrow">Crear una cuenta</p><h1>Comienza de la forma que te sirva.</h1><p className="auth-intro">Podrás completar tu perfil después. Las cuentas de abogado pasan por una revisión antes de recibir casos.</p><div className="role-picker"><button className={role === "person" ? "role-option selected" : "role-option"} onClick={() => setRole("person")} type="button"><CircleUserRound size={22}/><span><strong>Busco un abogado</strong><small>Publicaré o revisaré mis casos</small></span></button><button className={role === "lawyer" ? "role-option selected" : "role-option"} onClick={() => setRole("lawyer")} type="button"><BriefcaseBusiness size={22}/><span><strong>Soy abogado/a</strong><small>Crearé mi perfil profesional</small></span></button></div><form className="auth-form" onSubmit={register}><label>Nombre completo<input required name="fullName" placeholder="Tu nombre y apellido" /></label><label>Correo electrónico<input required type="email" name="email" placeholder="nombre@correo.cl" /></label><label>Contraseña<input required type="password" minLength={8} name="password" placeholder="Mínimo 8 caracteres" /></label><button className="primary-button" disabled={loading}>{loading ? "Creando cuenta..." : "Crear cuenta"}<ArrowRight size={18}/></button></form>{message && <p className="form-message">{message}</p>}<p className="auth-switch">¿Ya tienes una cuenta? <Link href="/ingresar">Ingresa aquí</Link></p></section></main>;
}

export default function RegistroPage() {
  return <Suspense fallback={<main className="auth-page" /> }><RegistroForm /></Suspense>;
}
