import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SquareComponent } from './square/square.component';
import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, SquareComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  //this is the board component
  board$;
  xIsNext$;
  winner$;
  private winningLine$;
  private currentWinningLine: number[] | null = null;

  constructor(private gameService: GameService) {
    this.board$ = this.gameService.board$;
    this.xIsNext$ = this.gameService.xIsNext$;
    this.winner$ = this.gameService.winner$;
    this.winningLine$ = this.gameService.winningLine$;

    this.winningLine$.subscribe(line => this.currentWinningLine = line);
  }

  makeMove(index: number): void {
    this.gameService.makeMove(index);
  }

  resetGame(): void {
    this.gameService.resetGame();
  }

  isWinningSquare(index: number): boolean {
    return this.currentWinningLine?.includes(index) ?? false;
  }
}
