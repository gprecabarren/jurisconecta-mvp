import { cleanText, D1Database, normalizeRut, R2Bucket, requireUser, UserAuthEnv, validRut } from "../../_lib/user-auth";

interface Context { request: Request; env: UserAuthEnv & { DB?: D1Database; LAWYER_DOCUMENTS?: R2Bucket }; }
type ApplicationInput = { rut?: unknown; idDocumentNumber?: unknown; birthDate?: unknown; graduationDate?: unknown; university?: unknown; attentionMode?: unknown; serviceLocalities?: unknown; experienceYears?: unknown; gender?: unknown; additionalStudies?: unknown; workExperience?: unknown; linkedinUrl?: unknown; twitterUrl?: unknown; youtubeUrl?: unknown; facebookUrl?: unknown; instagramUrl?: unknown; websiteUrl?: unknown; address?: unknown; planCode?: unknown; specialties?: unknown; bio?: unknown; };
const plans = new Set(["silver", "gold", "premium"]);

function filesAllowed(file: File) {
  return file.size > 0 && file.size <= 5 * 1024 * 1024 && ["image/jpeg", "image/png", "application/pdf"].includes(file.type);
}

export const onRequestPost = async ({ request, env }: Context) => {
  if (!env.DB || !env.LAWYER_DOCUMENTS) return Response.json({ error: "El almacenamiento de documentos todavía no está conectado." }, { status: 503 });
  const db = env.DB;
  const documentBucket = env.LAWYER_DOCUMENTS;
  const session = await requireUser(request, env, "lawyer");
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });
  const form = await request.formData();
  const fields = Object.fromEntries([...form.entries()].filter(([, value]) => typeof value === "string")) as Record<string, string>;
  const input = fields as ApplicationInput;
  const selectedPlan = plans.has(cleanText(input.planCode, 30)) ? cleanText(input.planCode, 30) : "silver";
  const specialties = typeof input.specialties === "string" ? input.specialties.split("|").map((item) => cleanText(item, 80)).filter(Boolean).slice(0, 10) : [];
  const rut = normalizeRut(input.rut);
  const university = cleanText(input.university, 160);
  const graduationDate = cleanText(input.graduationDate, 20);
  const bio = cleanText(input.bio, 3000);
  if (!validRut(rut)) return Response.json({ error: "Ingresa un RUT chileno valido." }, { status: 400 });
  if (university.length < 3 || graduationDate.length < 8 || specialties.length === 0 || bio.length < 30) return Response.json({ error: "Completa universidad, fecha de titulacion, especialidades y presentacion." }, { status: 400 });
  const documentTypes = ["identity_front", "identity_back", "degree_certificate"] as const;
  const documents = documentTypes.map((type) => ({ type, file: form.get(type) }));
  if (documents.some(({ file }) => !(file instanceof File) || !filesAllowed(file))) return Response.json({ error: "Adjunta ambos lados del carnet y el certificado de título en PDF, JPG o PNG de hasta 5 MB." }, { status: 400 });
  const validDocuments = documents as Array<{ type: typeof documentTypes[number]; file: File }>;
  const existing = await db.prepare("SELECT object_key FROM lawyer_application_documents WHERE user_id = ?").bind(session.id).all<{ object_key: string }>();
  const uploaded: Array<{ type: string; key: string; file: File }> = [];
  try {
    for (const { type, file } of validDocuments) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-100) || "documento";
      const key = `applications/${session.id}/${type}-${crypto.randomUUID()}-${safeName}`;
      await documentBucket.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type }, customMetadata: { lawyerId: session.id, documentType: type } });
      uploaded.push({ type, key, file });
    }
    const statements = [
      db.prepare("INSERT INTO lawyer_applications (user_id, rut, id_document_number, birth_date, graduation_date, university, attention_mode, service_localities, experience_years, gender, additional_studies, work_experience, linkedin_url, twitter_url, youtube_url, facebook_url, instagram_url, website_url, address, selected_plan_code, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(user_id) DO UPDATE SET rut = excluded.rut, id_document_number = excluded.id_document_number, birth_date = excluded.birth_date, graduation_date = excluded.graduation_date, university = excluded.university, attention_mode = excluded.attention_mode, service_localities = excluded.service_localities, experience_years = excluded.experience_years, gender = excluded.gender, additional_studies = excluded.additional_studies, work_experience = excluded.work_experience, linkedin_url = excluded.linkedin_url, twitter_url = excluded.twitter_url, youtube_url = excluded.youtube_url, facebook_url = excluded.facebook_url, instagram_url = excluded.instagram_url, website_url = excluded.website_url, address = excluded.address, selected_plan_code = excluded.selected_plan_code, updated_at = CURRENT_TIMESTAMP").bind(session.id, rut, cleanText(input.idDocumentNumber, 40) || null, cleanText(input.birthDate, 20) || null, graduationDate, university, cleanText(input.attentionMode, 60) || null, cleanText(input.serviceLocalities, 600) || null, Number(input.experienceYears) || null, cleanText(input.gender, 30) || null, cleanText(input.additionalStudies, 3000) || null, cleanText(input.workExperience, 3000) || null, cleanText(input.linkedinUrl, 300) || null, cleanText(input.twitterUrl, 300) || null, cleanText(input.youtubeUrl, 300) || null, cleanText(input.facebookUrl, 300) || null, cleanText(input.instagramUrl, 300) || null, cleanText(input.websiteUrl, 300) || null, cleanText(input.address, 500) || null, selectedPlan),
      db.prepare("UPDATE lawyer_profiles SET specialties_json = ?, bio = ?, plan_code = ?, application_status = 'submitted', application_submitted_at = CURRENT_TIMESTAMP, application_review_note = NULL WHERE user_id = ?").bind(JSON.stringify(specialties), bio, selectedPlan, session.id),
      db.prepare("UPDATE users SET status = 'pending', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(session.id),
      db.prepare("DELETE FROM lawyer_application_documents WHERE user_id = ?").bind(session.id),
    ];
    uploaded.forEach(({ type, key, file }) => statements.push(db.prepare("INSERT INTO lawyer_application_documents (id, user_id, document_type, object_key, file_name, mime_type, file_size) VALUES (?, ?, ?, ?, ?, ?, ?)").bind(crypto.randomUUID(), session.id, type, key, file.name.slice(0, 180), file.type, file.size)));
    await db.batch(statements);
    await documentBucket.delete(existing.results.map((document) => document.object_key));
    return Response.json({ submitted: true });
  } catch (error) {
    await documentBucket.delete(uploaded.map((document) => document.key));
    return Response.json({ error: error instanceof Error ? "No pudimos enviar tu postulación." : "No pudimos enviar tu postulación." }, { status: 500 });
  }
};
