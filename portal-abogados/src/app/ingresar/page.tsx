"use client";

import Link from "next/link";
import { ArrowRight, Scale } from "lucide-react";
import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function IngresarPage() {
  const [message, setMessage] = useState(""); const [loading, setLoading] = useState(false);
  async function login(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); const supabase = getSupabaseBrowserClient(); if (!supabase) { setMessage("La autenticación se activará al conectar el proyecto de Supabase."); return; } setLoading(true); const { error } = await supabase.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) }); setLoading(false); if (error) { setMessage(error.message); return; } window.location.assign("/panel"); }
  return <main className="auth-page"><Link className="auth-brand" href="/"><span><Scale size={20}/></span>JurisConecta</Link><section className="auth-card compact"><p className="eyebrow">Bienvenido de vuelta</p><h1>Ingresa a tu cuenta.</h1><p className="auth-intro">Personas, profesionales y administradores ingresan desde el mismo lugar. El sistema mostrará el panel que corresponda a tu rol.</p><form className="auth-form" onSubmit={login}><label>Correo electrónico<input required type="email" name="email" placeholder="nombre@correo.cl" /></label><label>Contraseña<input required type="password" name="password" placeholder="Tu contraseña" /></label><button className="primary-button" disabled={loading}>{loading ? "Ingresando..." : "Ingresar"}<ArrowRight size={18}/></button></form>{message && <p className="form-message">{message}</p>}<p className="auth-switch">¿Aún no tienes cuenta? <Link href="/registro">Crea una aquí</Link></p></section></main>;
}
