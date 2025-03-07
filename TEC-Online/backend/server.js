const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Carrega variáveis de ambiente
const User = require('./models/User'); // Modelo de Usuário

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'chave_super_segura';

app.use(cors());
app.use(bodyParser.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tec-online', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado ao MongoDB'))
  .catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];  // Pega o token do cabeçalho Authorization
  
  if (!token) {
    return res.status(401).json({ message: 'Você precisa estar autenticado para atualizar o perfil' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  // Verifica o token
    req.user = decoded;  // Adiciona o usuário decodificado à requisição
    next();  // Segue para a próxima rota
  } catch (error) {
    res.status(403).json({ message: 'Token inválido ou expirado' });
  }
};

// Rota de Registro de Usuário
app.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário ou e-mail já cadastrados' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Rota de Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });
    res.status(200).json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Rota para Buscar Perfil do Usuário Logado
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('fullName username'); // Somente nome completo e nome de usuário

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json(user);  // Retorna o perfil do usuário sem a senha
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro ao buscar perfil do usuário' });
  }
});

// Rota para Atualizar Perfil do Usuário Logado
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, username } = req.body;

    // Verificando se os campos obrigatórios foram fornecidos
    if (!fullName || !username) {
      return res.status(400).json({ message: 'Nome Completo e Nome de Utilizador são obrigatórios' });
    }

    // Encontrando o usuário logado pelo ID
    let user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    // Atualizando os campos do usuário
    user.fullName = fullName || user.fullName;
    user.username = username || user.username;

    // Salvando as alterações no banco de dados
    await user.save();

    res.json({ message: 'Perfil atualizado com sucesso', user });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil' });
  }
});

// Testando se o Servidor Está Rodando
app.get('/', (req, res) => {
  res.send('🚀 Servidor rodando com sucesso!');
});

// Iniciando o Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
