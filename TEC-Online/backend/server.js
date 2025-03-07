const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();

const User = require('./models/User');  // Importando o modelo User

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tec-online', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectado ao MongoDB');
})
.catch((err) => {
  console.error('❌ Erro ao conectar ao MongoDB:', err);
  process.exit(1);
});

// Rota para registrar um novo usuário
app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    // Verificar se todos os campos foram preenchidos
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o usuário ou o email já estão registrados
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário ou e-mail já cadastrados' });
    }

    // Criar um novo usuário e salvar no banco de dados
    const newUser = new User({ fullName, username, email, password });
    await newUser.save();

    return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar o usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
  }
});

// Rota para login do usuário
app.post('/api/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      console.log('Username recebido:', username);  // Verificar o que está sendo enviado
      console.log('Senha recebida:', password);  // Verificar o que está sendo enviado
  
      // Encontrar o usuário pelo username
      const user = await User.findOne({ username });
      
      // Logar o usuário encontrado para verificar
      console.log('Usuário encontrado:', user);  // Adicionando o log aqui

      if (!user) {
        console.log('Usuário não encontrado!');
        return res.status(400).json({ message: 'Usuário não encontrado!' });
      }
  
      // Comparar a senha
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('Senha inválida!');
        return res.status(400).json({ message: 'Senha inválida!' });
      }
  
      // Gerar o token JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h',
      });
  
      console.log('Login bem-sucedido!');
      return res.status(200).json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
    }
  });
  

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
