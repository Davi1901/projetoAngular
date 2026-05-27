import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; 
import { RouterModule } from '@angular/router';
import { Game, GameModel } from '../../services/game';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    RouterModule
  ],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css',
})
export class GameList implements OnInit, OnDestroy {
  jogos: GameModel[] = [];
  mostrarBotaoTopo = false;
  private sub!: Subscription;

  constructor(private gameService: Game) {}

  ngOnInit(): void {
    // Escuta as atualizações do banco Laravel em tempo real
    this.sub = this.gameService.jogos$.subscribe({
      next: (dados: GameModel[]) => {
        this.jogos = dados;
      },
      error: (err: any) => {
        console.error('Erro ao escutar atualizações de jogos:', err);
      }
    });
    // Faz a busca inicial de dados ao abrir a tela
    this.gameService.carregarDadosDoBanco();
  }

  deletar(id: number): void {
    if (confirm('Tem certeza que deseja remover este jogo do seu inventário?')) {
      this.gameService.excluir(id);
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  // Monitora o scroll do mouse para exibir o botão de voltar ao topo
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.mostrarBotaoTopo = window.scrollY > 400;
  }

  // Faz a página subir com rolagem suave
  voltarAoTopo(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}