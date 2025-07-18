// api/index.js
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

app.use(express.json());

// Função para conectar ao banco de dados e executar uma operação
async function withDb(operation, res) {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return res
      .status(500)
      .json({
        message: 'Erro fatal: Variável de ambiente MONGODB_URI não encontrada.',
      });
  }

  let client;
  try {
    client = new MongoClient(uri);
    await client.connect();
    const db = client.db('belezaEmMovDB');
    await operation(db);
  } catch (error) {
    console.error('ERRO NA API:', error);
    res.status(500).json({
      message: 'Ocorreu um erro no servidor.',
      errorName: error.name,
      errorMessage: error.message,
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

// --- ROTAS DA API ---

// GET (Ler todos os produtos)
app.get('/api/produtos', (req, res) => {
  withDb(async (db) => {
    const products = await db.collection('produtos').find({}).toArray();
    res.status(200).json(products);
  }, res);
});

// POST (Adicionar novo produto)
app.post('/api/produtos', (req, res) => {
  withDb(async (db) => {
    const newProduct = req.body;
    const result = await db.collection('produtos').insertOne(newProduct);
    res.status(201).json({ ...newProduct, _id: result.insertedId });
  }, res);
});

// PUT (Editar um produto)
app.put('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  delete updatedData._id;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de produto inválido.' });
  }

  withDb(async (db) => {
    const result = await db
      .collection('produtos')
      .updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json({ ...updatedData, _id: id });
  }, res);
});

// DELETE (Apagar um produto)
app.delete('/api/produtos/:id', (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de produto inválido.' });
  }

  withDb(async (db) => {
    const result = await db
      .collection('produtos')
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json({ message: 'Produto deletado com sucesso' });
  }, res);
});

module.exports = app;
