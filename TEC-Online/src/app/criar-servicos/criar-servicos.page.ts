import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-criar-servicos',
  standalone: true,
  templateUrl: './criar-servicos.page.html',
  styleUrls: ['./criar-servicos.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonSelect,
    IonSelectOption,
  ],
})
export class CriarServicosPage implements OnInit {
  dataServico: string = '';
  horaServico: string = '';
  status: string = 'aberto';
  autorServico: string = '';
  clienteSelecionado: string = ''; // Alterado para string vazia como padrão
  marcaAparelho: string = '';
  modeloAparelho: string = '';
  problemaCliente: string = '';
  solucaoInicial: string = '';
  valorTotal: number | null = null;
  observacoes: string = '';

  clientes: any[] = [];

  constructor(
    private http: HttpClient,
    private navController: NavController,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarDadosIniciais();
    this.carregarClientes();
  }

  carregarDadosIniciais() {
    const hoje = new Date();
    this.dataServico = hoje.toISOString().split('T')[0];
    this.horaServico = this.formatarHora(hoje);
    this.autorServico = localStorage.getItem('username') || 'Técnico';
  }

  formatarHora(data: Date): string {
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    return `${horas}:${minutos}`;
  }

  carregarClientes() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado');
      this.clientes = [];
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>(`${environment.api_url}/api/clientes/`, { headers }).subscribe({
      next: (response) => {
        console.log('Resposta COMPLETA da API:', JSON.parse(JSON.stringify(response)));
        
        // Mapeamento ultra-robusto
        this.clientes = response.map(cliente => {
          // Extrai ID de todas as formas possíveis
          const id = cliente?._id || cliente?.id || cliente?.clienteId || cliente?.codigo;
          
          if (!id) {
            console.error('Cliente sem ID válido:', cliente);
            return null;
          }

          return {
            id: id.toString(), // Garante que é string
            nome: cliente?.nome || 'Cliente sem nome',
            // Mantém referência ao objeto original para debug
            _original: cliente
          };
        }).filter(cliente => cliente !== null);

        console.log('Clientes processados:', this.clientes);

        if (this.clientes.length === 0) {
          console.warn('Nenhum cliente válido foi carregado');
        }
      },
      error: (error) => {
        console.error('Erro completo ao carregar clientes:', error);
        alert('Erro ao carregar clientes. Verifique o console.');
        this.clientes = [];
      }
    });
  }

  compareWithClientes(o1: any, o2: any) {
    if (!o1 || !o2) return false;
    
    // Converte ambos para strings para comparação
    const id1 = typeof o1 === 'object' ? o1.id?.toString() : o1?.toString();
    const id2 = typeof o2 === 'object' ? o2.id?.toString() : o2?.toString();
    
    return id1 === id2;
  }

  async salvarServico() {
    console.log('Tentando salvar com cliente selecionado:', this.clienteSelecionado);
    console.log('Lista completa de clientes:', this.clientes);

    if (!this.isFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    const cliente = this.clientes.find(c => c.id === this.clienteSelecionado.toString());
    
    if (!cliente) {
      alert(`Cliente selecionado não encontrado. ID procurado: ${this.clienteSelecionado}`);
      console.error('Cliente não encontrado. Dados completos:', {
        clienteSelecionado: this.clienteSelecionado,
        clientesDisponiveis: this.clientes
      });
      return;
    }

    const dadosServico = {
      data_servico: this.dataServico,
      hora_servico: this.horaServico,
      status: this.status,
      autor_servico: this.autorServico,
      cliente_id: cliente.id,
      nome_cliente: cliente.nome,
      marca_aparelho: this.marcaAparelho,
      modelo_aparelho: this.modeloAparelho,
      problema_cliente: this.problemaCliente,
      solucao_inicial: this.solucaoInicial,
      valor_total: this.valorTotal || 0,
      observacoes: this.observacoes || 'Sem observações'
    };

    console.log('Dados do serviço a enviar:', dadosServico);

    try {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      const response = await this.http.post(
        `${environment.api_url}/api/servicos/`,
        dadosServico,
        { headers }
      ).toPromise();

      console.log('Resposta completa da API:', response);
      alert('Serviço criado com sucesso!');
      this.router.navigate(['/orcamentos-clientes', cliente.id]);
    } catch (error) {
      console.error('Erro completo ao criar serviço:', error);
      alert('Erro ao criar serviço. Verifique o console para detalhes.');
    }
  }

  isFormValid(): boolean {
    return !!(
      this.dataServico &&
      this.horaServico &&
      this.status &&
      this.autorServico &&
      this.clienteSelecionado &&
      this.marcaAparelho &&
      this.modeloAparelho &&
      this.problemaCliente
    );
  }

  goBack() {
    this.navController.back();
  }
}