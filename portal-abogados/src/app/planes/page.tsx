"use client";

import { CheckCircle2, CircleDollarSign, ShieldCheck, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { PortalShell } from "../../components/portal-shell";

type Plan = { code: string; name: string; monthly_credits: number; description: string; };
type Profile = { plan_code: string; credit_balance: number; renewal_date: string | null; subscription_status: string; };

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => { void fetch("/api/lawyer/plans").then(async (response) => { if (!response.ok) throw new Error(); return await response.json() as { plans: Plan[]; profile: Profile | null }; }).then((result) => { setPlans(result.plans); setProfile(result.profile); }).catch(() => undefined); }, []);
  return <PortalShell><div className="portal-page-heading"><div><p className="eyebrow">Plan profesional</p><h1>Créditos para acceder a casos.</h1><p>Cada abogado paga los créditos indicados una vez por cada caso que desbloquea.</p></div></div><section className="credit-overview"><article><WalletCards size={22} /><p>Saldo disponible</p><strong>{profile?.credit_balance ?? "-"}</strong><small>Créditos utilizables hoy</small></article><article><CheckCircle2 size={22} /><p>Plan actual</p><strong>{profile?.plan_code || "-"}</strong><small>{profile?.subscription_status === "trial" ? "Plan de prueba activo" : "Estado del plan"}</small></article><article><CircleDollarSign size={22} /><p>Próxima renovación</p><strong>{profile?.renewal_date ? new Intl.DateTimeFormat("es-CL").format(new Date(`${profile.renewal_date}T12:00:00`)) : "-"}</strong><small>La asignación mensual se mostrará aquí</small></article></section><section className="plan-grid">{plans.map((plan) => <article className={profile?.plan_code === plan.code ? "plan-card current" : "plan-card"} key={plan.code}><p className="eyebrow">{profile?.plan_code === plan.code ? "Plan actual" : "Plan disponible"}</p><h2>{plan.name}</h2><strong>{plan.monthly_credits}</strong><span>créditos mensuales</span><p>{plan.description}</p><div><ShieldCheck size={16} /> Acceso tras aprobación del perfil</div><button className="portal-outline-button" disabled>{profile?.plan_code === plan.code ? "Plan seleccionado" : "Próximamente"}</button></article>)}</section><p className="plan-footnote">La compra de planes y créditos adicionales se habilitará junto con Webpay. En esta etapa puedes probar todo el flujo sin cobros.</p></PortalShell>;
}
