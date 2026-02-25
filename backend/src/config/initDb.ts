import fs from 'fs';
import path from 'path';
import pool from './database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase(): Promise<void> {
  const client = await pool.connect();
  try {
    console.log('🚀 Initialisation de la base de données...');

    // Lecture du fichier SQL
    const sqlPath = path.join(__dirname, '../../database/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    await client.query(sql);
    console.log('✅ Tables créées avec succès');

    // Création de l'administrateur par défaut
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@lumiereavenir.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2026!';

    const existing = await client.query('SELECT id FROM admins WHERE email = $1', [adminEmail]);
    if (existing.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await client.query(
        'INSERT INTO admins (email, password, nom) VALUES ($1, $2, $3)',
        [adminEmail, hashedPassword, 'Administrateur']
      );
      console.log(`✅ Admin créé: ${adminEmail}`);
    } else {
      console.log('ℹ️ Admin déjà existant');
    }

    console.log('🎉 Base de données initialisée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase();
