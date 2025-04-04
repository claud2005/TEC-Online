const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator'); // Para validação de dados
const multer = require('multer'); // Importando o multer para manipulação de arquivos
const path = require('path');
dotenv.config();

const User = require('./models/User');
const Servico = require('./models/Servicos'); // Importando o modelo Servico

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Configuração do multer para armazenamento de imagem
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Diretório para armazenar as imagens
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Definir um nome único para o arquivo
  },
});

const upload = multer({ storage });

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

    console.log(`🔍 Buscando perfil do usuário ID: ${userId}`); // Usando o emoji corretamente

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

// Rota para atualizar o perfil do usuário autenticado
app.put('/api/profile', authenticateToken, upload.single('profilePicture'), async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'ID do usuário não encontrado no token' });
    }

    // Dados para atualizar
    const { fullName, username } = req.body;
    console.log('Dados recebidos:', { fullName, username, profilePicture: req.file?.filename });  // Log para depuração

    if (!fullName || !username) {
      return res.status(400).json({ message: 'Nome completo e nome de usuário são obrigatórios' });
    }

    // Preparar o caminho da imagem
    let profilePicture = '';
    if (req.file) {
      profilePicture = `uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, username, profilePicture },
      { new: true }
    ).select('fullName username profilePicture');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    console.log('Usuário atualizado:', updatedUser);  // Verifica os dados atualizados
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    next(error);
  }
});

// Rota para criar um novo serviço
app.post('/api/servicos', authenticateToken, async (req, res, next) => {
  try {
    console.log('Dados recebidos:', req.body); // Log para verificar os dados recebidos

    const {
      dataServico, horaServico, status, autorServico, nomeCliente, telefoneContato,
      marcaAparelho, modeloAparelho, problemaCliente, solucaoInicial, valorTotal, observacoes
    } = req.body;

    if (!dataServico || !horaServico || !status || !autorServico || !nomeCliente || !telefoneContato ||
        !marcaAparelho || !modeloAparelho || !problemaCliente || !solucaoInicial || valorTotal === null) {
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
      contatoCliente: telefoneContato,
      modeloAparelho: modeloAparelho,
      marcaAparelho: marcaAparelho,
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
    const servicos = await Servico.find();
    return res.status(200).json(servicos);
  } catch (error) {
    next(error);
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
