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
  @ViewChild('modal') modal!: IonModal;
  serviceData = { name: '', description: '', location: '' }; // Incluindo "location" para o serviço
  selectedDate: string = ''; // Data selecionada
  servicos: any[] = []; // ✅ Criado array para armazenar serviços
  utilizadorName: string = 'Utilizador'; // Nome do utilizador logado, alterado para utilizador

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    console.log('ngOnInit chamado');
    this.carregarServicos(); 
    this.getUtilizadorNameFromAPI(); 
  }  

  getUtilizadorNameFromAPI() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ Token não encontrado');
      return;
    }
  
    this.http.get<{ nome: string }>('http://localhost:3000/api/utilizador', {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe(
      (response) => {
        console.log('✅ Nome do utilizador recebido:', response.nome); // Verificar o valor da resposta
        this.utilizadorName = response.nome; // Atualiza o nome do utilizador
      },
      (error) => {
        console.error('❌ Erro ao buscar nome do utilizador:', error);
      }
    );
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

  // Método para abrir o modal
  openModal(event: any) {
    const selectedDate = event.detail.value;
    this.selectedDate = selectedDate; // Armazenando a data selecionada
    console.log('Data selecionada:', selectedDate);
    this.modal.present(); // Apresentando o modal
  }

  // Método para fechar o modal
  async closeModal() {
    console.log('Fechando o modal...');
    await this.modal.dismiss(); // Fechando o modal
  }

  // Método para navegar para outra página
  async navigateToOtherPage() {
    console.log('Fechando o modal e navegando para /criar-servicos');
    await this.modal.dismiss(); // Fechando o modal
    this.router.navigate(['/criar-servicos']); // Navegando para página de criar serviço
  }

  // Método para navegar para a página de perfil
  async navigateToPerfil() {
    console.log('Fechando o modal e navegando para /perfil');
    await this.modal.dismiss(); // Fechando o modal
    this.router.navigate(['/perfil']); // Navegando para perfil
  }

  // Método para navegar para a página de serviços
  async navigateToServicos() {
    console.log('Fechando o modal e navegando para /servicos');
    await this.modal.dismiss(); // Fechando o modal
    this.router.navigate(['/servicos']); // Navegando para serviços
  }

  // Método para criar um serviço
  createService() {
    const serviceWithDate = { ...this.serviceData, date: this.selectedDate }; // Incluindo a data no serviço
    this.http.post('http://localhost:3000/api/servicos', serviceWithDate) // Criando o serviço
      .subscribe(
        response => {
          console.log('Serviço criado com sucesso:', response);
          this.serviceData = { name: '', description: '', location: '' }; // Resetando os campos após criar
          this.carregarServicos(); // Atualizando a lista de serviços
          this.closeModal(); // Fechando o modal
        },
        error => {
          console.error('Erro ao criar serviço:', error);
        }
      );
  }
}
