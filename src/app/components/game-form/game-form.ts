import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Game } from '../../services/game';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule,
    HttpClientModule
  ],
  templateUrl: './game-form.html',
  styleUrl: './game-form.css',
})
export class GameForm implements OnInit {
  novoJogo = { id: 0, titulo: '', plataforma: '', capaUrl: '' };
  carregando = false;
  modoEdicao = false; // Flag para controlar se o painel está editando ou cadastrando

  constructor(
    private gameService: Game, 
    private router: Router,
    private route: ActivatedRoute, // Injetado para conseguir ler o ID que vem na URL
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Captura o parâmetro 'id' que passamos na rota lá no botão de editar
    const gameId = this.route.snapshot.paramMap.get('id');
    
    if (gameId) {
      this.modoEdicao = true;
      this.carregando = true;
      
      // Busca os dados atuais do jogo no banco do Laravel para preencher os inputs
      this.gameService.getGamePorId(Number(gameId)).subscribe({
        next: (game) => {
          this.novoJogo = game;
          this.carregando = false;
        },
        error: () => {
          console.error('Erro ao buscar dados do game para edição.');
          this.carregando = false;
          this.router.navigate(['/games']);
        }
      });
    }
  }

  salvar() {
    if (!this.novoJogo.titulo) return;

    // SE ESTIVER NO MODO EDIÇÃO: Atualiza os dados direto no Laravel e volta para a lista
    if (this.modoEdicao) {
      this.gameService.atualizar(this.novoJogo.id, {...this.novoJogo});
      this.router.navigate(['/games']);
      return;
    }

    // --- SE FOR UM CADASTRO NOVO: Mantém o funcionamento anterior intacto ---
    if (this.novoJogo.capaUrl && this.novoJogo.capaUrl.trim() !== '') {
      this.gameService.adicionar({...this.novoJogo});
      this.router.navigate(['/games']);
      return;
    }

    this.carregando = true;
    const urlApi = `https://api.rawg.io/api/games?key=c552dd82850a41f8bfd99e2729007f18&search=${encodeURIComponent(this.novoJogo.titulo)}`;

    this.http.get<any>(urlApi).subscribe({
      next: (resposta) => {
        if (resposta.results && resposta.results.length > 0) {
          this.novoJogo.capaUrl = resposta.results[0].background_image;
        } else {
          this.novoJogo.capaUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80';
        }
        this.gameService.adicionar({...this.novoJogo});
        this.carregando = false;
        this.router.navigate(['/games']); 
      },
      error: () => {
        this.novoJogo.capaUrl = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80';
        this.gameService.adicionar({...this.novoJogo});
        this.carregando = false;
        this.router.navigate(['/games']);
      }
    });
  }
}