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
async atualizarServico() {
  try {
    // Validações iniciais
    if (!this.isFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    // Validação do formato da hora
    if (!/^\d{2}:\d{2}$/.test(this.horaServico)) {
      alert('Formato de hora inválido. Use HH:mm (ex: 14:30)');
      return;
    }

    // Validação do valor total
    if (this.valorTotal === null || this.valorTotal < 0) {
      alert('O valor total deve ser um número positivo.');
      return;
    }

    // Preparação do FormData
    const formData = new FormData();
    formData.append('dataServico', this.dataServico);
    formData.append('horaServico', this.horaServico);
    formData.append('status', this.status);
    formData.append('nomeCliente', this.nomeCliente);
    formData.append('telefoneContato', this.contatoCliente);
    formData.append('modeloAparelho', this.modeloAparelho);
    formData.append('marcaAparelho', this.marcaAparelho);
    formData.append('problemaCliente', this.problemaCliente);
    formData.append('solucaoInicial', this.solucaoInicial);
    formData.append('valorTotal', this.valorTotal.toString());
    formData.append('observacoes', this.observacoes || 'Sem observações');
    formData.append('autorServico', this.autorServico);

    // Processamento das imagens (se houver)
    if (this.imagens && this.imagens.length > 0) {
      for (let i = 0; i < this.imagens.length; i++) {
        const base64Data = this.imagens[i];
        
        // Verifica se já é uma URL (imagem existente) ou base64 (nova imagem)
        if (base64Data.startsWith('http')) {
          // Se for uma URL, assumimos que é uma imagem já existente no servidor
          formData.append('imagensExistentes', base64Data);
        } else {
          // Se for base64, converte para blob
          try {
            const blob = await this.base64ToBlob(base64Data);
            formData.append('imagens', blob, `imagem_${Date.now()}_${i}.jpg`);
          } catch (e) {
            console.error('Erro ao processar imagem:', e);
            alert('Erro ao processar uma das imagens. Por favor, tente novamente.');
            return;
          }
        }
      }
    }

    // Obter token e configurar headers
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sessão expirada. Por favor, faça login novamente.');
      this.navController.navigateRoot('/login');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      // Não definir Content-Type - o browser vai definir automaticamente com o boundary
    });

    // Enviar requisição
    this.http.put(`${environment.api_url}/api/servicos/${this.id}`, formData, { headers })
      .subscribe({
        next: () => {
          alert('Serviço atualizado com sucesso!');
          this.fecharEAtualizar();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro completo:', error);
          
          let errorMessage = 'Erro ao atualizar serviço';
          
          if (error.status === 401) {
            errorMessage = 'Sessão expirada. Faça login novamente.';
            this.navController.navigateRoot('/login');
          } else if (error.status === 404) {
            errorMessage = 'Serviço não encontrado.';
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.statusText) {
            errorMessage += `: ${error.statusText}`;
          }

          alert(errorMessage);
        }
      });

  } catch (error) {
    console.error('Erro inesperado:', error);
    alert('Ocorreu um erro inesperado. Por favor, tente novamente.');
  }
}

// Método auxiliar para converter base64 para Blob
private async base64ToBlob(base64Data: string): Promise<Blob> {
  // Extrai o tipo MIME e os dados base64
  const parts = base64Data.split(';base64,');
  const mimeType = parts[0].split(':')[1];
  const byteString = atob(parts[1]);

  // Cria um ArrayBuffer e uma view Uint8Array
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // Cria e retorna o Blob
  return new Blob([ab], { type: mimeType });
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
    return camposPreenchidos && valorValido;
  }

  // Método para abrir galeria e adicionar foto
async adicionarFoto() {
  try {
    const foto = await Camera.getPhoto({
      quality: 80,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos,
    });

    if (foto?.base64String) {
      const base64ComPrefixo = `data:image/jpeg;base64,${foto.base64String}`;
      this.imagens.push(base64ComPrefixo);
    }
  } catch (error) {
    console.error('Erro ao adicionar foto:', error);
  }
}
  // Remove a foto da lista pelo índice
  removerFoto(index: number) {
    this.imagens.splice(index, 1);
  }
}