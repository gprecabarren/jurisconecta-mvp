CREATE TABLE IF NOT EXISTS team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  initials TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS help_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO team_members (id, name, role, bio, initials, sort_order) VALUES
  ('maria', 'María Teresa Recabarren', 'Directora legal', 'Abogada enfocada en derecho penal y acceso a una orientación jurídica clara.', 'MR', 1),
  ('tomas', 'Tomás Valdés', 'Operaciones', 'Acompaña la experiencia de personas y profesionales en la plataforma.', 'TV', 2),
  ('sofia', 'Sofía Leiva', 'Éxito profesional', 'Apoya la activación y el crecimiento de perfiles jurídicos.', 'SL', 3);

INSERT OR IGNORE INTO help_articles (id, title, category, excerpt, sort_order) VALUES
  ('perfil', 'Completar y publicar tu perfil profesional', 'Perfil profesional', 'Qué información revisamos antes de habilitar tu perfil.', 1),
  ('casos', 'Cómo funcionan los casos preferentes y del pool', 'Casos y oportunidades', 'Diferencias entre cada tipo de oportunidad y cómo acceder.', 2),
  ('creditos', 'Créditos, planes y renovaciones', 'Plan y facturación', 'Cómo se consumen los créditos y cuándo se renueva tu plan.', 3),
  ('evaluaciones', 'Evaluaciones y reputación profesional', 'Perfil profesional', 'Cómo se muestran las evaluaciones de tus clientes.', 4),
  ('seguridad', 'Seguridad de tu cuenta y datos de contacto', 'Cuenta y seguridad', 'Recomendaciones para cuidar tu acceso y tu información.', 5),
  ('soporte', 'Contactar al equipo de soporte', 'Cuenta y seguridad', 'Canales de ayuda para cambios importantes en tu cuenta.', 6);
