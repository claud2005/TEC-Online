import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-adicionar-cliente',
  templateUrl: './adicionar-cliente.page.html',
  styleUrls: ['./adicionar-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule]
})
export class AdicionarClientePage {
  clienteForm: FormGroup;
  ultimoCodigoCliente = 0;
  private apiUrl = 'https://tec-online-api.vercel.app/api/clientes';

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private http: HttpClient
  ) {
    this.clienteForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      morada: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{3}$')]],
      contacto: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      email: ['', [Validators.required, Validators.email]],
      contribuinte: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]]
    });

    this.carregarUltimoCodigo();
  }

  async carregarUltimoCodigo() {
    try {
      const ultimoCodigo = localStorage.getItem('ultimoCodigoCliente');
      this.ultimoCodigoCliente = ultimoCodigo ? parseInt(ultimoCodigo, 10) : 0;
    } catch (error) {
      console.error('Erro ao carregar último código:', error);
      this.ultimoCodigoCliente = 0;
    }
  }

  async salvarCliente() {
    const token = localStorage.getItem('token');
    if (!token) {
      await this.mostrarToast('Usuário não autenticado. Por favor faça login novamente.', 'danger');
      return;
    }

    if (this.clienteForm.invalid) {
      this.marcarCamposInvalidos();
      await this.mostrarToast('Por favor, preencha todos os campos corretamente.', 'warning');
      return;
    }

    try {
      const clienteData = this.clienteForm.value;

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      });

      await this.http.post(this.apiUrl, clienteData, { headers }).toPromise();

      await this.mostrarToast(`Cliente salvo com sucesso`, 'success');
      this.clienteForm.reset();
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      let mensagemErro = 'Erro ao salvar cliente';
      if (error.error?.message) {
        mensagemErro += `: ${error.error.message}`;
      } else if (error.status === 400) {
        mensagemErro = 'Dados inválidos. Verifique os campos.';
      }
      await this.mostrarToast(mensagemErro, 'danger');
    }
  }

  private marcarCamposInvalidos() {
    Object.values(this.clienteForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  private async mostrarToast(mensagem: string, cor: string = 'primary') {
    const toast = await this.toastController.create({
      message: mensagem,
      duration: 3000,
      color: cor,
      position: 'top'
    });
    await toast.present();
  }

  voltar() {
    this.navCtrl.back();
  }
}
