import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
  private readonly storageKey = 'game_vault_db';
  private listagem: GameModel[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Só tenta carregar dados se estiver no navegador
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.storageKey);
      this.listagem = saved ? JSON.parse(saved) : [];

      if (this.listagem.length === 0) {
        this.listagem = [
          { id: 1, titulo: 'The Last of Us Part II', plataforma: 'PS5', capaUrl: 'https://m.media-amazon.com/images/I/81S6L3Qv9DL._AC_SX425_.jpg' },
          { id: 2, titulo: 'God of War Ragnarök', plataforma: 'PS5/PS4', capaUrl: 'https://m.media-amazon.com/images/I/81T8oO6InFL._AC_SX425_.jpg' },
          { id: 3, titulo: 'Horizon Forbidden West', plataforma: 'PS5', capaUrl: 'https://m.media-amazon.com/images/I/8106xK6TidL._AC_SX425_.jpg' }
        ];
        this.atualizarStorage();
      }
    }
  }

  private atualizarStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.listagem));
    }
  }

  getGames(): GameModel[] {
    return this.listagem;
  }

  adicionar(novo: GameModel) {
    novo.id = Date.now();
    this.listagem.push(novo);
    this.atualizarStorage();
  }

  excluir(id: number) {
    this.listagem = this.listagem.filter(g => g.id !== id);
    this.atualizarStorage();
  }
}