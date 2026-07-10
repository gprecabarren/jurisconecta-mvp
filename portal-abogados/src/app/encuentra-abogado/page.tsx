"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Scale } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

const matters = ["Pensión de alimentos", "Divorcio", "Herencias y posesiones efectivas", "Despido injustificado", "Deudas y embargos", "Accidentes de tránsito", "Otro asunto"];

function EncuentraAbogadoForm() {
  const query = useSearchParams(); const preset = query.get("caso"); const [step, setStep] = useState(1); const [done, setDone] = useState(false);
  function next(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setStep(2); }
  if (done) return <main className="wizard-page"><Link className="auth-brand" href="/"><span><Scale size={20}/></span>JurisConecta</Link><section className="success-state"><CheckCircle2 size={52}/><p className="eyebrow">Solicitud preparada</p><h1>Gracias por contarnos.</h1><p>Cuando conectemos la base de datos, este formulario publicará tu caso y te pedirá crear o ingresar a una cuenta para mantener el seguimiento privado.</p><Link className="primary-button" href="/registro">Crear mi cuenta <ArrowRight size={18}/></Link></section></main>;
  return <main className="wizard-page"><Link className="auth-brand" href="/"><span><Scale size={20}/></span>JurisConecta</Link><section className="wizard-card"><div className="wizard-progress"><span className={step >= 1 ? "filled" : ""}>1</span><i/><span className={step >= 2 ? "filled" : ""}>2</span><i/><span>3</span></div>{step === 1 ? <><p className="eyebrow">Paso 1 de 3</p><h1>Cuéntanos lo esencial.</h1><p className="auth-intro">No incluyas RUT, contraseñas ni documentos en esta primera descripción.</p><form className="auth-form" onSubmit={next}><label>Tipo de caso<select name="matter" defaultValue={preset || ""} required><option value="" disabled>Selecciona una opción</option>{matters.map((matter) => <option key={matter}>{matter}</option>)}</select></label><label>Título breve<input required name="title" minLength={8} placeholder="Ej. Necesito orientación por despido" /></label><label>Descripción<textarea required name="description" minLength={30} rows={5} placeholder="Explica tu situación de forma general." /></label><button className="primary-button">Continuar <ArrowRight size={18}/></button></form></> : <><p className="eyebrow">Paso 2 de 3</p><h1>¿Dónde y cómo prefieres atenderte?</h1><form className="auth-form" onSubmit={(event) => { event.preventDefault(); setDone(true); }}><label>Región<select required defaultValue=""><option value="" disabled>Selecciona tu región</option><option>Región Metropolitana</option><option>Valparaíso</option><option>Biobío</option><option>Otra región</option></select></label><label>Comuna<input name="comuna" placeholder="Ej. Providencia" /></label><fieldset><legend>Modalidad de atención</legend><div className="radio-row"><label><input required type="radio" name="mode" value="online" /> Online</label><label><input type="radio" name="mode" value="presencial" /> Presencial</label><label><input type="radio" name="mode" value="cualquiera" /> Me da igual</label></div></fieldset><div className="form-actions"><button type="button" className="back-button" onClick={() => setStep(1)}><ArrowLeft size={17}/>Volver</button><button className="primary-button">Preparar solicitud <ArrowRight size={18}/></button></div></form></>}</section></main>;
}

export default function EncuentraAbogadoPage() {
  return <Suspense fallback={<main className="wizard-page" />}><EncuentraAbogadoForm /></Suspense>;
}
