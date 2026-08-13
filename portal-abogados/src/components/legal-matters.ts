export { categoryForTopic, legalAreas, professionalLegalAreas } from "../../shared/legal-catalog";
export type { LegalArea } from "../../shared/legal-catalog";

export function questionsForTopic(topic: string) {
  if (topic === "Compra y arriendo de propiedades") return ["¿Qué relación tienes con la propiedad?", "¿La documentación de la propiedad está al día?"];
  if (topic === "Despido injustificado") return ["¿Cuándo terminó la relación laboral?", "¿Recibiste carta de despido o finiquito?"];
  if (topic === "Divorcio") return ["¿Existe acuerdo entre las partes?", "¿Hay hijos o bienes que deban considerarse?"];
  return ["¿Qué situación necesitas resolver?", "¿Qué antecedentes ya tienes disponibles?"];
}
