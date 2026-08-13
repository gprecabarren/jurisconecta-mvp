import { cleanText, D1Database, requireUser, UserAuthEnv } from "../../_lib/user-auth";
import { isChileRegion } from "../../../shared/chile";

interface Context { request: Request; env: UserAuthEnv & { DB?: D1Database }; }
type ProfileUpdate = { fullName?: unknown; phone?: unknown; region?: unknown; commune?: unknown; };

export const onRequestPatch = async ({ request, env }: Context) => {
  if (!env.DB) return Response.json({ error: "La base de datos no está conectada." }, { status: 503 });
  const session = await requireUser(request, env);
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });
  const payload = await request.json() as ProfileUpdate;
  const fullName = cleanText(payload.fullName, 120);
  if (fullName.length < 3) return Response.json({ error: "Ingresa tu nombre completo." }, { status: 400 });
  const region = cleanText(payload.region, 80);
  if (region && !isChileRegion(region)) return Response.json({ error: "Selecciona una region valida de Chile." }, { status: 400 });
  await env.DB.prepare("UPDATE users SET full_name = ?, phone = ?, region = ?, commune = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(fullName, cleanText(payload.phone, 30) || null, region || null, cleanText(payload.commune, 80) || null, session.id).run();
  return Response.json({ saved: true });
};
