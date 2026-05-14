import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Game } from '../../services/game';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  templateUrl: './game-form.html',
  styleUrl: './game-form.css',
})
export class GameForm {
  novoJogo = { id: 0, titulo: '', plataforma: '', capaUrl: '' };

  constructor(private gameService: Game, private router: Router) {}

  salvar() {
    this.gameService.adicionar({...this.novoJogo});
    this.router.navigate(['/games']); 
  }
}