import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
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
}
