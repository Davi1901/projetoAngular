import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface GameModel {
  id: number;
  titulo: string;
  plataforma: string;
  capaUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class Game {
  private readonly apiUrl = 'http://127.0.0.1:8000/api/jogos';
  
  private jogosSubject = new BehaviorSubject<GameModel[]>([]);
  public jogos$ = this.jogosSubject.asObservable();

  constructor(private http: HttpClient) {
    this.carregarDadosDoBanco();
  }

  // BUSCA TODOS OS JOGOS
  public carregarDadosDoBanco(): void {
    this.http.get<GameModel[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.jogosSubject.next(dados);
      },
      error: () => console.error('Erro ao conectar ao banco de dados Laravel.')
    });
  }

  getGames(): GameModel[] {
    return this.jogosSubject.value;
  }

  // BUSCA APENAS UM JOGO POR ID (Para preencher o formulário na hora de editar)
  getGamePorId(id: number): Observable<GameModel> {
    return this.http.get<GameModel>(`${this.apiUrl}/${id}`);
  }

  // CADASTRA UM NOVO JOGO
  adicionar(novo: GameModel) {
    this.http.post<GameModel>(this.apiUrl, novo).subscribe({
      next: () => this.carregarDadosDoBanco(),
      error: () => console.error('Erro ao salvar o jogo no Laravel.')
    });
  }

  // ATUALIZA UM JOGO EXISTENTE NO BANCO
  atualizar(id: number, atualizado: GameModel) {
    this.http.put<GameModel>(`${this.apiUrl}/${id}`, atualizado).subscribe({
      next: () => this.carregarDadosDoBanco(),
      error: () => console.error('Erro ao atualizar o jogo no Laravel.')
    });
  }

  // EXCLUI UM JOGO
  excluir(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.carregarDadosDoBanco(),
      error: () => console.error('Erro ao excluir o jogo no Laravel.')
    });
  }
}