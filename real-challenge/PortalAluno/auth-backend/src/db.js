const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'portal.sqlite');

const DEFAULT_USER = {
  ra: 'E47259',
  senha: '12345678',
  nome: 'Douglas Andrade',
  curso: 'Sistemas de Informação',
  email: 'douglas.andrade@faculdade.edu.br',
};

const ensureDataDir = () => {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const initDb = () => {
  ensureDataDir();
  const db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ra TEXT UNIQUE NOT NULL,
      senha_hash TEXT NOT NULL,
      nome TEXT,
      curso TEXT,
      email TEXT
    );
  `);

  seedDefaultUser(db);

  return db;
};

const seedDefaultUser = (db) => {
  const existing = db.prepare('SELECT ra FROM users WHERE ra = ?').get(DEFAULT_USER.ra);
  const senhaHash = bcrypt.hashSync(DEFAULT_USER.senha, 10);

  if (!existing) {
    db.prepare(`
      INSERT INTO users (ra, senha_hash, nome, curso, email)
      VALUES (@ra, @senha_hash, @nome, @curso, @email);
    `).run({
      ra: DEFAULT_USER.ra,
      senha_hash: senhaHash,
      nome: DEFAULT_USER.nome,
      curso: DEFAULT_USER.curso,
      email: DEFAULT_USER.email,
    });
    return;
  }

  // Garantir senha e dados atualizados caso já exista
  db.prepare(`
    UPDATE users
    SET senha_hash = @senha_hash, nome = @nome, curso = @curso, email = @email
    WHERE ra = @ra;
  `).run({
    ra: DEFAULT_USER.ra,
    senha_hash: senhaHash,
    nome: DEFAULT_USER.nome,
    curso: DEFAULT_USER.curso,
    email: DEFAULT_USER.email,
  });
};

const db = initDb();

const getUserByRa = (ra) => db.prepare('SELECT ra, senha_hash, nome, curso, email FROM users WHERE ra = ?').get(ra);

module.exports = {
  db,
  getUserByRa,
  DEFAULT_USER,
};
