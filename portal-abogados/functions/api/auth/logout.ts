import { clearUserSessionCookie } from "../../_lib/user-auth";

export const onRequestPost = async () => Response.json({ loggedOut: true }, { headers: { "Set-Cookie": clearUserSessionCookie() } });
