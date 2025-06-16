import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonicModule } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// Import Capacitor Camera para abrir galeria do dispositivo
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  dataServico: string = '';
  horaServico: string = '';
  status: string = 'aberto';
  nomeCliente: string = '';
  contatoCliente: string = '';
  modeloAparelho: string = '';
  marcaAparelho: string = '';
  problemaCliente: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';
  autorServico: string = '';
  imagens: string[] = []; // Array das imagens em base64 com prefixo data:image/jpeg;base64,

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const rawId = this.route.snapshot.paramMap.get('numero');
    this.id = rawId;

    console.log("ID capturado da URL:", rawId);
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

        this.dataServico = data.dataServico ?? '';
        this.horaServico = data.horaServico ?? '';
        this.status = data.status ?? 'aberto';
        this.nomeCliente = data.nomeCompletoCliente ?? '';
        this.contatoCliente = data.contatoCliente ?? '';
        this.modeloAparelho = data.modeloAparelho ?? '';
        this.marcaAparelho = data.marcaAparelho ?? '';
        this.problemaCliente = data.problemaRelatado ?? '';
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

  atualizarServico() {
    if (!this.isFormValid()) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(this.horaServico)) {
      alert('Hora inválida. Use o formato HH:mm');
      return;
    }

    const formData = new FormData();
    formData.append('dataServico', this.dataServico);
    formData.append('horaServico', this.horaServico);
    formData.append('status', this.status);
    formData.append('nomeCliente', this.nomeCliente);
    formData.append('contatoCliente', this.contatoCliente);
    formData.append('modeloAparelho', this.modeloAparelho);
    formData.append('marcaAparelho', this.marcaAparelho);
    formData.append('problemaCliente', this.problemaCliente);
    formData.append('solucaoInicial', this.solucaoInicial);
    formData.append('valorTotal', this.valorTotal?.toString() ?? '0');
    formData.append('observacoes', this.observacoes.trim() || 'Sem observações');
    formData.append('autorServico', this.autorServico);

    // Adiciona as imagens no formulário para envio
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
      { nome: 'dataServico', valor: this.dataServico },
      { nome: 'horaServico', valor: this.horaServico },
      { nome: 'status', valor: this.status },
      { nome: 'nomeCliente', valor: this.nomeCliente },
      { nome: 'contatoCliente', valor: this.contatoCliente },
      { nome: 'modeloAparelho', valor: this.modeloAparelho },
      { nome: 'marcaAparelho', valor: this.marcaAparelho },
      { nome: 'problemaCliente', valor: this.problemaCliente },
      { nome: 'solucaoInicial', valor: this.solucaoInicial },
      { nome: 'autorServico', valor: this.autorServico },
    ];

    const camposPreenchidos = camposObrigatorios.every((campo) => {
      const valido = campo.valor && campo.valor.trim() !== '';
      if (!valido) {
        console.log(`Campo obrigatório não preenchido: ${campo.nome}`);
      }
      return valido;
    });

    const valorValido = this.valorTotal !== null && this.valorTotal >= 0;
    if (!valorValido) {
      console.log('Valor inválido:', { valorTotal: this.valorTotal });
    }

    // NÃO torna obrigatório ter fotos:
    // Não checamos se this.imagens está vazio

    return camposPreenchidos && valorValido;
  }

  // Método para abrir galeria e adicionar foto
  async adicionarFoto() {
    try {
      const foto = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos, // galeria do dispositivo
      });

    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
    }
  }

  // Remove a foto da lista pelo índice
  removerFoto(index: number) {
    this.imagens.splice(index, 1);
  }
}
