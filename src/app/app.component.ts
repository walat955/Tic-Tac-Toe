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

    //ensure that the currentWinningLine is updated with the latest value emitted by winninLine$.
    /*
    here the subscribe method takes a single callback function as an argument,
    which will be executed whenever the observable emits a new value.
    the callback function provided to subscribe is an arrow function(line => this.currentWinningLine = line).
    this function take one parameter, line, 
    which represent the emitted value from the observable.
    inside the arrow function this.currentWinningLine is assigned the value of line.
    this means that everytime winningLine$ emits a new value, currentWinningLine will be updated with that value.

    in summary this code sets up a subscription to the winningLine$ observable, ensuring that currentWinninLine is always
    updated with the latest value emitted by the observable.
    */
   
    this.winningLine$.subscribe(line => this.currentWinningLine = line );
  }

  makeMove(index: number): void {
    this.gameService.makeMove(index);
  }

  resetGame(): void {
    this.gameService.resetGame();
  }

  //check if the index if a part of the currentWinningLine.
  isWinningSquare(index: number): boolean {
    /**
     * The ?. (optional chaining) ensures that if currentWinningLine is null or undefined, TypeScript won’t throw an error when calling .includes(index).
     * If currentWinningLine is not null/undefined, .includes(index) checks whether index exists in the array.

?? false ensure that the function always returns a boolean.
If this.currentWinningLine?.includes(index) returns undefined or null, it defaults to false.
Ensures the function always returns a boolean.
     */
    return this.currentWinningLine?.includes(index) ?? false;
  }

/**
 * 
 * this is the same method as above but more readable.
 *  isWinningSquare(index: number): boolean {
    if (!this.currentWinningLine) {
      return false;
    }
    return this.currentWinningLine.includes(index);
  }
    If this.currentWinningLine is null or undefined, it returns false (ensuring it doesn’t crash).
Otherwise, it checks if index exists in currentWinningLine (an array) and returns true or false.
  */ 
}
