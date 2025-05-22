import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-plano-semanal',
  templateUrl: './plano-semanal.page.html',
  styleUrls: ['./plano-semanal.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
})
export class PlanoSemanalPage implements OnInit {
  @ViewChild(IonModal) modal!: IonModal;
  selectedService: any = null;
  servicos: any[] = [];
  filteredServices: any[] = []; // Lista de serviços filtrados
  utilizadorName: string = 'Utilizador';
  searchQuery: string = ''; // Variável para armazenar a pesquisa
  selectedDays: number = 7; // Valor padrão para os próximos 7 dias

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.atualizarNomeUtilizador();
    this.carregarServicos();
  }

  atualizarNomeUtilizador() {
    const storedUsername = localStorage.getItem('username');
    this.utilizadorName = storedUsername || 'Utilizador';
  }

  carregarServicos() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>(`${environment.api_url}/api/servicos`, { headers }).subscribe({
      next: (data) => {
        this.servicos = data.map(servico => ({
          nomeCliente: servico.cliente || 'Cliente não informado',
          dataServico: servico.data || 'Data não agendada',
          problemaCliente: servico.descricao || 'Problema não descrito',
          horaServico: servico.horaServico ? servico.horaServico : 'Horário não definido',
          status: servico.status || '',
          autorServico: servico.autorServico || '',
          observacoes: servico.observacoes || '',
          modeloAparelho: servico.modeloAparelho || '',
          marcaAparelho: servico.marcaAparelho || '',
        }));

        this.servicos.sort((a, b) => {
          const dateA = a.dataServico ? new Date(a.dataServico).getTime() : 0;
          const dateB = b.dataServico ? new Date(b.dataServico).getTime() : 0;
          return dateA - dateB;
        });

        // Inicialmente, exibe todos os serviços
        this.filteredServices = [...this.servicos];

        this.filterServices(); // Aplica filtro de pesquisa
        this.filterByDays(); // Aplica filtro de dias (com todos os serviços inicialmente)
      },
      error: (error) => {
        console.error('Erro ao carregar serviços:', error);
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Data não informada';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Data inválida';
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      console.error('Erro ao formatar data:', e);
      return 'Data inválida';
    }
  }

  getStatusColor(status: string): string {
    if (!status) return 'medium';
    switch (status.toLowerCase()) {
      case 'aberto': return 'warning';
      case 'em andamento': return 'primary';
      case 'concluído': return 'success';
      case 'cancelado': return 'danger';
      default: return 'medium';
    }
  }

  openModal(event: any) {
    const selectedDate = new Date(event.detail.value).toDateString();

    const servicoEncontrado = this.servicos.find(servico => {
      const dataServico = new Date(servico.dataServico).toDateString();
      return dataServico === selectedDate;
    });

    if (servicoEncontrado) {
      this.selectedService = servicoEncontrado;
    } else {
      this.selectedService = {
        nomeCliente: '',
        dataServico: selectedDate,
        horaServico: '',
        marcaAparelho: '',
        modeloAparelho: '',
        problemaCliente: '',
        observacoes: ''
      };
    }

    this.modal.present();
  }

  filterServices() {
    // Filtra os serviços baseados no nome do cliente
    this.filteredServices = this.servicos.filter(servico => {
      // Verifica se o nome do cliente existe e é uma string válida
      const nomeCliente = servico.nomeCliente ? servico.nomeCliente.trim().toLowerCase() : '';
      const query = this.searchQuery.trim().toLowerCase();
  
      return nomeCliente.includes(query);
    });
  
    // Aplica o filtro de dias após a pesquisa
    this.filterByDays();
  }
  
  filterByDays() {
    if (this.selectedDays === 0) {
      this.filteredServices = [...this.servicos]; // Exibe todos os serviços
    } else {
      const now = new Date();
      const filteredByDate = this.filteredServices.filter(servico => {
        const dataServico = new Date(servico.dataServico);
        const diffTime = dataServico.getTime() - now.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24); // Diferença em dias
        return diffDays <= this.selectedDays;
      });
      this.filteredServices = filteredByDate;
    }
  }
  

  openServiceDetails(servico: any) {
    this.selectedService = servico;
    this.modal.present(); // Agora abre o modal quando clica em uma tarefa
  }

  closeModal() {
    this.modal.dismiss();
    this.selectedService = null;
  }

  navigateToOtherPage() {
    this.modal.dismiss();
    this.router.navigate(['/criar-servicos']);
  }

  navigateToPerfil() {
    this.router.navigate(['/perfil']);
  }

  navigateToServicos() {
    this.router.navigate(['/servicos']);
  }

  navigateToClientes() {
    this.router.navigate(['/gestor-clientes']);
  }  

}
