import { requireUser, type UserAuthEnv } from "../_lib/user-auth";

interface Context { request: Request; env: UserAuthEnv; next: () => Promise<Response>; }

export const onRequest = async ({ request, env, next }: Context) => {
  if (await requireUser(request, env, "person")) return next();
  return Response.redirect(new URL("/ingresar", request.url), 302);
};
