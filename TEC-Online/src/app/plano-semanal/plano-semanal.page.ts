import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
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
  @ViewChild('modal') modal!: IonModal;
  serviceData = { name: '', description: '', location: '' };
  selectedDate: string = '';
  servicos: any[] = [];
  utilizadorName: string = 'Utilizador';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log('ngOnInit chamado');
    
    // Atualizar o nome do utilizador sempre que a página carregar
    this.atualizarNomeUtilizador();
    
    this.carregarServicos();

    // 🔄 Ouvindo mudanças no localStorage para atualizar nome automaticamente
    window.addEventListener('storage', () => {
      this.atualizarNomeUtilizador();
      this.cdr.detectChanges();
    });
  }

  // Função para atualizar o nome do utilizador
  atualizarNomeUtilizador() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      this.utilizadorName = storedUsername;
      this.cdr.detectChanges(); // 🔄 Garante que a UI atualiza automaticamente
    } else {
      this.utilizadorName = 'Utilizador';
    }
  }

  carregarServicos() {
    this.http.get<any[]>('http://localhost:3000/api/servicos').subscribe(
      (data) => {
        this.servicos = data;
      },
      (error) => {
        console.error('Erro ao carregar serviços:', error);
      }
    );
  }

  openModal(event: any) {
    const selectedDate = event.detail.value;
    this.selectedDate = selectedDate;
    console.log('Data selecionada:', selectedDate);
    this.modal.present();
  }

  async closeModal() {
    console.log('Fechando o modal...');
    await this.modal.dismiss();
  }

  async navigateToOtherPage() {
    console.log('Fechando o modal e navegando para /criar-servicos');
    await this.modal.dismiss();
    this.router.navigate(['/criar-servicos']);
  }

  async navigateToPerfil() {
    console.log('Fechando o modal e navegando para /perfil');
    await this.modal.dismiss();
    this.router.navigate(['/perfil']);
  }

  async navigateToServicos() {
    console.log('Fechando o modal e navegando para /servicos');
    await this.modal.dismiss();
    this.router.navigate(['/servicos']);
  }

  createService() {
    const serviceWithDate = { ...this.serviceData, date: this.selectedDate };
    this.http.post('http://localhost:3000/api/servicos', serviceWithDate)
      .subscribe(
        response => {
          console.log('Serviço criado com sucesso:', response);
          this.serviceData = { name: '', description: '', location: '' };
          this.carregarServicos();
          this.closeModal();
        },
        error => {
          console.error('Erro ao criar serviço:', error);
        }
      );
  }
}
