PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS subscription_plans (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  monthly_credits INTEGER NOT NULL CHECK (monthly_credits > 0),
  monthly_price_clp INTEGER NOT NULL DEFAULT 0 CHECK (monthly_price_clp >= 0),
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

INSERT OR REPLACE INTO subscription_plans (code, name, monthly_credits, monthly_price_clp, description, sort_order) VALUES
  ('silver', 'Silver', 200, 0, 'Para comenzar a recibir oportunidades y construir presencia profesional.', 1),
  ('gold', 'Gold', 500, 0, 'Mayor capacidad mensual para acceder a oportunidades de distintas materias.', 2),
  ('premium', 'Premium', 1000, 0, 'Cobertura amplia para equipos o profesionales con alta actividad.', 3);

ALTER TABLE lawyer_profiles ADD COLUMN plan_code TEXT NOT NULL DEFAULT 'silver';
ALTER TABLE lawyer_profiles ADD COLUMN credit_balance INTEGER NOT NULL DEFAULT 0;
ALTER TABLE lawyer_profiles ADD COLUMN renewal_date TEXT;
ALTER TABLE lawyer_profiles ADD COLUMN application_status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE lawyer_profiles ADD COLUMN application_submitted_at TEXT;
ALTER TABLE lawyer_profiles ADD COLUMN application_reviewed_at TEXT;
ALTER TABLE lawyer_profiles ADD COLUMN application_review_note TEXT;

ALTER TABLE legal_cases ADD COLUMN credit_cost INTEGER NOT NULL DEFAULT 5 CHECK (credit_cost >= 0);
ALTER TABLE legal_cases ADD COLUMN credit_updated_at TEXT;

CREATE TABLE IF NOT EXISTS lawyer_applications (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  rut TEXT,
  id_document_number TEXT,
  birth_date TEXT,
  graduation_date TEXT,
  university TEXT,
  attention_mode TEXT,
  service_localities TEXT,
  experience_years INTEGER,
  gender TEXT,
  additional_studies TEXT,
  work_experience TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  youtube_url TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  website_url TEXT,
  address TEXT,
  selected_plan_code TEXT NOT NULL DEFAULT 'silver',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lawyer_application_documents (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('identity_front', 'identity_back', 'degree_certificate')),
  object_key TEXT NOT NULL UNIQUE,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL CHECK (file_size > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, document_type)
);

CREATE TABLE IF NOT EXISTS lawyer_credit_ledger (
  id TEXT PRIMARY KEY,
  lawyer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL CHECK (delta <> 0),
  balance_after INTEGER NOT NULL CHECK (balance_after >= 0),
  reason TEXT NOT NULL CHECK (reason IN ('monthly_allocation', 'case_access', 'manual_adjustment')),
  related_case_id TEXT REFERENCES legal_cases(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_accesses (
  case_id TEXT NOT NULL REFERENCES legal_cases(id) ON DELETE CASCADE,
  lawyer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credits_spent INTEGER NOT NULL CHECK (credits_spent >= 0),
  contact_snapshot_json TEXT NOT NULL,
  accessed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (case_id, lawyer_id)
);

CREATE TRIGGER IF NOT EXISTS case_access_requires_credits
BEFORE INSERT ON case_accesses
WHEN COALESCE((SELECT credit_balance FROM lawyer_profiles WHERE user_id = NEW.lawyer_id), 0) < NEW.credits_spent
BEGIN
  SELECT RAISE(ABORT, 'insufficient_credits');
END;

CREATE TRIGGER IF NOT EXISTS case_access_debits_credits
AFTER INSERT ON case_accesses
BEGIN
  UPDATE lawyer_profiles
  SET credit_balance = credit_balance - NEW.credits_spent
  WHERE user_id = NEW.lawyer_id;

  INSERT INTO lawyer_credit_ledger (id, lawyer_id, delta, balance_after, reason, related_case_id)
  VALUES (
    lower(hex(randomblob(16))),
    NEW.lawyer_id,
    -NEW.credits_spent,
    (SELECT credit_balance FROM lawyer_profiles WHERE user_id = NEW.lawyer_id),
    'case_access',
    NEW.case_id
  );
END;

CREATE INDEX IF NOT EXISTS idx_case_accesses_lawyer_accessed ON case_accesses(lawyer_id, accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_lawyer_created ON lawyer_credit_ledger(lawyer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_lawyer_type ON lawyer_application_documents(user_id, document_type);
CREATE INDEX IF NOT EXISTS idx_cases_status_created ON legal_cases(status, created_at DESC);

UPDATE lawyer_profiles
SET
  plan_code = CASE user_id
    WHEN 'lawyer-pablo-martin' THEN 'gold'
    WHEN 'lawyer-camila-fuentes' THEN 'premium'
    ELSE 'silver'
  END,
  credit_balance = CASE user_id
    WHEN 'lawyer-maria-recabarren' THEN 191
    WHEN 'lawyer-pablo-martin' THEN 488
    WHEN 'lawyer-camila-fuentes' THEN 997
    ELSE credit_balance
  END,
  renewal_date = '2026-09-10',
  application_status = CASE
    WHEN user_id IN ('lawyer-maria-recabarren', 'lawyer-pablo-martin', 'lawyer-camila-fuentes') THEN 'approved'
    ELSE application_status
  END,
  application_reviewed_at = CASE
    WHEN user_id IN ('lawyer-maria-recabarren', 'lawyer-pablo-martin', 'lawyer-camila-fuentes') THEN CURRENT_TIMESTAMP
    ELSE application_reviewed_at
  END;

INSERT OR IGNORE INTO lawyer_credit_ledger (id, lawyer_id, delta, balance_after, reason) VALUES
  ('seed-credit-maria', 'lawyer-maria-recabarren', 191, 191, 'monthly_allocation'),
  ('seed-credit-pablo', 'lawyer-pablo-martin', 488, 488, 'monthly_allocation'),
  ('seed-credit-camila', 'lawyer-camila-fuentes', 997, 997, 'monthly_allocation');
