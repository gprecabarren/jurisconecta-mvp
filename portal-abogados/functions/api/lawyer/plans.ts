import { D1Database, requireUser, UserAuthEnv } from "../../_lib/user-auth";

interface Context { request: Request; env: UserAuthEnv & { DB?: D1Database }; }
type Plan = { code: string; name: string; monthly_credits: number; monthly_price_clp: number; description: string; sort_order: number; };

export const onRequestGet = async ({ request, env }: Context) => {
  if (!env.DB) return Response.json({ error: "La base de datos no está conectada." }, { status: 503 });
  const session = await requireUser(request, env, "lawyer");
  if (!session) return Response.json({ error: "No autorizado" }, { status: 401 });
  const [plans, profile] = await Promise.all([
    env.DB.prepare("SELECT code, name, monthly_credits, monthly_price_clp, description, sort_order FROM subscription_plans WHERE active = 1 ORDER BY sort_order").all<Plan>(),
    env.DB.prepare("SELECT plan_code, credit_balance, renewal_date, subscription_status FROM lawyer_profiles WHERE user_id = ? LIMIT 1").bind(session.id).first<{ plan_code: string; credit_balance: number; renewal_date: string | null; subscription_status: string }>(),
  ]);
  return Response.json({ plans: plans.results, profile });
};
