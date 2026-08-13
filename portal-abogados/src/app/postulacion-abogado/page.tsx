"use client";

import { CheckCircle2, FileBadge, FileText, ShieldCheck, Upload, UserRoundCheck } from "lucide-react";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { PortalShell } from "../../components/portal-shell";
import { professionalLegalAreas } from "../../../shared/legal-catalog";
import { formatRut, isValidRut } from "../../../shared/chile";

const areas = professionalLegalAreas;
const planDetails = [
  { code: "silver", name: "Silver", credits: 200, detail: "Base para iniciar tu práctica en la plataforma." },
  { code: "gold", name: "Gold", credits: 500, detail: "Para una actividad constante en varias oportunidades." },
  { code: "premium", name: "Premium", credits: 1000, detail: "Para una alta capacidad de acceso mensual." },
];
type ApplicationData = { rut?: string | null; id_document_number?: string | null; birth_date?: string | null; graduation_date?: string | null; university?: string | null; attention_mode?: string | null; service_localities?: string | null; experience_years?: number | null; gender?: string | null; additional_studies?: string | null; work_experience?: string | null; linkedin_url?: string | null; twitter_url?: string | null; youtube_url?: string | null; facebook_url?: string | null; instagram_url?: string | null; website_url?: string | null; address?: string | null; selected_plan_code?: string | null; };
type ProfileData = { full_name: string; email: string; phone: string | null; region: string | null; commune: string | null; specialties_json: string; bio: string | null; application_status: string; application_review_note: string | null; };

function specialties(value: string) { try { return JSON.parse(value) as string[]; } catch { return []; } }

export default function LawyerApplicationPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [application, setApplication] = useState<ApplicationData>({});
  const [selectedPlan, setSelectedPlan] = useState("silver");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => { void fetch("/api/lawyer/profile").then((response) => response.ok ? response.json() : Promise.reject()).then((result: { profile: ProfileData; application: ApplicationData }) => { setProfile(result.profile); setApplication(result.application || {}); setSelectedPlan(result.application?.selected_plan_code || "silver"); }).catch(() => setMessage("No pudimos cargar tu postulación.")); }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const form = new FormData(event.currentTarget);
    const rut = String(form.get("rut") || "");
    if (!isValidRut(rut)) {
      setMessage("Ingresa un RUT chileno válido.");
      setSaving(false);
      return;
    }
    form.set("rut", formatRut(rut));
    const selected = form.getAll("specialty").filter((value): value is string => typeof value === "string");
    form.set("specialties", selected.join("|"));
    form.set("planCode", selectedPlan);
    try {
      const response = await fetch("/api/lawyer/application", { method: "POST", body: form });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "No pudimos enviar tu postulación.");
      setMessage("Postulación enviada. Revisaremos tus documentos y te avisaremos cuando el perfil quede habilitado.");
      setProfile((current) => current ? { ...current, application_status: "submitted", application_review_note: null } : current);
    } catch (error) { setMessage(error instanceof Error ? error.message : "No pudimos enviar tu postulación."); } finally { setSaving(false); }
  }

  if (!profile) return <PortalShell><p className="client-loading">Cargando tu postulación...</p></PortalShell>;
  const status = profile.application_status;
  if (status === "submitted") return <PortalShell><section className="portal-panel review-empty"><span className="empty-mark"><ShieldCheck size={29} /></span><p className="eyebrow">Documentación recibida</p><h2>Tu postulación está en revisión.</h2><p>Validaremos tu identidad y título profesional antes de habilitar el acceso a casos y créditos del plan seleccionado.</p></section></PortalShell>;
  if (status === "approved") return <PortalShell><section className="portal-panel review-empty"><span className="empty-mark"><CheckCircle2 size={29} /></span><p className="eyebrow">Perfil aprobado</p><h2>Ya puedes recibir oportunidades.</h2><p>Tu plan fue activado con los créditos correspondientes. Revisa los casos preferentes y el pool profesional.</p></section></PortalShell>;
  const currentSpecialties = specialties(profile.specialties_json);
  return <PortalShell><div className="portal-page-heading"><div><p className="eyebrow">Activación profesional</p><h1>Postula como abogado/a</h1><p>La validación documental protege a personas y profesionales antes de habilitar el acceso a casos.</p></div><span className="admin-state"><ShieldCheck size={17} /> Documentos privados</span></div>{status === "changes_requested" && <p className="application-note"><FileBadge size={18} /> <span><b>Necesitamos ajustes:</b> {profile.application_review_note || "Revisa los antecedentes antes de reenviar la postulación."}</span></p>}<form className="application-form" onSubmit={submit}><section className="portal-panel application-section"><ApplicationTitle number="01" icon={<UserRoundCheck size={20} />} title="Identidad profesional" text="Confirma los datos que usaremos para validar tu postulación." /><div className="form-grid three"><Field label="Nombre completo" value={profile.full_name} disabled /><Field label="Correo electrónico" value={profile.email} disabled /><Field label="Teléfono" name="phonePreview" value={profile.phone || ""} disabled /><Field label="RUT" name="rut" value={application.rut || ""} required placeholder="12.345.678-5" inputMode="text" /><Field label="Número de documento" name="idDocumentNumber" value={application.id_document_number || ""} /><Field label="Fecha de nacimiento" name="birthDate" type="date" value={application.birth_date || ""} /><Field label="Universidad" name="university" value={application.university || ""} required /><Field label="Fecha de titulación" name="graduationDate" type="date" value={application.graduation_date || ""} required /><Field label="Años de experiencia" name="experienceYears" type="number" value={application.experience_years?.toString() || ""} /></div></section><section className="portal-panel application-section"><ApplicationTitle number="02" icon={<FileBadge size={20} />} title="Documentos para revisión" text="Aceptamos PDF, JPG o PNG de hasta 5 MB. Estos archivos solo se muestran a la administración de JurisConecta." /><div className="document-grid"><DocumentField name="identity_front" label="Carnet de identidad, anverso" /><DocumentField name="identity_back" label="Carnet de identidad, reverso" /><DocumentField name="degree_certificate" label="Certificado o título universitario" /></div></section><section className="portal-panel application-section"><ApplicationTitle number="03" icon={<ShieldCheck size={20} />} title="Práctica y atención" text="Tus especialidades determinan qué casos se destacarán como preferentes." /><div className="practice-grid">{areas.map((area) => <label key={area} className="check-card"><input type="checkbox" name="specialty" value={area} defaultChecked={currentSpecialties.includes(area)} /><span>{area}</span></label>)}</div><div className="form-grid two application-fields"><SelectField label="Tipo de atención" name="attentionMode" value={application.attention_mode || "remote"} options={[["remote", "Remota, a cualquier parte de Chile"], ["hybrid", "Remota y presencial"], ["in_person", "Presencial"]]} /><Field label="Localidades de atención" name="serviceLocalities" value={application.service_localities || `${profile.commune || ""} ${profile.region || ""}`.trim()} /><Field label="Región declarada" value={profile.region || ""} disabled /><Field label="Comuna declarada" value={profile.commune || ""} disabled /><SelectField label="Género" name="gender" value={application.gender || "prefer_not"} options={[["prefer_not", "Prefiero no indicar"], ["female", "Femenino"], ["male", "Masculino"], ["non_binary", "No binario"]]} /></div><label className="field"><span>Presentación <b>*</b></span><textarea name="bio" defaultValue={profile.bio || ""} rows={4} required minLength={30} placeholder="Describe tu experiencia, especialidades y forma de trabajo." /></label><div className="form-grid two"><TextArea label="Estudios adicionales" name="additionalStudies" value={application.additional_studies || ""} /><TextArea label="Experiencia laboral" name="workExperience" value={application.work_experience || ""} /></div></section><section className="portal-panel application-section"><ApplicationTitle number="04" icon={<FileText size={20} />} title="Presencia profesional" text="Opcional. Comparte solo enlaces profesionales que quieras mostrar." /><div className="form-grid three"><Field label="LinkedIn" name="linkedinUrl" value={application.linkedin_url || ""} /><Field label="X (Twitter)" name="twitterUrl" value={application.twitter_url || ""} /><Field label="YouTube" name="youtubeUrl" value={application.youtube_url || ""} /><Field label="Facebook" name="facebookUrl" value={application.facebook_url || ""} /><Field label="Instagram" name="instagramUrl" value={application.instagram_url || ""} /><Field label="Página web" name="websiteUrl" value={application.website_url || ""} /></div><Field label="Dirección profesional" name="address" value={application.address || ""} /></section><section className="portal-panel application-section"><ApplicationTitle number="05" icon={<CheckCircle2 size={20} />} title="Selecciona tu plan" text="Al aprobar tu perfil se asignarán los créditos mensuales del plan elegido. El cobro se habilitará junto con la integración de pagos." /><div className="application-plan-grid">{planDetails.map((plan) => <button type="button" onClick={() => setSelectedPlan(plan.code)} className={selectedPlan === plan.code ? "application-plan selected" : "application-plan"} key={plan.code}><span>{plan.name}</span><strong>{plan.credits}</strong><small>créditos mensuales</small><p>{plan.detail}</p></button>)}</div><div className="account-actions"><button className="portal-primary-button" disabled={saving}><Upload size={17} /> {saving ? "Enviando postulación..." : "Enviar a revisión"}</button></div>{message && <p className="save-confirmation">{message}</p>}</section></form></PortalShell>;
}

function ApplicationTitle({ number, icon, title, text }: { number: string; icon: ReactNode; title: string; text: string }) { return <div className="application-title"><span>{number}</span><i>{icon}</i><div><h2>{title}</h2><p>{text}</p></div></div>; }
function DocumentField({ name, label }: { name: string; label: string }) { return <label className="document-field"><Upload size={21} /><b>{label}</b><small>PDF, JPG o PNG, hasta 5 MB</small><input type="file" name={name} accept="image/jpeg,image/png,application/pdf" required /></label>; }
function Field({ label, name, value, type = "text", required = false, disabled = false, placeholder, inputMode }: { label: string; name?: string; value: string; type?: string; required?: boolean; disabled?: boolean; placeholder?: string; inputMode?: "text" | "numeric" | "tel" }) { return <label className="field"><span>{label}{required && <b> *</b>}</span><input name={name} type={type} defaultValue={value} required={required} disabled={disabled} placeholder={placeholder} inputMode={inputMode} /></label>; }
function SelectField({ label, name, value, options }: { label: string; name: string; value: string; options: Array<[string, string]> }) { return <label className="field"><span>{label}</span><select name={name} defaultValue={value}>{options.map(([id, text]) => <option key={id} value={id}>{text}</option>)}</select></label>; }
function TextArea({ label, name, value }: { label: string; name: string; value: string }) { return <label className="field"><span>{label}</span><textarea name={name} defaultValue={value} rows={4} /></label>; }
