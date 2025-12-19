// Configuração e conexão com PostgreSQL
const { Pool } = require('pg');
require('dotenv').config();

// Pool de conexões com o banco de dados
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'finance_user',
  password: process.env.DB_PASSWORD || 'finance_pass',
  database: process.env.DB_NAME || 'finance_db',
});

// Testar conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro inesperado no PostgreSQL:', err);
});

module.exports = pool;

