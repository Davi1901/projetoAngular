import { Routes } from '@angular/router';

import { GameList } from './components/game-list/game-list';
import { GameForm } from './components/game-form/game-form';
import { About } from './components/about/about';

export const routes: Routes = [

  { path: '', redirectTo: '/games', pathMatch: 'full' },

  { path: 'games', component: GameList },

  { path: 'add-game', component: GameForm },

  { path: 'edit-game/:id', component: GameForm },

  { path: 'about', component: About }

];