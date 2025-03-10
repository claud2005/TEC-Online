const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator'); // Para validação de dados
dotenv.config();

const User = require('./models/User'); // Importando o modelo User

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

// Middleware para tratamento de erros
const errorHandler = (err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ message: 'Erro interno no servidor', error: err.message });
};

app.use(errorHandler);

// Middleware para autenticar o token JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log("🔑 Token recebido:", token);  // Log para verificar o token no servidor

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
      console.error("🚨 Erro ao verificar token:", err.message);  // Log do erro de token inválido
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }

    req.user = decoded;
    next();
  });
};





// Rota para registrar um novo usuário
app.post('/api/signup', [
  body('fullName').notEmpty().withMessage('Nome completo é obrigatório'),
  body('username').notEmpty().withMessage('Nome de usuário é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('password').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullName, username, email, password } = req.body;

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
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
});

// Rota para login do usuário
app.post('/api/login', [
  body('username').notEmpty().withMessage('Nome de usuário é obrigatório'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;

    // Encontrar o usuário pelo username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado!' });
    }

    // Comparar a senha
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha inválida!' });
    }

    // Gerar o token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h',
    });

    return res.status(200).json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
});

// Rota para obter os dados do perfil do usuário autenticado
app.get('/api/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'ID do usuário não encontrado no token' });
    }

    console.log(`🔍 Buscando perfil do usuário ID: ${userId}`);

    // Buscar o usuário no banco de dados
    const user = await User.findById(userId).select('fullName username profilePicture');

    if (!user) {
      console.warn(`⚠️ Usuário com ID ${userId} não encontrado.`);
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    console.log(`✅ Perfil do usuário encontrado:`, user);
    return res.status(200).json(user);
  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
});


// Rota para atualizar os dados do perfil do usuário autenticado
app.put('/api/profile', authenticateToken, [
  body('fullName').optional().notEmpty().withMessage('Nome completo não pode estar vazio'),
  body('username').optional().notEmpty().withMessage('Nome de usuário não pode estar vazio'),
  body('profilePicture').optional(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const userId = req.user.userId;
    const { fullName, username, profilePicture } = req.body;

    // Verificar se ao menos um campo foi fornecido para atualização
    if (!fullName && !username && !profilePicture) {
      return res.status(400).json({ message: 'Nenhum dado para atualizar' });
    }

    // Atualizar os dados do usuário no banco de dados
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, username, profilePicture },
      { new: true } // Retorna o documento atualizado
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado para atualizar' });
    }

    return res.status(200).json({ message: 'Perfil atualizado com sucesso!', user: updatedUser });
  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento de erros
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});