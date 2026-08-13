import { adminGitHubLogin, authSettings, readSession, type AuthEnv } from "./github-auth";

export async function isAdmin(request: Request, env: AuthEnv) {
  const session = await readSession(request, env);
  const { allowedLogin = adminGitHubLogin } = authSettings(env);
  return Boolean(session && session.login.toLowerCase() === allowedLogin.toLowerCase());
}
