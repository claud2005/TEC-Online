import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class EditarPerfilPage {
  perfil: any = { fullName: '', username: '', profilePicture: '' };
  isLoading: boolean = false;
  token: string | null = null;
  selectedFile: File | null = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Recuperando o token do localStorage
    this.token = localStorage.getItem('token');
    console.log('Token recuperado do localStorage:', this.token);

    if (!this.token) {
      console.warn('Token não encontrado! Redirecionando para a página inicial...');
      this.router.navigate(['/home']);
      return;
    }

    // Carregando as informações do perfil
    this.carregarPerfil();
  }

  // Função para carregar o perfil do usuário
  carregarPerfil() {
    this.isLoading = true;
    this.http.get<any>(`${environment.api_url}/api/profile`, {
      headers: { Authorization: `Bearer ${this.token}` },
    }).subscribe(
      (data) => {
        this.perfil = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar perfil:', error);
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
        this.isLoading = false;
      }
    );
  }

  // Função para salvar o perfil do usuário
  salvarPerfil() {
    // Validação dos campos obrigatórios
    if (!this.perfil.fullName || !this.perfil.username) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    this.isLoading = true;

    // Criando um objeto FormData para enviar os dados
    const formData = new FormData();
    formData.append('fullName', this.perfil.fullName);
    formData.append('username', this.perfil.username);

    // Se houver uma foto de perfil selecionada, adicione-a ao FormData
    if (this.selectedFile) {
      console.log('Adicionando a foto ao FormData:', this.selectedFile);
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    } else {
      console.log('Nenhuma foto selecionada');
    }

    // Recuperando o token do localStorage
    const token = localStorage.getItem('token');
    
    // Verifique se o token existe antes de continuar
    if (!token) {
      alert('Você precisa estar autenticado para atualizar seu perfil!');
      this.router.navigate(['/login']);  // Redireciona para a página de login, se necessário
      return;
    }

    // Log para depuração
    console.log('Enviando perfil:', formData);

    // Fazendo a requisição PUT para salvar o perfil
    this.http.put<any>(`${environment.api_url}/api/profile`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        console.log('Perfil atualizado com sucesso:', response);
        alert('Perfil atualizado com sucesso!');
        
        // Atualizando a imagem de perfil com a URL retornada
        if (response.profilePicture) {
          this.perfil.profilePicture = `${environment.api_url}/` + response.profilePicture;  // Atualiza a URL da imagem no perfil
        }

        // Atualizando as informações de perfil no localStorage
        localStorage.setItem('perfil', JSON.stringify(this.perfil));
        // Redirecionando para a página de perfil
        this.router.navigate(['/perfil']);
      },
      (error) => {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao atualizar perfil. Tente novamente.');
        // Verificando erros de autenticação
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
        this.isLoading = false;
      }
    );
  }

  // Função para abrir o seletor de arquivo
  alterarFoto() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  // Função para tratar a seleção de arquivo
  onFileSelected(event: Event) {
    if (!event.target) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Verificar se o arquivo é uma imagem
      console.log('Tipo de arquivo selecionado:', this.selectedFile.type); // Log para depuração
      if (!this.selectedFile.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
      }
  
      // Verificar tamanho máximo do arquivo (exemplo: 2MB)
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB
      console.log('Tamanho do arquivo:', this.selectedFile.size); // Log para depuração
      if (this.selectedFile.size > MAX_SIZE) {
        alert('O arquivo é muito grande. O tamanho máximo permitido é 2MB.');
        return;
      }
  
      // Atualizar a imagem temporariamente na UI
      const reader = new FileReader();
      reader.onload = (e: any) => {
        console.log('Imagem carregada com sucesso:', e.target.result); // Log para depuração
        this.perfil.profilePicture = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Função para fazer logout e redirecionar para a página inicial
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    this.router.navigate(['/home']);
  }
}
