import { Component, ViewChild } from '@angular/core';
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
export class PlanoSemanalPage {
  @ViewChild('modal') modal!: IonModal;
  serviceData = { name: '', description: '' };
  servicos: any[] = []; // ✅ Criado array para armazenar serviços

  constructor(private router: Router, private http: HttpClient) {
    this.carregarServicos(); // ✅ Carregar serviços ao iniciar a página
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

  // Metodo para abrir o modal
  openModal(event: any) {
    const selectedDate = event.detail.value;
    console.log('Data selecionada:', selectedDate);
    this.modal.present();
  }

  // Metodo para fechar o modal
  async closeModal() {
    console.log('Fechando o modal...');
    await this.modal.dismiss();
  }

  // Metodo para navegar para outra pagina
  async navigateToOtherPage() {
    console.log('Fechando o modal e navegando para /criar-servicos');
    await this.modal.dismiss();
    this.router.navigate(['/criar-servicos']);
  }

  // Metodo para navegar para a pagina de perfil
  async navigateToPerfil() {
    console.log('Fechando o modal e navegando para /perfil');
    await this.modal.dismiss();
    this.router.navigate(['/perfil']);
  }

  // Metodo para navegar para a pagina de servicos
  async navigateToServicos() {
    console.log('Fechando o modal e navegando para /servicos');
    await this.modal.dismiss();
    this.router.navigate(['/servicos']);
  }

  // Metodo para criar um servico
  createService() {
    this.http.post('http://localhost:3000/api/servicos', this.serviceData)
      .subscribe(
        response => {
          console.log('Servico criado com sucesso:', response);
          this.serviceData = { name: '', description: '' }; // ✅ Resetando os campos após criar
          this.carregarServicos(); // ✅ Atualizar lista de serviços
          this.closeModal();
        },
        error => {
          console.error('Erro ao criar servico:', error);
        }
      );
  }
}
