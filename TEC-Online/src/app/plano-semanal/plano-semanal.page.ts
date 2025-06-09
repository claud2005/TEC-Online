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
  selectedDays: number | null = -1;

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
        this.servicos = data.map(servico => {
          let statusAtual = servico.status?.toLowerCase() || '';

          if (statusAtual === 'concluído') {
            statusAtual = 'fechado';
          }

          return {
            id: servico._id,
            nomeCliente: servico.cliente || 'Cliente não informado',
            dataServico: servico.data || 'Data não agendada',
            problemaCliente: servico.descricao || 'Problema não descrito',
            horaServico: servico.horaServico || 'Horário não definido',
            status: statusAtual,
            autorServico: servico.autorServico || '',
            observacoes: servico.observacoes || '',
            modeloAparelho: servico.modeloAparelho || '',
            marcaAparelho: servico.marcaAparelho || '',
          };
        });

        this.servicos.sort((a, b) => {
          const dateA = new Date(a.dataServico).getTime();
          const dateB = new Date(b.dataServico).getTime();
          return dateA - dateB;
        });

        this.aplicarFiltros();
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
      case 'fechado': return 'medium';
      default: return 'medium';
    }
  }

  openModal(event: any) {
    const selectedDate = new Date(event.detail.value).toDateString();

    const servicoEncontrado = this.servicos.find(servico => {
      const dataServico = new Date(servico.dataServico).toDateString();
      return dataServico === selectedDate;
    });

    this.selectedService = servicoEncontrado ? { ...servicoEncontrado } : {
      id: null,
      nomeCliente: '',
      dataServico: selectedDate,
      horaServico: '',
      marcaAparelho: '',
      modeloAparelho: '',
      problemaCliente: '',
      observacoes: '',
      status: 'fechado'
    };

    this.modal.present();
  }

  aplicarFiltros() {
    const query = this.searchQuery.trim().toLowerCase();

    let tempFiltered = this.servicos.filter(servico =>
      servico.nomeCliente?.toLowerCase().includes(query) ||
      servico.marcaAparelho?.toLowerCase().includes(query) ||
      servico.modeloAparelho?.toLowerCase().includes(query) ||
      servico.problemaCliente?.toLowerCase().includes(query)
    );

    this.filteredServices = this.filtrarPorHistorico(tempFiltered, this.selectedDays);
  }

  filtrarPorHistorico(services: any[], dias: number | null): any[] {
    if (dias === null || dias === undefined || dias === -1) {
      return services;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dias === 0) {
      return services.filter(servico => {
        const dataServico = new Date(servico.dataServico);
        dataServico.setHours(0, 0, 0, 0);
        return dataServico.getTime() === hoje.getTime();
      });
    } else {
      return services.filter(servico => {
        const dataServico = new Date(servico.dataServico);
        dataServico.setHours(0, 0, 0, 0);
        const diffDias = (hoje.getTime() - dataServico.getTime()) / (1000 * 60 * 60 * 24);
        return diffDias >= 0 && diffDias <= dias;
      });
    }
  }

  onSearchChange() {
    this.aplicarFiltros();
  }

  onSelectedDaysChange() {
    this.aplicarFiltros();
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

  navigateToCriarServicos() {
    this.router.navigate(['/criar-servicos']);
  }

  editarServico(id: string) {
    if (id) {
      this.modal.dismiss();
      this.router.navigate(['/editar-servicos', id]);
    } else {
      alert('Serviço não possui ID para edição.');
    }
  }

  alterarStatus(servico: any) {
  servico.status = servico.status === 'aberto' ? 'fechado' : 'aberto';
  console.log(`Status do serviço ${servico.id} alterado para: ${servico.status}`);

  // Se desejar salvar no backend:
  /*
  const token = localStorage.getItem('token');
  const headers = { 'Authorization': `Bearer ${token}` };
  this.http.patch(`${environment.api_url}/api/servicos/${servico.id}`, { status: servico.status }, { headers })
    .subscribe({
      next: () => console.log('Status atualizado com sucesso no backend'),
      error: (err) => console.error('Erro ao atualizar status:', err)
    });
  */
}
}
