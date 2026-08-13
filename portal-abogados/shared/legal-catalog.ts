export type LegalArea = { title: string; topics: string[] };

export const legalAreas: LegalArea[] = [
  { title: "Casos más frecuentes", topics: ["Pensión alimenticia", "Inmigración en Chile", "Divorcio", "Herencias y posesiones efectivas", "Deudas y embargos", "Compra y arriendo de propiedades", "Accidentes de tránsito", "Abuso sexual y violación", "Tuición", "Juicio o reconocimiento de paternidad", "Régimen de visitas", "Defensa de derechos laborales", "Despido injustificado", "Robos y hurtos", "Violencia intrafamiliar", "Manejo en estado de ebriedad", "Injurias y calumnias", "Tráfico de drogas", "Negligencia médica", "Estafas y delitos económicos", "Problemas entre vecinos"] },
  { title: "Derecho Civil", topics: ["Inmigración en Chile", "Herencias y posesiones efectivas", "Deudas y embargos", "Compra y arriendo de propiedades", "Negligencia médica", "Problemas entre vecinos", "Pago de honorarios", "Recurso de protección contra alza en Isapres", "Mascotas", "Otros casos civiles"] },
  { title: "Derecho Familiar", topics: ["Pensión alimenticia", "Divorcio", "Tuición", "Juicio o reconocimiento de paternidad", "Régimen de visitas", "Violencia intrafamiliar", "Cambio de nombre", "Declaración de interdicción", "Adopciones", "Otros casos de familia"] },
  { title: "Derecho Laboral", topics: ["Defensa de derechos laborales", "Despido injustificado", "Licencia médica", "Accidentes laborales", "Acoso sexual", "Autodespido", "Constitución y asesoría de sindicatos", "Negociación colectiva", "Otros casos laborales"] },
  { title: "Derecho Penal", topics: ["Accidentes de tránsito", "Abuso sexual y violación", "Robos y hurtos", "Manejo en estado de ebriedad", "Injurias y calumnias", "Tráfico de drogas", "Estafas y delitos económicos", "Agresiones y riñas", "Homicidios", "Discriminación y delitos de odio", "Amenazas y extorsiones (chantajes)", "Delitos informáticos", "Otros casos penales"] },
  { title: "Derecho Comercial", topics: ["Insolvencia y quiebras", "Marcas, patentes y propiedad intelectual", "Constitución de sociedad", "Redacción o revisión de contratos", "Litigio y arbitrajes", "Inversión extranjera", "Importaciones, exportaciones y derecho aduanero", "Recursos naturales y medioambientales", "Mercado de capitales", "Otros casos comerciales"] },
  { title: "Derecho Tributario", topics: ["Planificación tributaria", "Litigios tributarios", "Otros casos tributarios"] },
  { title: "Protección al Consumidor", topics: ["Inmobiliarias y constructoras", "Bancos, AFPs y empresas financieras", "Aseguradoras", "Transporte", "Tiendas comerciales y retail", "Entretención y turismo", "Comercio electrónico", "Automóviles e indumotoras", "Salud (hospitales, clínicas, etc.)", "Educación", "Servicios básicos (agua, luz, electricidad)", "Telecomunicaciones", "Otros casos de protección al consumidor"] },
  { title: "Derechos Humanos", topics: ["Detención ilegal por parte del Estado", "Lesiones por parte del Estado", "Torturas por parte del Estado", "Adopciones irregulares por parte del Estado", "Secuestro por parte del Estado", "Sustracción de menores por parte del Estado", "Violencia sexual por parte del Estado", "Homicidio por parte del Estado", "Otros casos de violación a los derechos humanos"] },
  { title: "Otros Casos", topics: ["Otro tipo de caso"] },
];

export const professionalLegalAreas = legalAreas.filter((area) => area.title !== "Casos más frecuentes").map((area) => area.title);

export function categoryForTopic(selectedCategory: string, topic: string) {
  if (selectedCategory !== "Casos más frecuentes") return selectedCategory;
  return legalAreas.slice(1).find((area) => area.topics.includes(topic))?.title || selectedCategory;
}
