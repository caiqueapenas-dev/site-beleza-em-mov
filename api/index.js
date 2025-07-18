// api/index.js
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

// Pega a string de conexão que você configurou na Vercel
const uri = process.env.MONGODB_URI;

// Middleware para o Express entender JSON
app.use(express.json());

// --- ROTA GET (LER PRODUTOS) - Já existente ---
app.get('/api/produtos', async (req, res) => {
  if (!uri) {
    return res
      .status(500)
      .json({ message: 'String de conexão não configurada.' });
  }
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const database = client.db('belezaEmMovDB');
    const productsCollection = database.collection('produtos');
    const products = await productsCollection.find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao buscar produtos', error: error.message });
  } finally {
    await client.close();
  }
});

// --- ROTA POST (ADICIONAR NOVO PRODUTO) - NOVO ---
app.post('/api/produtos', async (req, res) => {
  if (!uri) {
    return res
      .status(500)
      .json({ message: 'String de conexão não configurada.' });
  }

  const client = new MongoClient(uri);
  const newProduct = req.body; // Os dados do produto vêm no corpo da requisição

  try {
    await client.connect();
    const database = client.db('belezaEmMovDB');
    const productsCollection = database.collection('produtos');

    const result = await productsCollection.insertOne(newProduct);

    // Retorna o produto que foi inserido com o ID gerado pelo Mongo
    res.status(201).json({ ...newProduct, _id: result.insertedId });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao adicionar produto', error: error.message });
  } finally {
    await client.close();
  }
});

module.exports = app;
