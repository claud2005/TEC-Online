const mongoose = require('mongoose');

// Definindo o esquema do serviço
const servicoSchema = new mongoose.Schema({
  numero: { type: String, required: true },
  data: { type: String, required: true },
  status: { type: String, required: true },
  cliente: { type: String, required: true },
  descricao: { type: String, required: true },
  responsavel: { type: String, required: true },
  observacoes: { type: String, required: true },
  autorServico: { type: String, required: true },
  nomeCompletoCliente: { type: String, required: true },
  codigoPostalCliente: { type: String, required: true },
  contatoCliente: { type: String, required: true },
  modeloAparelho: { type: String, required: true },
  marcaAparelho: { type: String, required: true },
  corAparelho: { type: String, required: true },
  problemaRelatado: { type: String, required: true },
  solucaoInicial: { type: String, required: true },
  valorTotal: { type: String, required: true },
});

// Criando o modelo Servico a partir do esquema
const Servico = mongoose.model('Servico', servicoSchema);

module.exports = Servico;
