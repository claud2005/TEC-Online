import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adicionar-cliente',
  templateUrl: './adicionar-cliente.page.html',
  styleUrls: ['./adicionar-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class AdicionarClientePage {
  clienteForm: FormGroup;
  ultimoCodigoCliente = 0;

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastController: ToastController
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
    const ultimoCodigo = localStorage.getItem('ultimoCodigoCliente');
    this.ultimoCodigoCliente = ultimoCodigo ? parseInt(ultimoCodigo, 10) : 0;
  }

  async salvarCliente() {
    const token = localStorage.getItem('token');

    if (!token) {
      await this.mostrarToast('Usuário não autenticado. Faça login novamente.', 'danger');
      return;
    }

    if (this.clienteForm.invalid) {
      this.marcarCamposInvalidos();
      await this.mostrarToast('Por favor, preencha todos os campos corretamente.', 'warning');
      return;
    }

    const clienteData = this.clienteForm.value;

    try {
      const resposta = await fetch('https://tec-online-api.vercel.app/api/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(clienteData)
      });

      const resultado = await resposta.json();

      if (!resposta.ok) {
        throw resultado;
      }

      await this.mostrarToast('Cliente salvo com sucesso!', 'success');
      this.clienteForm.reset();

    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      let mensagemErro = 'Erro ao salvar cliente';

      if (error?.message) {
        mensagemErro += `: ${error.message}`;
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
