PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('person', 'lawyer', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lawyer_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  specialties_json TEXT NOT NULL DEFAULT '[]',
  region TEXT,
  commune TEXT,
  bio TEXT,
  verified_at TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'none' CHECK (subscription_status IN ('none', 'trial', 'active', 'past_due', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS legal_cases (
  id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  region TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'matched', 'closed')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN password_hash TEXT;
ALTER TABLE users ADD COLUMN phone TEXT;
ALTER TABLE users ADD COLUMN region TEXT;
ALTER TABLE users ADD COLUMN commune TEXT;
ALTER TABLE users ADD COLUMN auth_provider TEXT NOT NULL DEFAULT 'password';
ALTER TABLE users ADD COLUMN provider_subject TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_subject ON users(auth_provider, provider_subject) WHERE provider_subject IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

CREATE TABLE IF NOT EXISTS case_details (
  case_id TEXT PRIMARY KEY REFERENCES legal_cases(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  situation TEXT NOT NULL,
  desired_outcome TEXT NOT NULL,
  attention_mode TEXT NOT NULL,
  commune TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cases_person_created ON legal_cases(person_id, created_at DESC);

INSERT OR IGNORE INTO users (id, email, full_name, role, status, password_hash, phone, region, commune, auth_provider) VALUES
  ('lawyer-maria-recabarren', 'mrecabarrend@gmail.com', 'María Teresa Recabarren', 'lawyer', 'active', 'pbkdf2$210000$QV-7mRHR0w0u2WlZwwkFoA$SOLF9deJNbrODPF4TL7az699mNnlxtGuKQoTDFbkJCs', '+56 9 9556 0415', 'Biobío', 'Concepción', 'password'),
  ('lawyer-pablo-martin', 'pablo@ejemplo.cl', 'Pablo San Martín', 'lawyer', 'active', 'pbkdf2$210000$n1VOJv7Mg2c_z4Efa5LOOA$cdjV6uQWS1AiNnny9LQiO0_8AGZuar_BqZbtZ6Q7eDQ', '+56 9 8244 3221', 'Región Metropolitana', 'Providencia', 'password'),
  ('lawyer-camila-fuentes', 'camila@ejemplo.cl', 'Camila Fuentes', 'lawyer', 'active', 'pbkdf2$210000$VwO0rot6Q2xLHrtX24Cq7Q$S8ih20HkQgWPLAAGs3ND1WogMhIFP7ZNkPiTArAxagw', '+56 9 7111 8940', 'Valparaíso', 'Viña del Mar', 'password'),
  ('person-cliente-prueba', 'cliente.prueba@jurisconecta.cl', 'Cliente de prueba', 'person', 'active', 'pbkdf2$210000$kRIk1mdKawpUApDsgPhI_w$iULuKBt7lPHaqdMLtPnmgPhYWUHLcIs_1vBzJnB26uk', '+56 9 6000 1234', 'Región Metropolitana', 'Santiago', 'password');

INSERT OR IGNORE INTO lawyer_profiles (user_id, specialties_json, region, commune, bio, verified_at, subscription_status) VALUES
  ('lawyer-maria-recabarren', '["Derecho Penal"]', 'Biobío', 'Concepción', 'Abogada enfocada en derecho penal y acceso a orientación jurídica clara.', CURRENT_TIMESTAMP, 'trial'),
  ('lawyer-pablo-martin', '["Derecho Laboral"]', 'Región Metropolitana', 'Providencia', 'Abogado especializado en relaciones laborales y negociación.', CURRENT_TIMESTAMP, 'trial'),
  ('lawyer-camila-fuentes', '["Derecho Familiar"]', 'Valparaíso', 'Viña del Mar', 'Abogada enfocada en derecho de familia y acompañamiento cercano.', CURRENT_TIMESTAMP, 'trial');
