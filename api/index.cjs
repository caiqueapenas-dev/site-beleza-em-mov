// api/index.cjs
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

const uri = process.env.MONGODB_URI;
let cachedDb = null;

// Função para conectar e "cachear" a conexão
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  if (!uri) {
    throw new Error('String de conexão não configurada.');
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('belezaEmMovDB');
  cachedDb = db; // Armazena a conexão no cache
  return db;
}

app.use(express.json());

 app.post('/api/login', async (req, res) => {
   const { email, password } = req.body;
 
   if (!email || !password) {
     return res.status(400).json({ message: 'email e senha são obrigatórios.' });
   }
 
   try {
     const database = await connectToDatabase();
     const usersCollection = database.collection('users'); // nova coleção de usuários
 
     // encontre um usuário com o email e senha fornecidos
     const user = await usersCollection.findOne({ email: email, password: password });
 
     if (user) {
       // login bem-sucedido
       res.status(200).json({ success: true, user: { email: user.email, name: user.name } });
     } else {
       // credenciais inválidas
       res.status(401).json({ success: false, message: 'email ou senha inválidos.' });
     }
   } catch (error) {
     res.status(500).json({
       message: 'erro no servidor ao tentar fazer login',
       error: error.message,
     });
   }
 });

// --- ROTA GET (LER PRODUTOS) ---
app.get('/api/produtos', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const productsCollection = database.collection('produtos');
    const products = await productsCollection.find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar produtos',
      error: error.message,
    });
  }
});

// --- ROTA POST (ADICIONAR PRODUTO) ---
app.post('/api/produtos', async (req, res) => {
  const newProduct = req.body;
  try {
    const database = await connectToDatabase();
    const productsCollection = database.collection('produtos');
    const result = await productsCollection.insertOne(newProduct);
    res.status(201).json({ ...newProduct, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao adicionar produto',
      error: error.message,
    });
  }
});

// --- ROTA PUT (EDITAR PRODUTO) ---
app.put('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de produto inválido.' });
  }
  delete updatedData._id;

  try {
    const database = await connectToDatabase();
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
    res.status(500).json({
      message: 'Erro ao editar produto',
      error: error.message,
    });
  }
});

// --- ROTA DELETE (APAGAR PRODUTO) ---
app.delete('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID de produto inválido.' });
  }

  try {
    const database = await connectToDatabase();
    const productsCollection = database.collection('produtos');
    const result = await productsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao deletar produto',
      error: error.message,
    });
  }
});

module.exports = app;
