import { isAdmin } from "../../../_lib/admin-auth";
import type { AuthEnv } from "../../../_lib/github-auth";
import type { D1Database, R2Bucket } from "../../../_lib/user-auth";

interface Context { request: Request; env: AuthEnv & { DB?: D1Database; LAWYER_DOCUMENTS?: R2Bucket }; params: { id: string }; }

export const onRequestGet = async ({ request, env, params }: Context) => {
  if (!await isAdmin(request, env)) return Response.json({ error: "No autorizado" }, { status: 401 });
  if (!env.DB || !env.LAWYER_DOCUMENTS) return Response.json({ error: "El almacenamiento de documentos no está conectado." }, { status: 503 });
  const document = await env.DB.prepare("SELECT object_key, file_name, mime_type FROM lawyer_application_documents WHERE id = ? LIMIT 1").bind(params.id).first<{ object_key: string; file_name: string; mime_type: string }>();
  if (!document) return Response.json({ error: "Documento no encontrado." }, { status: 404 });
  const object = await env.LAWYER_DOCUMENTS.get(document.object_key);
  if (!object) return Response.json({ error: "Documento no disponible." }, { status: 404 });
  const headers = new Headers({ "Content-Type": document.mime_type, "Content-Disposition": `inline; filename="${document.file_name.replaceAll('"', '')}"`, "Cache-Control": "private, no-store" });
  object.writeHttpMetadata(headers);
  return new Response(object.body, { headers });
};
