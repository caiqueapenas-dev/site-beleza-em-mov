// api/index.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

const uri = process.env.MONGODB_URI;
app.use(express.json());

// --- ROTA GET (LER PRODUTOS) ---
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

// --- ROTA PUT (EDITAR PRODUTO) ---
app.put('/api/produtos/:id', async (req, res) => {
  if (!uri)
    return res
      .status(500)
      .json({ message: 'String de conexão não configurada.' });

  const client = new MongoClient(uri);
  const { id } = req.params;
  const updatedData = req.body;

  // VERIFICAÇÃO DE SEGURANÇA: Checa se o ID é válido antes de continuar
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de produto inválido.' });
  }

  delete updatedData._id;

  try {
    await client.connect();
    const database = client.db('belezaEmMovDB');
    const productsCollection = database.collection('produtos');

    const result = await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json({ ...updatedData, _id: id });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao editar produto', error: error.message });
  } finally {
    await client.close();
  }
});

// --- ROTA DELETE (APAGAR PRODUTO) - NOVO ---
app.delete('/api/produtos/:id', async (req, res) => {
  if (!uri)
    return res
      .status(500)
      .json({ message: 'String de conexão não configurada.' });

  const client = new MongoClient(uri);
  const { id } = req.params;

  // VERIFICAÇÃO DE SEGURANÇA: Checa se o ID é válido
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de produto inválido.' });
  }

  try {
    await client.connect();
    const database = client.db('belezaEmMovDB');
    const productsCollection = database.collection('produtos');

    const result = await productsCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Erro ao deletar produto', error: error.message });
  } finally {
    await client.close();
  }
});

module.exports = app;
