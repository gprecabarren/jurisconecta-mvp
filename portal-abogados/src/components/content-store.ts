export type TeamMember = { id: string; name: string; role: string; bio: string; initials: string };
export type HelpArticle = { id: string; title: string; category: string; excerpt: string };

export const defaultTeam: TeamMember[] = [
  { id: "maria", name: "María Teresa Recabarren", role: "Directora legal", bio: "Abogada enfocada en derecho penal y acceso a una orientación jurídica clara.", initials: "MR" },
  { id: "tomás", name: "Tomás Valdés", role: "Operaciones", bio: "Acompaña la experiencia de personas y profesionales en la plataforma.", initials: "TV" },
  { id: "sofia", name: "Sofía Leiva", role: "Éxito profesional", bio: "Apoya la activación y el crecimiento de perfiles jurídicos.", initials: "SL" },
];

export const defaultHelp: HelpArticle[] = [
  { id: "perfil", title: "Completar y publicar tu perfil profesional", category: "Perfil profesional", excerpt: "Qué información revisamos antes de habilitar tu perfil." },
  { id: "casos", title: "Cómo funcionan los casos preferentes y del pool", category: "Casos y oportunidades", excerpt: "Diferencias entre cada tipo de oportunidad y cómo acceder." },
  { id: "creditos", title: "Créditos, planes y renovaciones", category: "Plan y facturación", excerpt: "Cómo se consumen los créditos y cuándo se renueva tu plan." },
  { id: "evaluaciones", title: "Evaluaciones y reputación profesional", category: "Perfil profesional", excerpt: "Cómo se muestran las evaluaciones de tus clientes." },
  { id: "seguridad", title: "Seguridad de tu cuenta y datos de contacto", category: "Cuenta y seguridad", excerpt: "Recomendaciones para cuidar tu acceso y tu información." },
  { id: "soporte", title: "Contactar al equipo de soporte", category: "Cuenta y seguridad", excerpt: "Canales de ayuda para cambios importantes en tu cuenta." },
];

export function readStore<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { return JSON.parse(window.localStorage.getItem(key) || "") as T; } catch { return fallback; }
}

export function writeStore<T>(key: string, value: T) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
