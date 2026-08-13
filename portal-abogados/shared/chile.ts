export const chileRegions = [
  "Arica y Parinacota",
  "Tarapacá",
  "Antofagasta",
  "Atacama",
  "Coquimbo",
  "Valparaiso",
  "Región Metropolitana",
  "O'Higgins",
  "Maule",
  "Ñuble",
  "Biobío",
  "La Araucanía",
  "Los Ríos",
  "Los Lagos",
  "Aysén",
  "Magallanes y la Antártica Chilena",
] as const;

export function isChileRegion(value: string) {
  return (chileRegions as readonly string[]).includes(value);
}

function rutParts(value: string) {
  const normalized = value.replace(/[^0-9kK]/g, "").toUpperCase();
  if (normalized.length < 8 || normalized.length > 9) return null;
  return { body: normalized.slice(0, -1), verifier: normalized.slice(-1) };
}

export function isValidRut(value: unknown) {
  if (typeof value !== "string") return false;
  const parts = rutParts(value);
  if (!parts) return false;
  let sum = 0;
  let multiplier = 2;
  for (let index = parts.body.length - 1; index >= 0; index -= 1) {
    sum += Number(parts.body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const computed = 11 - (sum % 11);
  const verifier = computed === 11 ? "0" : computed === 10 ? "K" : String(computed);
  return verifier === parts.verifier;
}

export function formatRut(value: string) {
  const parts = rutParts(value);
  if (!parts) return value.trim();
  return `${parts.body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${parts.verifier}`;
}
