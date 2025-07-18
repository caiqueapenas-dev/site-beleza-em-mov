// api/index.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb'); // <-- IMPORTANTE: ADICIONAR ObjectId
const app = express();

const uri = process.env.MONGODB_URI;
app.use(express.json());

// --- ROTA GET (LER PRODUTOS) ---
// (nenhuma alteração aqui)
app.get('/api/produtos', async (req, res) => {
  if (!uri)
    return res
      .status(500)
      .json({ message: 'String de conexão não configurada.' });
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

// --- ROTA POST (ADICIONAR PRODUTO) ---
// (nenhuma alteração aqui)
app.post('/api/produtos', async (req, res) => {
  if (!uri)
    return res
      .status(500)
      .json({ message: 'String de conexão não configurada.' });
  const client = new MongoClient(uri);
  const newProduct = req.body;
  try {
    await client.connect();
    const database = client.db('belezaEmMovDB');
    const productsCollection = database.collection('produtos');
    const result = await productsCollection.insertOne(newProduct);
    res.status(201).json({ ...newProduct, _id: result.insertedId });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao adicionar produto', error: error.message });
  } finally {
    await client.close();
  }
});

// --- ROTA PUT (EDITAR PRODUTO) - NOVO ---
app.put('/api/produtos/:id', async (req, res) => {
  if (!uri)
    return res
      .status(500)
      .json({ message: 'String de conexão não configurada.' });

  const client = new MongoClient(uri);
  const { id } = req.params; // Pega o ID da URL
  const updatedData = req.body; // Pega os novos dados do corpo da requisição

  // Remove o campo _id do corpo para não tentar atualizar o próprio _id
  delete updatedData._id;

  try {
    await client.connect();
    const database = client.db('belezaEmMovDB');
    const productsCollection = database.collection('produtos');

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) }, // Encontra o produto pelo seu _id
      { $set: updatedData }, // Define os novos dados
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json({ ...updatedData, _id: id }); // Retorna o produto atualizado
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao editar produto', error: error.message });
  } finally {
    await client.close();
  }
});

module.exports = app;
