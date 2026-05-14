import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon'; 
import { Game } from '../../services/game';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css',
})
export class GameList implements OnInit {
  jogos: any[] = [];

  constructor(private gameService: Game) {}

  ngOnInit(): void {
    this.jogos = this.gameService.getGames();
  }

  deletar(id: number) {
    this.gameService.excluir(id);
    this.jogos = this.gameService.getGames();
  }
}