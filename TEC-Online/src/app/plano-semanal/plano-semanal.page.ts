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
  servicos: any[] = [];
  filteredServices: any[] = [];
  utilizadorName: string = 'Utilizador';
  searchQuery: string = '';
  selectedFilter: number | string = -1; // -1=todos, 0=hoje, 7, 15, 30, 'aberto', 'fechado'

  constructor(
    private router: Router,
    private http: HttpClient,
    private menuCtrl: MenuController
  ) {}

  ngOnInit() {
    this.atualizarNomeUtilizador();
  }

  ionViewWillEnter() {
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
          if (statusAtual === 'concluído') statusAtual = 'fechado';
          return {
            id: servico._id,
            nomeCliente: servico.cliente || 'Cliente não informado',
            dataServico: servico.dataServico || 'Data não agendada',
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
          return new Date(a.dataServico).getTime() - new Date(b.dataServico).getTime();
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

  aplicarFiltros() {
    const query = this.searchQuery.trim().toLowerCase();
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    this.filteredServices = this.servicos.filter(servico => {
      const matchesQuery =
        servico.nomeCliente?.toLowerCase().includes(query) ||
        servico.marcaAparelho?.toLowerCase().includes(query) ||
        servico.modeloAparelho?.toLowerCase().includes(query) ||
        servico.problemaCliente?.toLowerCase().includes(query);

      let matchesFilter = true;

      if (typeof this.selectedFilter === 'number' && this.selectedFilter >= 0) {
        const dataServico = new Date(servico.dataServico);
        dataServico.setHours(0, 0, 0, 0);

        if (this.selectedFilter === 0) {
          matchesFilter = dataServico.getTime() === hoje.getTime();
        } else {
          const diffDias = (hoje.getTime() - dataServico.getTime()) / (1000 * 60 * 60 * 24);
          matchesFilter = diffDias >= 0 && diffDias <= this.selectedFilter;
        }
      } else if (typeof this.selectedFilter === 'string') {
        matchesFilter = servico.status === this.selectedFilter;
      }

      return matchesQuery && matchesFilter;
    });
  }

  onSearchChange() {
    this.aplicarFiltros();
  }

  onSelectedFilterChange() {
    this.aplicarFiltros();
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

  navigateToAdicionarCliente() {
    this.router.navigate(['/adicionar-cliente']);
  }

  editarServico(id: string) {
    if (id) {
      this.router.navigate(['/editar-servicos', id]);
    } else {
      alert('Serviço não possui ID para edição.');
    }
  }

  alterarStatus(servico: any, novoStatus: string) {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    servico.status = novoStatus;

    this.http.patch(`${environment.api_url}/api/servicos/${servico.id}`, { status: novoStatus }, { headers })
      .subscribe({
        next: () => {
          console.log(`Status do serviço ${servico.id} atualizado para: ${novoStatus}`);
        },
        error: (err) => {
          console.error('Erro ao atualizar status:', err);
          alert('Erro ao atualizar status no servidor.');
        }
      });
  }
}
