import { authSettings, cookie, randomToken, type AuthEnv } from "../../_lib/github-auth";

interface Context { request: Request; env: AuthEnv; }

export const onRequestGet = async ({ request, env }: Context) => {
  const { clientId, clientSecret, sessionSecret } = authSettings(env);
  if (!clientId || !clientSecret || !sessionSecret) return new Response("La autenticación de administrador todavía no está configurada.", { status: 503 });
  const state = randomToken();
  const origin = new URL(request.url).origin;
  const authorization = new URL("https://github.com/login/oauth/authorize");
  authorization.searchParams.set("client_id", clientId);
  authorization.searchParams.set("redirect_uri", `${origin}/auth/github/callback`);
  authorization.searchParams.set("scope", "read:user");
  authorization.searchParams.set("state", state);
  return new Response(null, { status: 302, headers: { Location: authorization.toString(), "Set-Cookie": cookie("juris_oauth_state", state, 600) } });
};
