export type LegalArea = { title: string; topics: string[] };

export const legalAreas: LegalArea[] = [
  { title: "Casos frecuentes", topics: ["Pensión alimenticia", "Inmigración en Chile", "Divorcio", "Herencias y posesiones efectivas", "Deudas y embargos", "Compra y arriendo de propiedades", "Accidentes de tránsito", "Despido injustificado", "Robos y hurtos"] },
  { title: "Derecho Civil", topics: ["Herencias y posesiones efectivas", "Compra y arriendo de propiedades", "Deudas y embargos", "Negligencia médica", "Problemas entre vecinos", "Pago de honorarios", "Otros casos civiles"] },
  { title: "Derecho Familiar", topics: ["Pensión alimenticia", "Divorcio", "Tuición", "Régimen de visitas", "Juicio o reconocimiento de paternidad", "Cambio de nombre", "Adopciones", "Otros casos de familia"] },
  { title: "Derecho Laboral", topics: ["Defensa de derechos laborales", "Despido injustificado", "Licencia médica", "Accidentes laborales", "Acoso sexual", "Negociación colectiva", "Otros casos laborales"] },
  { title: "Derecho Penal", topics: ["Accidentes de tránsito", "Abuso sexual y violación", "Robos y hurtos", "Manejo en estado de ebriedad", "Injurias y calumnias", "Estafas y delitos económicos", "Delitos informáticos", "Otros casos penales"] },
  { title: "Derecho Comercial", topics: ["Insolvencia y quiebras", "Marcas, patentes y propiedad intelectual", "Constitución de sociedad", "Redacción o revisión de contratos", "Litigio y arbitrajes", "Inversión extranjera", "Otros casos comerciales"] },
  { title: "Derecho Tributario", topics: ["Planificación tributaria", "Litigios tributarios", "Otros casos tributarios"] },
  { title: "Protección al consumidor", topics: ["Inmobiliarias y constructoras", "Bancos, AFPs y empresas financieras", "Aseguradoras", "Transporte", "Tiendas comerciales y retail", "Comercio electrónico", "Servicios básicos", "Otros casos de consumo"] },
  { title: "Derechos humanos", topics: ["Detención ilegal por parte del Estado", "Lesiones por parte del Estado", "Torturas por parte del Estado", "Secuestro por parte del Estado", "Violencia sexual por parte del Estado", "Otros casos de derechos humanos"] },
  { title: "Otros casos", topics: ["Otro tipo de caso"] },
];

export function questionsForTopic(topic: string) {
  if (topic === "Compra y arriendo de propiedades") return ["¿Qué relación tienes con la propiedad?", "¿La documentación de la propiedad está al día?"];
  if (topic === "Despido injustificado") return ["¿Cuándo terminó la relación laboral?", "¿Recibiste carta de despido o finiquito?"];
  if (topic === "Divorcio") return ["¿Existe acuerdo entre las partes?", "¿Hay hijos o bienes que deban considerarse?"];
  return ["¿Qué situación necesitas resolver?", "¿Qué antecedentes ya tienes disponibles?"];
}
