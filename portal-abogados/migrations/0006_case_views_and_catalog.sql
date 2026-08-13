PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS case_views (
  case_id TEXT NOT NULL REFERENCES legal_cases(id) ON DELETE CASCADE,
  viewer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  viewed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (case_id, viewer_id)
);

CREATE INDEX IF NOT EXISTS idx_case_views_case ON case_views(case_id, viewed_at DESC);
