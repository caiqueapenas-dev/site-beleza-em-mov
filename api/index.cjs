// api/index.cjs
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();

const uri = process.env.MONGODB_URI;
let cachedDb = null;

// função para conectar e "cachear" a conexão
async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }
  if (!uri) {
    throw new Error('string de conexão não configurada.');
  }
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('belezaEmMovDB');
  cachedDb = db; // armazena a conexão no cache
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
    const usersCollection = database.collection('users');

    const user = await usersCollection.findOne({ email: email, password: password });

    if (user) {
      res.status(200).json({ success: true, user: { email: user.email, name: user.name } });
    } else {
      res.status(401).json({ success: false, message: 'email ou senha inválidos.' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'erro no servidor ao tentar fazer login',
      error: error.message,
    });
  }
});

// --- rota get (ler produtos) ---
app.get('/api/produtos', async (req, res) => {
  const { q } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const database = await connectToDatabase();
    const productsCollection = database.collection('produtos');

    let query = {};
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { palavras_chave: { $regex: q, $options: 'i' } },
        ],
      };
    }

    const totalProducts = await productsCollection.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await productsCollection
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).json({ products, totalPages, currentPage: page });
  } catch (error) {
    res.status(500).json({
      message: 'erro ao buscar produtos',
      error: error.message,
    });
  }
});

// --- rotas para promoções/cupons ---

// rota para buscar as configurações de promoção (incluindo cupons)
app.get('/api/promotions', async (req, res) => {
  try {
    const database = await connectToDatabase();
    const promotionsCollection = database.collection('promotions');
    // busca o primeiro documento da coleção (vamos salvar tudo em um único documento)
    let settings = await promotionsCollection.findOne({});

    // se não existir, cria um padrão
    if (!settings) {
      settings = {
        banner: {
          isActive: false,
          text: '',
          textColor: '#ffffff',
          backgroundColor: '#000000',
        },
        coupons: [],
      };
    }

    res.status(200).json(settings);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'erro ao buscar promoções', error: error.message });
  }
});

// rota para salvar/atualizar as configurações
app.post('/api/promotions', async (req, res) => {
  const newSettings = req.body;
  try {
    const database = await connectToDatabase();
    const promotionsCollection = database.collection('promotions');

    // usa "replaceOne" com "upsert: true" para substituir o documento existente ou criar um novo
    await promotionsCollection.replaceOne({}, newSettings, { upsert: true });

    res.status(200).json({ message: 'promoções salvas com sucesso' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'erro ao salvar promoções', error: error.message });
  }
});


// --- rota post (adicionar produto) ---
app.post('/api/produtos', async (req, res) => {
  const newProduct = req.body;
  try {
    const database = await connectToDatabase();
    const productsCollection = database.collection('produtos');
    const result = await productsCollection.insertOne(newProduct);
    res.status(201).json({ ...newProduct, _id: result.insertedId });
  } catch (error) {
    res.status(500).json({
      message: 'erro ao adicionar produto',
      error: error.message,
    });
  }
});

// --- rota put (editar produto) ---
app.put('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'id de produto inválido.' });
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
      return res.status(404).json({ message: 'produto não encontrado' });
    }
    res.status(200).json({ ...updatedData, _id: id });
  } catch (error) {
    res.status(500).json({
      message: 'erro ao editar produto',
      error: error.message,
    });
  }
});

// --- rota delete (apagar produto) ---
app.delete('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'id de produto inválido.' });
  }

  try {
    const database = await connectToDatabase();
    const productsCollection = database.collection('produtos');
    const result = await productsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'produto não encontrado' });
    }
    res.status(200).json({ message: 'produto deletado com sucesso' });
  } catch (error) {
    res.status(500).json({
      message: 'erro ao deletar produto',
      error: error.message,
    });
  }
});

module.exports = app;