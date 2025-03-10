import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-editar-servicos',
  standalone: true,
  templateUrl: './editar-servicos.page.html',
  styleUrls: ['./editar-servicos.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class EditarServicosPage {
  id: string | null = null;
  dataAbertura: string = '';
  dataEntrega: string = '';
  status: string = 'aberto'; // Valor padrão "Aberto"
  nomeCliente: string = '';
  telefoneContato: string = '';
  cpfCliente: string = '';
  modeloAparelho: string = '';
  marcaAparelho: string = '';
  corAparelho: string = '';
  problemaCliente: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  valorEntrada: number | null = null;
  observacoes: string = '';
  autorServico: string = '';
  imagens: string[] = [];

  constructor(
    private http: HttpClient,
    private navController: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.carregarServico();
    }
  }

  carregarServico() {
    this.http.get(`http://localhost:3000/api/servicos/${this.id}`).subscribe(
      (data: any) => {
        this.dataAbertura = data.dataAbertura;
        this.dataEntrega = data.dataEntrega;
        this.status = data.status;
        this.nomeCliente = data.nomeCliente;
        this.telefoneContato = data.telefoneContato;
        this.cpfCliente = data.cpfCliente;
        this.modeloAparelho = data.modeloAparelho;
        this.marcaAparelho = data.marcaAparelho;
        this.corAparelho = data.corAparelho;
        this.problemaCliente = data.problemaCliente;
        this.solucaoInicial = data.solucaoInicial;
        this.valorTotal = data.valorTotal;
        this.valorEntrada = data.valorEntrada;
        this.observacoes = data.observacoes;
        this.autorServico = data.autorServico;
        this.imagens = data.imagens || [];
      },
      (error) => {
        console.error('Erro ao carregar serviço:', error);
        alert('Erro ao carregar serviço.');
      }
    );
  }

  async adicionarFoto() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const base64 = await this.convertToBase64(file);
        this.imagens.push(base64);
      }
    };
  }

  async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  removerFoto(index: number) {
    this.imagens.splice(index, 1);
  }

  validarTelefone(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    input.value = valor.slice(0, 9); // Limita a 9 dígitos
    this.telefoneContato = input.value;
  }

  atualizarServico() {
    if (!this.isFormValid()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    const servicoAtualizado = {
      dataAbertura: this.dataAbertura,
      dataEntrega: this.dataEntrega,
      status: this.status,
      nomeCliente: this.nomeCliente,
      telefoneContato: this.telefoneContato,
      cpfCliente: this.cpfCliente,
      modeloAparelho: this.modeloAparelho,
      marcaAparelho: this.marcaAparelho,
      corAparelho: this.corAparelho,
      problemaCliente: this.problemaCliente,
      solucaoInicial: this.solucaoInicial,
      valorTotal: this.valorTotal ?? 0,
      valorEntrada: this.valorEntrada ?? 0,
      observacoes: this.observacoes.trim() || 'Sem observações',
      autorServico: this.autorServico,
      imagens: this.imagens,
    };

    this.http.put(`http://localhost:3000/api/servicos/${this.id}`, servicoAtualizado).subscribe(
      () => {
        alert('Serviço atualizado com sucesso!');
        this.fecharEAtualizar();
      },
      (error) => {
        console.error('Erro ao atualizar serviço:', error);
        alert('Erro ao atualizar serviço.');
      }
    );
  }

  fecharEAtualizar() {
    this.navController.back();
  }

  isFormValid(): boolean {
    const camposObrigatorios = [
      { nome: 'dataAbertura', valor: this.dataAbertura },
      { nome: 'dataEntrega', valor: this.dataEntrega },
      { nome: 'status', valor: this.status },
      { nome: 'nomeCliente', valor: this.nomeCliente },
      { nome: 'telefoneContato', valor: this.telefoneContato },
      { nome: 'cpfCliente', valor: this.cpfCliente },
      { nome: 'modeloAparelho', valor: this.modeloAparelho },
      { nome: 'marcaAparelho', valor: this.marcaAparelho },
      { nome: 'corAparelho', valor: this.corAparelho },
      { nome: 'problemaCliente', valor: this.problemaCliente },
      { nome: 'solucaoInicial', valor: this.solucaoInicial },
      { nome: 'autorServico', valor: this.autorServico },
    ];

    // Verifica se todos os campos obrigatórios estão preenchidos
    const camposPreenchidos = camposObrigatorios.every((campo) => {
      const valido = campo.valor && campo.valor.trim() !== '';
      if (!valido) {
        console.log(`Campo obrigatório não preenchido: ${campo.nome}`);
      }
      return valido;
    });

    // Verifica se os campos numéricos são válidos
    const valoresValidos = this.valorTotal !== null && this.valorTotal >= 0 &&
                          this.valorEntrada !== null && this.valorEntrada >= 0;

    if (!valoresValidos) {
      console.log('Valores inválidos:', { valorTotal: this.valorTotal, valorEntrada: this.valorEntrada });
    }

    return camposPreenchidos && valoresValidos;
  }
}