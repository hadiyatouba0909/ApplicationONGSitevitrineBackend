import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import path from 'path';
import fs from 'fs';
import pool from '../config/database';

export const activityValidation = [
  body('titre').trim().notEmpty().withMessage('Le titre est requis'),
  body('description').trim().optional(),
  body('date_activite').optional().isDate().withMessage('Date invalide'),
];

// GET /api/activites - Liste publique
export const getActivites = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM activites WHERE published = true ORDER BY date_activite DESC, created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur getActivites:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// GET /api/activites/admin - Liste admin (toutes)
export const getAllActivites = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM activites ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur getAllActivites:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// POST /api/activites - Créer une activité
export const createActivite = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: 'Une image est requise' });
    return;
  }

  const { titre, description, date_activite, published } = req.body;
  const image_url = `/uploads/${req.file.filename}`;

  try {
    const result = await pool.query(
      'INSERT INTO activites (titre, description, image_url, date_activite, published) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titre, description || null, image_url, date_activite || null, published !== 'false']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur createActivite:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// PUT /api/activites/:id - Modifier une activité
export const updateActivite = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { titre, description, date_activite, published } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM activites WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Activité introuvable' });
      return;
    }

    let image_url = existing.rows[0].image_url;

    if (req.file) {
      // Suppression de l'ancienne image
      const oldPath = path.join(__dirname, '../../', image_url);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      image_url = `/uploads/${req.file.filename}`;
    }

    const result = await pool.query(
      'UPDATE activites SET titre=$1, description=$2, image_url=$3, date_activite=$4, published=$5 WHERE id=$6 RETURNING *',
      [
        titre || existing.rows[0].titre,
        description !== undefined ? description : existing.rows[0].description,
        image_url,
        date_activite || existing.rows[0].date_activite,
        published !== undefined ? published !== 'false' : existing.rows[0].published,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur updateActivite:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// DELETE /api/activites/:id - Supprimer une activité
export const deleteActivite = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const existing = await pool.query('SELECT * FROM activites WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Activité introuvable' });
      return;
    }

    // Suppression de l'image associée
    const imgPath = path.join(__dirname, '../../', existing.rows[0].image_url);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    await pool.query('DELETE FROM activites WHERE id = $1', [id]);
    res.json({ message: 'Activité supprimée avec succès' });
  } catch (error) {
    console.error('Erreur deleteActivite:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
