const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); // Importando o modelo de usuário

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json()); // Para tratar os dados em JSON

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/tec-online', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.log('Erro ao conectar ao MongoDB: ', err));

// Rota de registro de usuário
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar se todos os dados foram fornecidos
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o e-mail ou nome de usuário já estão em uso
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário ou e-mail já cadastrados' });
    }

    // Criar um novo usuário
    const newUser = new User({
      username,
      email,
      password, // Aqui a senha será criptografada automaticamente pelo middleware
    });

    // Salvar o novo usuário no banco
    await newUser.save();
    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário: ', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Rota de login (gera o JWT)
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    // Procurando o usuário no banco
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Usuário ou senha inválidos' });
    }

    // Comparando as senhas
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Usuário ou senha inválidos' });
    }

    // Gerando o token JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, 'secret_key', { expiresIn: '1h' }); // Substitua 'secret_key' por uma chave mais segura

    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    console.error('Erro no login: ', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Testando se o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor rodando com sucesso!');
});

// Iniciando o servidor na porta 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
