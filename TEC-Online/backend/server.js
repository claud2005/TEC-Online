const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
dotenv.config();

// Importando o modelo de usuário e serviço
const User = require('./models/User');
const Servico = require('./models/Servicos'); // Importando o modelo de serviço

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
    res.status(500).json({ message: 'Erro interno no servidor', error: error.message });
  }
});

// Rota para criar um novo serviço
app.post('/api/servicos', async (req, res) => {
  try {
    // Aqui estamos verificando se todos os dados obrigatórios foram enviados
    const {
      numero,
      data,
      status,
      cliente,
      descricao,
      responsavel,
      observacoes,
      autorServico,
      nomeCompletoCliente,
      codigoPostalCliente,
      contatoCliente,
      modeloAparelho,
      marcaAparelho,
      corAparelho,
      problemaRelatado,
      solucaoInicial,
      valorTotal
    } = req.body;

    if (!numero || !data || !status || !cliente || !descricao || !responsavel || !autorServico || !nomeCompletoCliente || !codigoPostalCliente || !contatoCliente || !modeloAparelho || !marcaAparelho || !corAparelho || !problemaRelatado || !solucaoInicial || !valorTotal) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    const newServico = new Servico(req.body);

    await newServico.save();
    return res.status(201).json({ message: 'Serviço criado com sucesso!', servico: newServico });
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ message: 'Erro ao criar serviço', error: error.message });
  }
});

// Rota para obter todos os serviços
app.get('/api/servicos', async (req, res) => {
  try {
    const servicos = await Servico.find();
    return res.status(200).json(servicos);
  } catch (error) {
    console.error('Erro ao obter serviços:', error);
    res.status(500).json({ message: 'Erro ao obter serviços', error: error.message });
  }
});

// Rota para obter um serviço por ID
app.get('/api/servicos/:id', async (req, res) => {
  try {
    const servico = await Servico.findById(req.params.id);
    if (!servico) {
      return res.status(404).json({ message: 'Serviço não encontrado!' });
    }
    return res.status(200).json(servico);
  } catch (error) {
    console.error('Erro ao obter serviço:', error);
    res.status(500).json({ message: 'Erro ao obter serviço', error: error.message });
  }
});

// Rota para atualizar um serviço
app.put('/api/servicos/:id', async (req, res) => {
  try {
    const updatedServico = await Servico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedServico) {
      return res.status(404).json({ message: 'Serviço não encontrado!' });
    }
    return res.status(200).json({ message: 'Serviço atualizado com sucesso!', servico: updatedServico });
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error);
    res.status(500).json({ message: 'Erro ao atualizar serviço', error: error.message });
  }
});

// Rota para excluir um serviço
app.delete('/api/servicos/:id', async (req, res) => {
  try {
    const deletedServico = await Servico.findByIdAndDelete(req.params.id);
    if (!deletedServico) {
      return res.status(404).json({ message: 'Serviço não encontrado!' });
    }
    return res.status(200).json({ message: 'Serviço excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir serviço:', error);
    res.status(500).json({ message: 'Erro ao excluir serviço', error: error.message });
  }
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
