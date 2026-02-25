-- ==============================================
-- Base de données LumièreAvenir ONG
-- ==============================================

-- Table des administrateurs
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nom VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des activités (images + description)
CREATE TABLE IF NOT EXISTS activites (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500) NOT NULL,
  date_activite DATE,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des services
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  titre VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icone VARCHAR(100),
  ordre INT DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des messages de contact
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  sujet VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_activites_updated_at
  BEFORE UPDATE ON activites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Données initiales - Services
INSERT INTO services (titre, description, icone, ordre) VALUES
  ('Éducation Primaire', 'Nous offrons un accès à l''éducation primaire de qualité pour les enfants issus de milieux défavorisés, avec des enseignants formés et du matériel pédagogique adapté.', 'BookOpen', 1),
  ('Bourses Scolaires', 'Notre programme de bourses scolaires permet à des centaines d''élèves méritants de poursuivre leurs études sans contrainte financière.', 'Award', 2),
  ('Centres d''Apprentissage', 'Nos centres d''apprentissage offrent un suivi personnalisé après l''école pour aider les enfants en difficulté.', 'School', 3),
  ('Formation Professionnelle', 'Nous proposons des formations professionnelles aux jeunes adultes pour favoriser leur insertion sur le marché du travail.', 'Briefcase', 4),
  ('Sensibilisation Communautaire', 'Nous travaillons avec les communautés locales pour sensibiliser à l''importance de l''éducation et lutter contre le décrochage scolaire.', 'Users', 5),
  ('Fournitures Scolaires', 'Distribution gratuite de kits scolaires complets (cahiers, stylos, sacs) aux enfants dans le besoin en début d''année scolaire.', 'Package', 6);

-- Données initiales - Activités
INSERT INTO activites (titre, description, image_url, date_activite) VALUES
  ('Distribution de kits scolaires 2025', 'Plus de 500 enfants ont reçu leurs kits scolaires pour la rentrée 2025-2026 grâce à nos généreux donateurs.', '/uploads/activite-1.jpg', '2025-09-01'),
  ('Camp d''été éducatif', 'Deux semaines d''activités éducatives et récréatives pour 200 enfants pendant les vacances d''été 2025.', '/uploads/activite-2.jpg', '2025-07-15'),
  ('Inauguration du centre de Bamako', 'Ouverture officielle de notre nouveau centre d''apprentissage à Bamako, accueillant 150 élèves.', '/uploads/activite-3.jpg', '2025-03-10');
