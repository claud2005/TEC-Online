import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

// ✅ Importação do serviço
import { ClienteService } from '../services/cliente.service'; // Ajuste o caminho se necessário

@Component({
  selector: 'app-adicionar-cliente',
  templateUrl: './adicionar-cliente.page.html',
  styleUrls: ['./adicionar-cliente.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule],
})
export class AdicionarClientePage {
  clienteForm: FormGroup;
  numeroClienteAutomatico = 12345;  // Número inicial para o cliente

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private clienteService: ClienteService // ✅ Serviço injetado para enviar os dados
  ) {
    // Inicializando o formulário com validação para cada campo
    this.clienteForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      morada: ['', [Validators.required]],
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{4}-[0-9]{3}$')]], // Formato para código postal
      contacto: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]], // Validação para número de telefone
      email: ['', [Validators.required, Validators.email]], // Validação de email
      contribuinte: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]], // Validação para o NIF
      codigoCliente: ['', [Validators.required]] // Código do cliente
    });
  }

  // Função para salvar cliente
  salvarCliente() {
    if (this.clienteForm.valid) {
      const cliente = this.clienteForm.value;
<<<<<<< Updated upstream
      cliente.numeroCliente = this.numeroClienteAutomatico;

      console.log('Dados do cliente:', cliente);  // Logando os dados para verificar antes de enviar

      // Chamada ao serviço para criar o cliente no backend
=======
      cliente.numeroCliente = this.numeroClienteAutomatico; // Incrementa número de cliente
  
>>>>>>> Stashed changes
      this.clienteService.criarCliente(cliente).subscribe({
        next: (res) => {
          console.log('Cliente salvo no backend:', res);
          alert('Cliente salvo com sucesso!');
<<<<<<< Updated upstream
          this.numeroClienteAutomatico++; // Incrementa o número do próximo cliente
=======
          this.numeroClienteAutomatico++; // Incrementa para o próximo cliente
>>>>>>> Stashed changes
          this.voltar(); // Volta para a página anterior
        },
        error: (err) => {
          console.error('Erro ao salvar cliente:', err);
          alert('Erro ao salvar cliente. Verifique os dados e tente novamente.');
        }
      });
    } else {
      console.log('Erro no formulário:', this.clienteForm.errors); // Exibindo erros do formulário
      alert('Por favor, preencha todos os campos corretamente.');
    }
<<<<<<< Updated upstream
  }
=======
  }  
>>>>>>> Stashed changes

  // Função para voltar à página anterior
  voltar() {
    this.navCtrl.back();
  }
}
