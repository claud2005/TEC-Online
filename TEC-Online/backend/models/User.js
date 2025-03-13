const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator'); // Para validação de e-mail

// Esquema do Usuário
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Nome completo é obrigatório'], // Mensagem de erro personalizada
    trim: true, // Remove espaços em branco no início e no final
  },
  username: {
    type: String,
    required: [true, 'Nome de usuário é obrigatório'],
    unique: true,
    trim: true,
    minlength: [3, 'Nome de usuário deve ter pelo menos 3 caracteres'],
    maxlength: [20, 'Nome de usuário não pode ter mais de 20 caracteres'],
    match: [/^[a-zA-Z0-9_]+$/, 'Nome de usuário pode conter apenas letras, números e underscores'], // Regex para validar o username
  },
  email: {
    type: String,
    required: [true, 'E-mail é obrigatório'],
    unique: true,
    trim: true,
    lowercase: true, // Converte o e-mail para minúsculas
    validate: [isEmail, 'E-mail inválido'], // Validação de e-mail usando o validator
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
  },
  profilePicture: {
    type: String,
    default: '', // Valor padrão para foto de perfil
  },
  bio: {
    type: String,
    default: '', // Valor padrão para biografia
    maxlength: [150, 'Biografia não pode ter mais de 150 caracteres'],
  },
  createdAt: {
    type: Date,
    default: Date.now, // Data de criação do usuário
  },
});

// Criptografar senha antes de salvar no banco de dados
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Gera um salt
    this.password = await bcrypt.hash(this.password, salt); // Criptografa a senha
    next();
  } catch (err) {
    next(err);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (err) {
    throw new Error('Erro ao comparar senhas');
  }
};

// Método para gerar um token JWT
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { userId: this._id }, // Payload do token
    process.env.JWT_SECRET || 'secret', // Chave secreta
    { expiresIn: '1h' } // Tempo de expiração do token
  );
  return token;
};

// Criar o modelo de Usuário
const User = mongoose.model('User', userSchema);

module.exports = User;