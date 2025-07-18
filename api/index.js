// api/index.js
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

// Pega a string de conexão que você configurou na Vercel
const uri = process.env.MONGODB_URI;

// Rota para buscar os produtos no banco de dados
app.get('/api/produtos', async (req, res) => {
  // Garante que a URI foi configurada
  if (!uri) {
    return res
      .status(500)
      .json({ message: 'String de conexão do MongoDB não configurada.' });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    // Use o nome do seu banco (se não especificou, pode ser 'test') e da coleção
    const database = client.db('belezaEmMovDB');
    const productsCollection = database.collection('produtos');

    const products = await productsCollection.find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Erro ao buscar produtos', error: error.message });
  } finally {
    await client.close();
  }
});

module.exports = app;
