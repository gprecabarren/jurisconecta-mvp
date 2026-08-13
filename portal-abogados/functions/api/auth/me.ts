import { D1Database, requireUser, UserAuthEnv } from "../../_lib/user-auth";

interface Context { request: Request; env: UserAuthEnv & { DB?: D1Database }; }
type Profile = { id: string; email: string; full_name: string; role: string; status: string; phone: string | null; region: string | null; commune: string | null; };

export const onRequestGet = async ({ request, env }: Context) => {
  if (!env.DB) return Response.json({ error: "La base de datos no está conectada." }, { status: 503 });
  const session = await requireUser(request, env);
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });
  const profile = await env.DB.prepare("SELECT id, email, full_name, role, status, phone, region, commune FROM users WHERE id = ? LIMIT 1").bind(session.id).first<Profile>();
  if (!profile) return Response.json({ error: "No encontramos tu perfil." }, { status: 404 });
  return Response.json({ user: profile });
};
