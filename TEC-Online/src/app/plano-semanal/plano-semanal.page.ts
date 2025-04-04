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
  utilizadorName: string = 'Utilizador';

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
    
    this.http.get<any[]>('http://localhost:3000/api/servicos', { headers }).subscribe({
      next: (data) => {
        this.servicos = data;
        this.servicos.sort((a, b) => {
          const dateA = a.dataServico ? new Date(a.dataServico).getTime() : 0;
          const dateB = b.dataServico ? new Date(b.dataServico).getTime() : 0;
          return dateA - dateB;
        });
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
    this.modal.present();
  }

  openServiceDetails(servico: any) {
    this.selectedService = servico;
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