import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClienteService } from '../services/cliente.service';
import { NavController, AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-cliente',
  standalone: true,
  templateUrl: './editar-cliente.page.html',
  styleUrls: ['./editar-cliente.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule
  ]
})
export class EditarClientePage implements OnInit {
  clienteForm: FormGroup;
  clienteId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private clienteService: ClienteService,
    private alertController: AlertController,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) {
    this.clienteForm = this.formBuilder.group({
      nome: ['', Validators.required],
      codigoPostal: ['', Validators.required],
      morada: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contacto: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{9}$')]
      ],
      contribuinte: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{9}$')]
      ],
      codigoCliente: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.clienteId = this.activatedRoute.snapshot.paramMap.get('id')!;
    if (this.clienteId) {
      this.carregarCliente();
    } else {
      this.showAlert('Erro', 'ID do cliente não encontrado na URL.');
      this.navCtrl.back();
    }
  }

  carregarCliente() {
    this.clienteService.obterClientePorId(this.clienteId).subscribe({
      next: (cliente: any) => {
        // Certifique-se de que todos os campos existem antes de preencher
        this.clienteForm.patchValue({
          nome: cliente.nome || '',
          codigoPostal: cliente.codigoPostal || '',
          morada: cliente.morada || '',
          email: cliente.email || '',
          contacto: cliente.contacto || '',
          contribuinte: cliente.contribuinte || '',
          codigoCliente: cliente.codigoCliente || ''
        });
      },
      error: (err) => {
        console.error('Erro ao carregar cliente:', err);
        this.showAlert('Erro', 'Não foi possível carregar os dados do cliente.');
        this.navCtrl.back();
      }
    });
  }

editarCliente() {
  if (this.clienteForm.invalid) {
    this.showAlert('Erro', 'Por favor, preencha todos os campos corretamente.');
    return;
  }

  const dados = this.clienteForm.value;
  console.log('Dados enviados para o backend:', dados);  // <- Aqui

  this.clienteService.atualizarCliente(this.clienteId, dados).subscribe({
    next: () => {
      this.showAlert('Sucesso', 'Cliente atualizado com sucesso!');
      this.navCtrl.navigateBack('/gestor-clientes');
    },
    error: (erro: any) => {
      console.error('Erro ao atualizar cliente:', erro);
      const mensagem = erro?.error?.message || erro?.message || 'Erro inesperado ao atualizar cliente.';
      this.showAlert('Erro', mensagem);
    }
  });
}

  voltar() {
    this.navCtrl.back();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
