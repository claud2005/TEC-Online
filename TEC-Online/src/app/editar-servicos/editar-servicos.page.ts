import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonicModule } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
export class EditarServicosPage implements OnInit {
  id: string | null = null;

  // Campos do formulário
  dataServico: string = '';
  horaServico: string = '';
  status: string = 'aberto';
  nomeCliente: string = '';
  telefoneContato: string = '';
  modeloAparelho: string = '';
  marcaAparelho: string = '';
  problemaCliente: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';
  autorServico: string = '';
  imagens: string[] = [];

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('numero'); // ou 'id', conforme sua rota
    console.log("ID capturado da URL:", this.id);
    if (this.id) {
      this.carregarServico();
    }
  }

  carregarServico() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(`${environment.api_url}/api/servicos/${this.id}`, { headers }).subscribe(
      (data: any) => {
        if (!data) {
          alert("Serviço não encontrado.");
          return;
        }

        // Preenchendo os campos
        this.dataServico = data.data ?? '';
        this.horaServico = data.horaServico ?? '';
        this.status = data.status ?? 'aberto';
        this.nomeCliente = data.nomeCompletoCliente ?? '';
        this.telefoneContato = data.telefoneContato ?? '';
        this.modeloAparelho = data.modeloAparelho ?? '';
        this.marcaAparelho = data.marcaAparelho ?? '';
        this.problemaCliente = data.problemaCliente ?? '';
        this.solucaoInicial = data.solucaoInicial ?? '';
        this.valorTotal = data.valorTotal ?? 0;
        this.observacoes = data.observacoes ?? '';
        this.autorServico = data.autorServico ?? '';
        this.imagens = data.imagens ?? [];
      },
      (error: HttpErrorResponse) => {
        console.error("Erro ao carregar serviço:", error);
        alert("Erro ao carregar o serviço.");
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
        if (!file.type.startsWith('image/')) {
          alert('Por favor, selecione uma imagem válida.');
          return;
        }

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
    const valor = input.value.replace(/\D/g, '');
    input.value = valor.slice(0, 11); // até 11 dígitos
    this.telefoneContato = input.value;
  }

  atualizarServico() {
    if (!this.isFormValid()) {
      alert('Preencha todos os campos obrigatórios e adicione ao menos uma imagem.');
      return;
    }

    const formData = new FormData();
    formData.append('dataServico', this.dataServico);
    formData.append('horaServico', this.horaServico);
    formData.append('status', this.status);
    formData.append('nomeCliente', this.nomeCliente);
    formData.append('telefoneContato', this.telefoneContato);
    formData.append('modeloAparelho', this.modeloAparelho);
    formData.append('marcaAparelho', this.marcaAparelho);
    formData.append('problemaCliente', this.problemaCliente);
    formData.append('solucaoInicial', this.solucaoInicial);
    formData.append('valorTotal', this.valorTotal?.toString() ?? '0');
    formData.append('observacoes', this.observacoes.trim() || 'Sem observações');
    formData.append('autorServico', this.autorServico);

    this.imagens.forEach((base64) => {
      formData.append('imagens', base64);
    });

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.put(`${environment.api_url}/api/servicos/${this.id}`, formData, { headers }).subscribe(
      () => {
        alert('Serviço atualizado com sucesso!');
        this.fecharEAtualizar();
      },
      (error: HttpErrorResponse) => {
        console.error('Erro ao atualizar o serviço:', error);
        alert('Erro ao atualizar o serviço.');
      }
    );
  }

  fecharEAtualizar() {
    this.navController.back();
  }

  isFormValid(): boolean {
    const camposObrigatorios = [
      this.dataServico,
      this.horaServico,
      this.status,
      this.nomeCliente,
      this.telefoneContato,
      this.modeloAparelho,
      this.marcaAparelho,
      this.problemaCliente,
      this.solucaoInicial,
      this.autorServico
    ];

    const todosPreenchidos = camposObrigatorios.every(c => c && c.trim() !== '');
    const valorValido = this.valorTotal !== null && this.valorTotal >= 0;
    const temImagem = this.imagens.length > 0;

    return todosPreenchidos && valorValido && temImagem;
  }
}
