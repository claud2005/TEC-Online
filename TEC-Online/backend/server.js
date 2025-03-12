const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
dotenv.config();

const User = require('./models/User');
const Servico = require('./models/Servicos');

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
  console.log('Token recebido:', token); // Adicione este log

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
    if (err) {
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

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário ou e-mail já cadastrados' });
    }

    const newUser = new User({ fullName, username, email, password });
    await newUser.save();

    return res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    next(error);
  }
});

// Rota para login do usuário
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Usuário não encontrado!' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Senha inválida!' });
    }

    // Gera o token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1h', // Define o tempo de expiração do token
    });

    // Retorna o token no response
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

// Rota para obter os dados do perfil do usuário autenticado
app.get('/api/profile', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'ID do usuário não encontrado no token' });
    }

    const user = await User.findById(userId).select('fullName username profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
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

    if (!fullName && !username && !profilePicture) {
      return res.status(400).json({ message: 'Nenhum dado para atualizar' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, username, profilePicture },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado para atualizar' });
    }

    return res.status(200).json({ message: 'Perfil atualizado com sucesso!', user: updatedUser });
  } catch (error) {
    next(error);
  }
});

// Rota para criar um novo serviço
app.post('/api/servicos', authenticateToken, async (req, res, next) => {
  try {
    console.log('Dados recebidos:', req.body); // Log para verificar os dados recebidos

    const {
      dataServico, horaServico, status, autorServico, nomeCliente, telefoneContato,
      marcaAparelho, modeloAparelho, corAparelho, problemaCliente, solucaoInicial, valorTotal, observacoes
    } = req.body;

    if (!dataServico || !horaServico || !status || !autorServico || !nomeCliente || !telefoneContato ||
        !marcaAparelho || !modeloAparelho || !corAparelho || !problemaCliente || !solucaoInicial || valorTotal === null) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    const novoServico = new Servico({
      numero: new Date().getTime().toString(),
      data: dataServico,
      status: status,
      cliente: nomeCliente,
      descricao: problemaCliente,
      responsavel: autorServico,
      observacoes: observacoes,
      autorServico: autorServico,
      nomeCompletoCliente: nomeCliente,
      codigoPostalCliente: '',
      contatoCliente: telefoneContato,
      modeloAparelho: modeloAparelho,
      marcaAparelho: marcaAparelho,
      corAparelho: corAparelho,
      problemaRelatado: problemaCliente,
      solucaoInicial: solucaoInicial,
      valorTotal: valorTotal,
    });

    console.log('Serviço a ser salvo:', novoServico); // Log para verificar o serviço antes de salvar

    await novoServico.save();

    return res.status(201).json({ message: 'Serviço criado com sucesso!', servico: novoServico });
  } catch (error) {
    console.error('Erro ao criar serviço:', error); // Log detalhado do erro
    next(error);
  }
});

// Rota para listar todos os serviços
app.get('/api/servicos', authenticateToken, async (req, res, next) => {
  try {
    const servicos = await Servico.find(); // Busca todos os serviços no banco de dados
    return res.status(200).json(servicos); // Retorna a lista de serviços
  } catch (error) {
    next(error);
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});