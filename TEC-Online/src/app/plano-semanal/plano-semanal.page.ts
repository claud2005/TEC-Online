import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, IonModal, MenuController } from '@ionic/angular';
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
  filteredServices: any[] = [];
  utilizadorName: string = 'Utilizador';
  searchQuery: string = '';
  selectedDays: number = 7;

  constructor(
    private router: Router,
    private http: HttpClient,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.atualizarNomeUtilizador();
    this.carregarServicos();
  }

  closeMenu() {
    this.menuCtrl.close();
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
          horaServico: servico.horaServico || 'Horário não definido',
          status: servico.status || '',
          autorServico: servico.autorServico || '',
          observacoes: servico.observacoes || '',
          modeloAparelho: servico.modeloAparelho || '',
          marcaAparelho: servico.marcaAparelho || '',
        }));

        this.servicos.sort((a, b) => {
          const dateA = new Date(a.dataServico).getTime();
          const dateB = new Date(b.dataServico).getTime();
          return dateA - dateB;
        });

        this.filteredServices = [...this.servicos];
        this.filterServices();
        this.filterByDays();
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
      return isNaN(date.getTime()) ? 'Data inválida' : date.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  }

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
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

    this.selectedService = servicoEncontrado || {
      nomeCliente: '',
      dataServico: selectedDate,
      horaServico: '',
      marcaAparelho: '',
      modeloAparelho: '',
      problemaCliente: '',
      observacoes: ''
    };

    this.modal.present();
  }

  filterServices() {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredServices = this.servicos.filter(servico =>
      servico.nomeCliente?.toLowerCase().includes(query)
    );
    this.filterByDays();
  }

  filterByDays() {
    if (this.selectedDays === 0) {
      this.filteredServices = [...this.servicos];
    } else {
      const now = new Date();
      this.filteredServices = this.filteredServices.filter(servico => {
        const dataServico = new Date(servico.dataServico);
        const diffDays = (dataServico.getTime() - now.getTime()) / (1000 * 3600 * 24);
        return diffDays <= this.selectedDays;
      });
    }
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
