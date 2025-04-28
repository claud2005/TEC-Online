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
const fs = require('fs'); // Importando o fs para verificar e criar a pasta
const crypto = require('crypto');
const nodemailer = require('nodemailer');
dotenv.config();

const User = require('./models/User');
const Servico = require('./models/Servicos'); // Importando o modelo Servico
const Cliente = require('./models/Cliente'); // Importando o modelo do cliente

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexão com o MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/tec-online')
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


function authenticateToken(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // "Bearer token"
  if (!token) {
    return res.status(401).json({ message: 'Acesso não autorizado. Token não fornecido.' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;


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


// REGISTRO

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


//LOGIN


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




//PERFIL


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




//SERVIÇO


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


app.get('/api/servicos/:id', authenticateToken, async (req, res, next) => {
  try {
    const servicos = await Servico.findOne({ _id: req.params.id });
    return res.status(200).json(servicos);
  } catch (error) {
    next(error);
  }
});




//PASS-Word


// Rota para "Esqueceu a senha"
app.post('/api/esqueceu-password', [
  body('email').isEmail().withMessage('E-mail inválido')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    console.log('Processando solicitação de recuperação de senha para e-mail:', email); // Log de depuração

    const user = await User.findOne({ email });

    if (!user) {
      console.log('Usuário não encontrado com o e-mail:', email); // Log de erro
      return res.status(404).json({ message: 'Usuário com este e-mail não foi encontrado.' });
    }

    // Gerar o token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log('Token de redefinição gerado:', resetToken); // Log de token gerado

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora

    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    console.log('Link de redefinição gerado:', resetLink); // Log do link de reset

    // Envio de e-mail
    await transporter.sendMail({
      to: user.email,
      subject: 'Redefinição de Senha - Tec Online',
      html: `
        <h3>Olá, ${user.fullName}</h3>
        <p>Você solicitou a redefinição de sua senha.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Se você não solicitou isso, ignore este e-mail.</p>
      `,
    });

    return res.status(200).json({
      message: 'Link de redefinição de senha enviado por e-mail com sucesso.',
    });
  } catch (error) {
    console.error('Erro ao tentar redefinir senha:', error); // Log de erro detalhado
    res.status(500).json({
      message: 'Ocorreu um erro interno ao processar a solicitação.',
      error: error.message,
    });
  }
});



// Rota para redefinir a senha
app.post('/reset-password', async (req, res, next) => {
  const { token, novaSenha } = req.body;
  try {
    if (!novaSenha || novaSenha.length < 6) {
      return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres.' });
    }

    const user = await User.findOne({ resetPasswordToken: token });

    if (!user || !user.isResetPasswordTokenValid(token)) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    user.password = novaSenha;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    next(error);
  }
});

app.get('/verify-token/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    res.status(200).json({ message: 'Token válido' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao verificar token', error: err });
  }
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Seu e-mail do Gmail
    pass: process.env.EMAIL_PASS   // A senha de aplicativo gerada
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
