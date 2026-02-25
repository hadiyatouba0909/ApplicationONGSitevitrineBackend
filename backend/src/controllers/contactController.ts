import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database';

export const contactValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('sujet').trim().notEmpty().withMessage('Le sujet est requis'),
  body('message').trim().isLength({ min: 10 }).withMessage('Le message doit contenir au moins 10 caractères'),
];

// POST /api/contact - Envoyer un message
export const sendContact = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }

  const { nom, email, sujet, message } = req.body;

  try {
    await pool.query(
      'INSERT INTO contacts (nom, email, sujet, message) VALUES ($1, $2, $3, $4)',
      [nom, email, sujet, message]
    );
    res.status(201).json({ message: 'Message envoyé avec succès. Nous vous répondrons dans les plus brefs délais.' });
  } catch (error) {
    console.error('Erreur sendContact:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// GET /api/contact/messages - Liste des messages (admin)
export const getMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lu } = req.query;
    let query = 'SELECT * FROM contacts';
    const params: boolean[] = [];

    if (lu !== undefined) {
      query += ' WHERE lu = $1';
      params.push(lu === 'true');
    }

    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur getMessages:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// PATCH /api/contact/messages/:id/lu - Marquer comme lu
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'UPDATE contacts SET lu = true WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Message introuvable' });
      return;
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur markAsRead:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};

// DELETE /api/contact/messages/:id - Supprimer un message
export const deleteMessage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Message introuvable' });
      return;
    }
    res.json({ message: 'Message supprimé' });
  } catch (error) {
    console.error('Erreur deleteMessage:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
};
