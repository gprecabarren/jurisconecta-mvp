import { adminGitHubLogin, authSettings, readSession, type AuthEnv } from "../_lib/github-auth";

interface Context { request: Request; env: AuthEnv; next: () => Promise<Response>; }

export const onRequest = async ({ request, env, next }: Context) => {
  const session = await readSession(request, env);
  const { allowedLogin = adminGitHubLogin } = authSettings(env);
  if (session && session.login.toLowerCase() === allowedLogin.toLowerCase()) return next();
  return Response.redirect(new URL("/auth/github/login", request.url), 302);
};
