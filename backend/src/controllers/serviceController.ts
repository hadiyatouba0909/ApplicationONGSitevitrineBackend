import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';

export const serviceValidation = [
  body('titre').trim().notEmpty().withMessage('Le titre est requis'),
  body('description').trim().notEmpty().withMessage('La description est requise'),
  body('icone').trim().optional(),
  body('ordre').optional().isInt({ min: 0 }).withMessage('Ordre invalide'),
];

// GET /api/services - Liste publique
export const getServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE published = true ORDER BY ordre ASC, created_at ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur getServices:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// GET /api/services/admin - Liste admin
export const getAllServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY ordre ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur getAllServices:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// POST /api/services
export const createService = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { titre, description, icone, ordre, published } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO services (titre, description, icone, ordre, published) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titre, description, icone || null, ordre || 0, published !== false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur createService:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// PUT /api/services/:id
export const updateService = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { titre, description, icone, ordre, published } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM services WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Service introuvable' });
      return;
    }

    const s = existing.rows[0];
    const result = await pool.query(
      'UPDATE services SET titre=$1, description=$2, icone=$3, ordre=$4, published=$5 WHERE id=$6 RETURNING *',
      [
        titre ?? s.titre,
        description ?? s.description,
        icone !== undefined ? icone : s.icone,
        ordre !== undefined ? ordre : s.ordre,
        published !== undefined ? published : s.published,
        id,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur updateService:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// DELETE /api/services/:id
export const deleteService = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const existing = await pool.query('SELECT id FROM services WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Service introuvable' });
      return;
    }
    await pool.query('DELETE FROM services WHERE id = $1', [id]);
    res.json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    console.error('Erreur deleteService:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
