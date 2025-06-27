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
    this.token = localStorage.getItem('token');
    console.log('Token recuperado do localStorage:', this.token);

    if (!this.token) {
      console.warn('Token não encontrado! Redirecionando para a página inicial...');
      this.router.navigate(['/home']);
      return;
    }

    this.carregarPerfil();
  }

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

  salvarPerfil() {
    if (!this.perfil.fullName || !this.perfil.username) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    this.isLoading = true;

    const formData = new FormData();
    formData.append('fullName', this.perfil.fullName);
    formData.append('username', this.perfil.username);

    if (this.selectedFile) {
      console.log('Adicionando a foto ao FormData:', this.selectedFile);
      formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar autenticado para atualizar seu perfil!');
      this.router.navigate(['/login']);
      return;
    }

    this.http.put<any>(`${environment.api_url}/api/profile`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        console.log('Perfil atualizado com sucesso:', response);
        alert('Perfil atualizado com sucesso!');

        // Atualiza o perfil com a URL real da imagem
        if (response.profilePicture) {
          this.perfil.profilePicture = response.profilePicture;
        }

        localStorage.setItem('perfil', JSON.stringify(this.perfil));
        this.selectedFile = null;
        this.router.navigate(['/perfil']);
      },
      (error) => {
        console.error('Erro ao atualizar perfil:', error);
        alert('Erro ao atualizar perfil. Tente novamente.');
        if (error.status === 401 || error.status === 403) {
          this.logout();
        }
        this.isLoading = false;
      }
    );
  }

  alterarFoto() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    if (!event.target) return;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      console.log('Tipo de arquivo selecionado:', this.selectedFile.type);
      if (!this.selectedFile.type.startsWith('image/')) {
        alert('Por favor, selecione um arquivo de imagem.');
        return;
      }

      const MAX_SIZE = 2 * 1024 * 1024;
      if (this.selectedFile.size > MAX_SIZE) {
        alert('O arquivo é muito grande. O tamanho máximo permitido é 2MB.');
        return;
      }

      // Mostrar pré-visualização sem alterar o perfil real
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const previewImage = document.getElementById('previewImage') as HTMLImageElement;
        if (previewImage) {
          previewImage.src = e.target.result;
        }
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    this.router.navigate(['/home']);
  }

  voltar() {
    this.router.navigate(['/perfil']);
  }
}
