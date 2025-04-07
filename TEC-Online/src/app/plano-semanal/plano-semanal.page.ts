import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  filteredServices: any[] = [];
  utilizadorName: string = 'Utilizador';
  searchQuery: string = '';
  selectedDays: string = '0'; // Alterado para string para corresponder aos values do HTML

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.atualizarNomeUtilizador();
    this.carregarServicos();
    
    // Carrega a seleção de dias salva ou usa '0' como padrão
    const savedDays = localStorage.getItem('selectedDays');
    this.selectedDays = savedDays || '0';
  }

  atualizarNomeUtilizador() {
    const storedUsername = localStorage.getItem('username');
    this.utilizadorName = storedUsername || 'Utilizador';
  }

  carregarServicos() {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.get<any[]>('http://localhost:3000/api/servicos', { headers }).subscribe({
      next: (data) => {
        this.servicos = data.map(servico => ({
          nomeCliente: servico.cliente || 'Cliente não informado',
          dataServico: servico.data || null,
          problemaCliente: servico.descricao || 'Problema não descrito',
          horaServico: servico.horaServico || 'Horário não definido',
          status: servico.status || '',
          autorServico: servico.autorServico || '',
          observacoes: servico.observacoes || '',
          modeloAparelho: servico.modeloAparelho || '',
          marcaAparelho: servico.marcaAparelho || '',
        }));

        // Ordena por data
        this.servicos.sort((a, b) => {
          const dateA = a.dataServico ? new Date(a.dataServico).getTime() : 0;
          const dateB = b.dataServico ? new Date(b.dataServico).getTime() : 0;
          return dateA - dateB;
        });

        // Inicialmente mostra todos os serviços
        this.filteredServices = [...this.servicos];
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

  filterByDays() {
    // Salva a seleção
    localStorage.setItem('selectedDays', this.selectedDays);
    
    // Aplica o filtro
    this.applyFilters();
  }

  filterServices() {
    // Aplica o filtro quando o texto de pesquisa muda
    this.applyFilters();
  }

  private applyFilters() {
    const days = parseInt(this.selectedDays);
    const searchText = this.searchQuery.toLowerCase();
    
    // Filtra primeiro por texto se houver
    let filtered = this.servicos;
    
    if (searchText) {
      filtered = filtered.filter(servico =>
        (servico.nomeCliente?.toLowerCase().includes(searchText) ||
         servico.problemaCliente?.toLowerCase().includes(searchText))
      );
    }
    
    // Depois filtra por dias se não for "0"
    if (days !== 0) {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Considera apenas a data, sem hora
      
      filtered = filtered.filter(servico => {
        if (!servico.dataServico) return false;
        
        try {
          const serviceDate = new Date(servico.dataServico);
          serviceDate.setHours(0, 0, 0, 0);
          
          const diffTime = serviceDate.getTime() - now.getTime();
          const diffDays = diffTime / (1000 * 3600 * 24);
          
          return diffDays >= 0 && diffDays <= days;
        } catch {
          return false;
        }
      });
    }
    
    this.filteredServices = filtered;
  }

  openModal(event: any) {
    const selectedDate = new Date(event.detail.value).toDateString();

    const servicoEncontrado = this.servicos.find(servico => {
      if (!servico.dataServico) return false;
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
}