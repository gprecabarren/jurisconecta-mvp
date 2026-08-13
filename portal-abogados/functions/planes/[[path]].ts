import { requireUser, type UserAuthEnv } from "../_lib/user-auth";

interface Context { request: Request; env: UserAuthEnv; next: () => Promise<Response>; }

export const onRequest = async ({ request, env, next }: Context) => {
  const session = await requireUser(request, env, "lawyer");
  if (!session) return Response.redirect(new URL("/ingresar", request.url), 302);
  return next();
};
