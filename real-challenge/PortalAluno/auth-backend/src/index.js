const path = require('path');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { getUserByRa } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '2h';

app.use(cors());
app.use(express.json());

const FRONT_DIR = path.resolve(__dirname, '..', '..');
app.use(express.static(FRONT_DIR));

app.get('/', (req, res) => {
  res.sendFile(path.join(FRONT_DIR, 'paginaLogin.html'));
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/login', (req, res) => {
  const { ra, senha } = req.body || {};

  if (!ra || !senha) {
    return res.status(400).json({ message: 'RA e senha são obrigatórios.' });
  }

  const usuario = getUserByRa(ra);
  if (!usuario) {
    return res.status(401).json({ message: 'RA ou senha incorretos.' });
  }

  const senhaValida = bcrypt.compareSync(senha, usuario.senha_hash);
  if (!senhaValida) {
    return res.status(401).json({ message: 'RA ou senha incorretos.' });
  }

  const token = jwt.sign({ ra: usuario.ra }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

  return res.json({
    message: 'Login realizado com sucesso.',
    token,
    user: {
      ra: usuario.ra,
      nome: usuario.nome,
      curso: usuario.curso,
      email: usuario.email,
    },
  });
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '').trim();

  if (!token) {
    return res.status(401).json({ message: 'Token não informado.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.auth = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Sessão inválida ou expirada.' });
  }
};

app.get('/api/me', authenticate, (req, res) => {
  const usuario = getUserByRa(req.auth.ra);
  if (!usuario) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  return res.json({
    user: {
      ra: usuario.ra,
      nome: usuario.nome,
      curso: usuario.curso,
      email: usuario.email,
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

const startServer = () => app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API rodando em http://localhost:${PORT}`);
});

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
