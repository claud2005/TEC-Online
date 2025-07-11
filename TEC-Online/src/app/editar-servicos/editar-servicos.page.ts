import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController, IonicModule } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
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
  problemaRelatado: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';
  autorServico: string = '';
  imagens: string[] = []; // Pode conter base64 ou URLs
  imagensParaRemover: string[] = []; // ← Novidade
  clienteId: string = ''; // ← IMPORTANTE

  // Propriedades para o modal de imagem
  modalAberto: boolean = false;
  imagemSelecionada: string = '';

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    const rawId = this.route.snapshot.paramMap.get('numero');
    this.id = rawId;

    if (this.id) {
      this.carregarServico();
    }
  }

  // Método para abrir o modal com a imagem selecionada
  abrirModalImagem(img: string) {
    this.imagemSelecionada = img;
    this.modalAberto = true;
  }

  // Método para salvar a imagem no dispositivo
  async salvarImagem() {
    try {
      if (this.imagemSelecionada.startsWith('data:image')) {
        // Para imagens em base64
        const link = document.createElement('a');
        link.href = this.imagemSelecionada;
        link.download = `servico_${new Date().getTime()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Para URLs externas
        const response = await fetch(this.imagemSelecionada);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
      
        const link = document.createElement('a');
        link.href = url;
        link.download = `servico_${new Date().getTime()}.jpg`;
        document.body.appendChild(link);
        link.click();
      
        // Limpeza
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Erro ao salvar imagem:', error);
      // Fallback para abrir em nova aba se o download falhar
      window.open(this.imagemSelecionada, '_blank');
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
        this.problemaRelatado = data.problemaRelatado ?? '';
        this.solucaoInicial = data.solucaoInicial ?? '';
        this.valorTotal = data.valorTotal ?? 0;
        this.observacoes = data.observacoes ?? '';
        this.autorServico = data.autorServico ?? '';
        this.imagens = data.imagens ?? [];
        this.clienteId = data.cliente ?? ''; // ← Captura o ID do cliente
      },
      (error: HttpErrorResponse) => {
        console.error("Erro ao carregar serviço:", error);
        alert("Erro ao carregar o serviço.");
      }
    );
  }

  async atualizarServico() {
    try {
      if (!this.isFormValid()) {
        alert('Preencha todos os campos obrigatórios corretamente.');
        return;
      }

      if (!/^\d{2}:\d{2}$/.test(this.horaServico)) {
        alert('Formato de hora inválido. Use HH:mm.');
        return;
      }

      if (this.valorTotal === null || this.valorTotal < 0) {
        alert('O valor total deve ser um número positivo.');
        return;
      }

      const formData = new FormData();
      formData.append('dataServico', this.dataServico);
      formData.append('horaServico', this.horaServico);
      formData.append('status', this.status);
      formData.append('clienteId', this.clienteId); // ← ESSENCIAL
      formData.append('nomeCliente', this.nomeCliente);
      formData.append('telefoneContato', this.contatoCliente);
      formData.append('modeloAparelho', this.modeloAparelho);
      formData.append('marcaAparelho', this.marcaAparelho);
      formData.append('problemaRelatado', this.problemaRelatado); // corrigido
      formData.append('solucaoInicial', this.solucaoInicial);
      formData.append('valorTotal', this.valorTotal.toString());
      formData.append('observacoes', this.observacoes || 'Sem observações');
      formData.append('autorServico', this.autorServico);

      // Processa imagens (novas ou existentes)
      for (let i = 0; i < this.imagens.length; i++) {
        const imagem = this.imagens[i];

        if (imagem.startsWith('http')) {
          // Imagem já existente (URL do servidor)
          formData.append('imagensExistentes', imagem);
        } else {
          // Nova imagem em base64
          const blob = await this.base64ToBlob(imagem);
          formData.append('imagens', blob, `imagem_${Date.now()}_${i}.jpg`);
        }
      }

      // Adiciona imagens a serem removidas
      this.imagensParaRemover.forEach(url => {
        formData.append('imagensParaRemover', url);
      });

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Sessão expirada. Faça login novamente.');
        this.navController.navigateRoot('/login');
        return;
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.put(`${environment.api_url}/api/servicos/${this.id}`, formData, { headers }).subscribe({
        next: () => {
          alert('Serviço atualizado com sucesso!');
          this.fecharEAtualizar();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao atualizar serviço:', error);
          let msg = 'Erro ao atualizar serviço.';
          if (error.status === 401) {
            msg = 'Sessão expirada. Faça login novamente.';
            this.navController.navigateRoot('/login');
          } else if (error.status === 404) {
            msg = 'Serviço não encontrado.';
          } else if (error.error?.message) {
            msg = error.error.message;
          }
          alert(msg);
        }
      });

    } catch (error) {
      console.error('Erro inesperado:', error);
      alert('Erro inesperado. Tente novamente.');
    }
  }

  fecharEAtualizar() {
    this.navController.back();
  }

  isFormValid(): boolean {
    const obrigatorios = [
      this.dataServico, this.horaServico, this.status, this.nomeCliente,
      this.contatoCliente, this.modeloAparelho, this.marcaAparelho,
      this.problemaRelatado, this.solucaoInicial, this.autorServico
    ];

    return obrigatorios.every(val => val && val.trim() !== '') && this.valorTotal !== null && this.valorTotal >= 0;
  }

  removerFoto(index: number) {
    const imagemRemovida = this.imagens[index];
    if (imagemRemovida.startsWith('http')) {
      this.imagensParaRemover.push(imagemRemovida);
    }
    this.imagens.splice(index, 1);
  }
  
  async adicionarFoto() {
    try {
      const foto = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      if (foto?.base64String) {
        const base64 = `data:image/jpeg;base64,${foto.base64String}`;
        this.imagens.push(base64);
      }
    } catch (error) {
      console.error('Erro ao adicionar foto:', error);
    }
  }

  private async base64ToBlob(base64Data: string): Promise<Blob> {
    const parts = base64Data.split(';base64,');
    const mimeType = parts[0].split(':')[1];
    const byteString = atob(parts[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeType });
  }
}