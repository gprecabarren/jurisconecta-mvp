"use client";

import { Check, CircleAlert, LockKeyhole, Save, Settings2, UserRound } from "lucide-react";
import { useState } from "react";
import { PortalShell } from "../../components/portal-shell";

const areas = ["Derecho Civil", "Derecho Familiar", "Derecho Laboral", "Derecho Penal", "Derecho Comercial", "Derecho Tributario", "Protección al Consumidor", "Derechos Humanos", "Otros casos"];

export default function AccountPage() {
  const [tab, setTab] = useState<"profile" | "password" | "notifications">("profile");
  const [saved, setSaved] = useState(false);
  function save() { setSaved(true); window.setTimeout(() => setSaved(false), 3200); }
  return <PortalShell>
    <div className="portal-page-heading"><div><p className="eyebrow">Configuración profesional</p><h1>Mi cuenta</h1><p>Administra tu perfil, seguridad y preferencias de comunicación.</p></div></div>
    <section className="portal-panel account-panel">
      <div className="account-tabs" role="tablist">
        <button onClick={() => setTab("profile")} className={tab === "profile" ? "active" : ""}><UserRound size={17} /> Editar perfil</button>
        <button onClick={() => setTab("password")} className={tab === "password" ? "active" : ""}><LockKeyhole size={17} /> Cambiar contraseña</button>
        <button onClick={() => setTab("notifications")} className={tab === "notifications" ? "active" : ""}><Settings2 size={17} /> Notificaciones</button>
      </div>
      {tab === "profile" && <ProfileForm onSave={save} />}
      {tab === "password" && <PasswordForm onSave={save} />}
      {tab === "notifications" && <NotificationForm onSave={save} />}
      {saved && <p className="save-confirmation"><Check size={17} /> Cambios guardados en este dispositivo.</p>}
    </section>
  </PortalShell>;
}

function ProfileForm({ onSave }: { onSave: () => void }) {
  return <form className="account-form" onSubmit={(event) => { event.preventDefault(); onSave(); }}>
    <section className="account-section"><div className="section-number">01</div><div><h2>Identidad y contacto</h2><p>Para cambios en correo electrónico u otros datos críticos, contacta a soporte.</p></div></section>
    <div className="avatar-editor"><span className="profile-avatar">MR</span><div><b>Foto de perfil</b><p>Una imagen clara ayuda a que tu perfil sea reconocible.</p><label className="file-button">Seleccionar imagen<input type="file" accept="image/*" /></label></div></div>
    <div className="form-grid three"><Field label="Nombre completo" value="María Teresa Recabarren Domínguez" /><Field label="RUT" value="10.719.439" /><Field label="Dígito verificador" value="8" /><Field label="Número de documento" value="526008741" /><Field label="Teléfono" value="+56 9 9556 0415" /><Field label="Correo" value="mrecabarrend@gmail.com" type="email" /></div>
    <section className="account-section"><div className="section-number">02</div><div><h2>Áreas de práctica</h2><p>Esta selección funciona como filtro para recibir oportunidades que sí te interesan.</p></div></section>
    <div className="practice-grid">{areas.map((area) => <label key={area} className="check-card"><input type="checkbox" defaultChecked={area === "Derecho Penal" || area === "Derecho Civil"} /><span>{area}</span></label>)}</div>
    <section className="account-section"><div className="section-number">03</div><div><h2>Atención y antecedentes</h2><p>Estos datos aparecen en tu perfil profesional cuando sea aprobado.</p></div></section>
    <div className="form-grid two"><SelectField label="Tipo de atención" options={["Remota, a cualquier parte de Chile", "Remota y presencial en localidades específicas", "Presencial en localidades específicas"]} /><Field label="Universidad" value="Universidad de Concepción" /><SelectField label="País" options={["Chile"]} /><SelectField label="Región de residencia" options={["Biobío"]} /><Field label="Comuna de residencia" value="Concepción" /><Field label="Fecha de nacimiento" value="1971-09-12" type="date" /><Field label="Fecha de titulación" value="1999-09-27" type="date" /><Field label="Años de experiencia" value="26" type="number" /><SelectField label="Género" options={["Prefiero no indicar", "Femenino", "Masculino", "No binario"]} /></div>
    <div className="form-grid"><TextArea label="Presentación" value="Soy abogada con experiencia en derecho penal y orientación a personas que buscan claridad en momentos complejos." /><TextArea label="Estudios adicionales" value="Diplomado en litigación oral y actualización permanente en procedimientos penales." /><TextArea label="Experiencia laboral" value="Ejercicio independiente y representación de personas en materias penales y civiles." /></div>
    <section className="account-section"><div className="section-number">04</div><div><h2>Presencia y ubicación</h2><p>Opcional. Comparte sólo los canales profesionales que quieras mostrar.</p></div></section>
    <div className="form-grid three"><Field label="LinkedIn" value="https://" /><Field label="X (Twitter)" value="https://" /><Field label="YouTube" value="https://" /><Field label="Facebook" value="https://" /><Field label="Instagram" value="https://" /><Field label="Página web" value="https://" /></div>
    <div className="form-grid"><Field label="Dirección" value="Escribe tu ubicación" /></div>
    <div className="account-actions"><button className="portal-primary-button" type="submit"><Save size={17} /> Guardar cambios</button></div>
  </form>;
}

function PasswordForm({ onSave }: { onSave: () => void }) { return <form className="password-form" onSubmit={(event) => { event.preventDefault(); onSave(); }}><div className="security-note"><CircleAlert size={20} /><p>Usa una contraseña única y de al menos 8 caracteres. El inicio de sesión seguro se conectará al backend en la siguiente etapa.</p></div><Field label="Contraseña actual" type="password" value="" /><Field label="Nueva contraseña" type="password" value="" /><Field label="Repetir nueva contraseña" type="password" value="" /><button className="portal-primary-button"><LockKeyhole size={17} /> Actualizar contraseña</button></form>; }

function NotificationForm({ onSave }: { onSave: () => void }) { const [preferences, setPreferences] = useState({ preferredEmail: true, preferredWhatsapp: false, poolEmail: true, poolWhatsapp: false }); return <form className="notification-form" onSubmit={(event) => { event.preventDefault(); onSave(); }}><div className="notification-header"><span>Evento</span><span>Email</span><span>WhatsApp</span></div><ToggleRow label="Nuevo caso preferente que coincide con tus áreas" email={preferences.preferredEmail} whatsapp={preferences.preferredWhatsapp} onEmail={() => setPreferences({ ...preferences, preferredEmail: !preferences.preferredEmail })} onWhatsapp={() => setPreferences({ ...preferences, preferredWhatsapp: !preferences.preferredWhatsapp })} /><ToggleRow label="Resumen diario de casos del pool y oportunidades liberadas" email={preferences.poolEmail} whatsapp={preferences.poolWhatsapp} onEmail={() => setPreferences({ ...preferences, poolEmail: !preferences.poolEmail })} onWhatsapp={() => setPreferences({ ...preferences, poolWhatsapp: !preferences.poolWhatsapp })} /><div className="account-actions"><button className="portal-primary-button"><Save size={17} /> Guardar preferencias</button></div></form>; }

function ToggleRow({ label, email, whatsapp, onEmail, onWhatsapp }: { label: string; email: boolean; whatsapp: boolean; onEmail: () => void; onWhatsapp: () => void }) { return <div className="notification-row"><b>{label}</b><label className="toggle"><input checked={email} onChange={onEmail} type="checkbox" /><span /></label><label className="toggle"><input checked={whatsapp} onChange={onWhatsapp} type="checkbox" /><span /></label></div>; }
function Field({ label, value, type = "text" }: { label: string; value: string; type?: string }) { return <label className="field"><span>{label} <b>*</b></span><input type={type} defaultValue={value} required /></label>; }
function SelectField({ label, options }: { label: string; options: string[] }) { return <label className="field"><span>{label} <b>*</b></span><select defaultValue={options[0]}>{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function TextArea({ label, value }: { label: string; value: string }) { return <label className="field"><span>{label} <b>*</b></span><textarea defaultValue={value} rows={4} /></label>; }
