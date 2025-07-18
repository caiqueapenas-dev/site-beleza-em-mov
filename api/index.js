// /api/index.js

// Importante: Instale o express com 'npm install express'
const express = require('express');
const app = express();

// Rota de teste
app.get('/api/teste', (req, res) => {
  res.send('A API está funcionando na Vercel!');
});

// Futuramente, suas rotas de produtos virão aqui
// app.get('/api/produtos', (req, res) => { ... });
// app.post('/api/produtos', (req, res) => { ... });

// Exporta o app para a Vercel
module.exports = app;
