import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
<<<<<<< Updated upstream
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
=======
import { Observable, throwError } from 'rxjs'; // Importe o throwError
import { catchError } from 'rxjs/operators'; // Importe o operador catchError
>>>>>>> Stashed changes

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
<<<<<<< Updated upstream
  private apiUrl = 'http://localhost:3000/api/clientes';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado.');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  criarCliente(cliente: any): Observable<any> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.post(this.apiUrl, cliente, { headers }).pipe(
        catchError(error => {
          console.error('Erro ao criar cliente:', error);
          const mensagem = error?.error?.message || 'Erro ao enviar dados.';
          return throwError(() => new Error(mensagem));
        })
      );
    } catch (err) {
      return throwError(() => err);
    }
  }

  obterClientes(): Observable<any[]> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
        catchError(error => {
          console.error('Erro ao obter clientes:', error);
          const mensagem = error?.error?.message || 'Erro ao obter clientes.';
          return throwError(() => new Error(mensagem));
        })
      );
    } catch (err) {
      return throwError(() => err);
    }
  }

  deletarCliente(clienteId: string): Observable<any> {
    try {
      const headers = this.getAuthHeaders();
      return this.http.delete(`${this.apiUrl}/${clienteId}`, { headers }).pipe(
        catchError(error => {
          console.error('Erro na requisição DELETE:', error);
          const mensagem = error?.error?.message || 'Erro ao excluir o cliente.';
          return throwError(() => new Error(mensagem));
        })
      );
    } catch (err) {
      return throwError(() => err);
    }
  }
=======
  private apiUrl = 'http://localhost:3000/api/clientes'; // URL do backend com /api

  constructor(private http: HttpClient) {}

  // Método para criar um cliente
  criarCliente(cliente: any): Observable<any> {
    const token = localStorage.getItem('token'); // Supondo que o JWT é armazenado no localStorage

    if (!token) {
      console.error('Token JWT não encontrado.');
      alert('Você precisa estar autenticado para realizar esta ação.');
      // Retorna um Observable de erro
      return throwError(() => new Error('Token não encontrado.'));
    }

    // Configuração do cabeçalho com o token de autenticação e Content-Type
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Autenticação via token JWT
      'Content-Type': 'application/json'  // Tipo de conteúdo para enviar os dados como JSON
    });

    // Enviando os dados para o backend usando o método POST
    return this.http.post(this.apiUrl, cliente, { headers }).pipe(
      catchError(error => {
        console.error('Erro na requisição HTTP:', error);
        return throwError(() => new Error('Erro ao enviar dados.'));
      })
    );
  }

  // Método para obter todos os clientes
  obterClientes(): Observable<any[]> {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token JWT não encontrado.');
      return throwError(() => new Error('Token não encontrado.'));
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao obter clientes:', error);
        return throwError(() => new Error('Erro ao obter clientes.'));
      })
    );
  }  


  deletarCliente(clienteId: string): Observable<any> {
    const token = localStorage.getItem('token'); // Supondo que o JWT está armazenado no localStorage
  
    if (!token) {
      console.error('Token JWT não encontrado.');
      alert('Você precisa estar autenticado para realizar esta ação.');
      return throwError(() => new Error('Token não encontrado.'));
    }
  
    // Configuração do cabeçalho com o token de autenticação
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  
    // Enviando a requisição DELETE para o backend
    return this.http.delete(`${this.apiUrl}/${clienteId}`, { headers }).pipe(
      catchError(error => {
        console.error('Erro na requisição DELETE:', error);
        return throwError(() => new Error('Erro ao excluir o cliente.'));
      })
    );
  }
  


>>>>>>> Stashed changes
}
