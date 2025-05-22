import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../services/cliente.service';

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
    private clienteService: ClienteService,
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
    try {
      // Se você tiver um endpoint para pegar o último código
      // const resposta = await this.clienteService.obterUltimoCodigo().toPromise();
      // this.ultimoCodigoCliente = resposta.ultimoCodigo || 0;
      
      // Ou usar localStorage como fallback
      const ultimoCodigo = localStorage.getItem('ultimoCodigoCliente');
      this.ultimoCodigoCliente = ultimoCodigo ? parseInt(ultimoCodigo, 10) : 0;
    } catch (error) {
      console.error('Erro ao carregar último código:', error);
      this.ultimoCodigoCliente = 0;
    }
  }

  async salvarCliente() {
    // Validação do token
    const token = localStorage.getItem('token');
    if (!token) {
      await this.mostrarToast('Usuário não autenticado. Por favor faça login novamente.', 'danger');
      return;
    }

    // Validação do formulário
    if (this.clienteForm.invalid) {
      this.marcarCamposInvalidos();
      await this.mostrarToast('Por favor, preencha todos os campos corretamente.', 'warning');
      return;
    }

    try {
      // Gerar código do cliente
      this.ultimoCodigoCliente++;
      const codigoFormatado = this.formatarCodigoCliente(this.ultimoCodigoCliente);
      
      // Preparar dados
      const clienteData = {
        ...this.clienteForm.value,
        codigoCliente: codigoFormatado,
        token: token // Se necessário para o backend
      };

      console.log('Enviando dados:', clienteData);

      // Enviar para o serviço
      const resposta = await this.clienteService.criarCliente(clienteData).toPromise();
      
      // Salvar código e mostrar feedback
      localStorage.setItem('ultimoCodigoCliente', this.ultimoCodigoCliente.toString());
      await this.mostrarToast(`Cliente ${codigoFormatado} salvo com sucesso!`, 'success');
      
      // Redirecionar ou limpar formulário
      this.clienteForm.reset();
      this.ultimoCodigoCliente = 0; // Ou manter para próxima inserção
      
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      this.ultimoCodigoCliente--; // Reverter incremento

      let mensagemErro = 'Erro ao salvar cliente';
      if (error.error?.message) {
        mensagemErro += `: ${error.error.message}`;
      } else if (error.status === 400) {
        mensagemErro = 'Dados inválidos. Verifique os campos.';
      }

      await this.mostrarToast(mensagemErro, 'danger');
    }
  }

  private formatarCodigoCliente(numero: number): string {
    return numero.toString().padStart(2, '0'); // Formata como "01", "02", etc.
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