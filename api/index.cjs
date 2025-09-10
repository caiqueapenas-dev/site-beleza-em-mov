// api/index.cjs
const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
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

  // usa a nova estrutura de cliente recomendada pelo mongodb
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
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

    const user = await usersCollection.findOne({
      email: email,
      password: password,
    });

    if (user) {
      res
        .status(200)
        .json({ success: true, user: { email: user.email, name: user.name } });
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
  // extrai todos os possíveis filtros da query string
  const { q, categoria, tamanho, cor } = req.query;
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  try {
    const database = await connectToDatabase();
    const productsCollection = database.collection('produtos');

    // constrói a query do mongodb dinamicamente
    let query = {};

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { palavras_chave: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (categoria && categoria !== 'todos') {
      query.categoria = categoria;
    }
    if (tamanho && tamanho !== 'todos') {
      // checa se a chave do tamanho existe e tem valor maior que 0
      query[`estoque.${tamanho.toLowerCase()}`] = { $gt: 0 };
    }
    if (cor && cor !== 'todos') {
      // $elemMatch para buscar dentro de um array de objetos
      query.cores = { $elemMatch: { nome: cor } };
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

// --- ROTA GET (LER PRODUTO ESPECÍFICO POR ID) ---
app.get('/api/produtos/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'id de produto inválido.' });
  }

  try {
    const database = await connectToDatabase();
    const productsCollection = database.collection('produtos');
    const product = await productsCollection.findOne({ _id: new ObjectId(id) });

    if (!product) {
      return res.status(404).json({ message: 'produto não encontrado' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: 'erro ao buscar produto',
      error: error.message,
    });
  }
});

// --- rotas para promoções/cupons ---
app.get('/api/promotions', async (req, res) => {
  try {
    const database = await connectToDatabase();
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');

    const promotionsCollection = database.collection('promotions');
    let settings = await promotionsCollection.findOne({});

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

res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
res.setHeader('Pragma', 'no-cache');
res.setHeader('Expires', '0');
app.post('/api/promotions', async (req, res) => {
  const newSettings = req.body;
  try {
    const database = await connectToDatabase();
    const promotionsCollection = database.collection('promotions');
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