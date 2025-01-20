import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly boardSubject = new BehaviorSubject<Array<'X' | 'O' | null>>(Array(9).fill(null));
  private readonly xIsNextSubject = new BehaviorSubject<boolean>(true);
  private readonly winnerSubject = new BehaviorSubject<'X' | 'O' | null>(null);
  private readonly winningLineSubject = new BehaviorSubject<number[] | null>(null);

  board$ = this.boardSubject.asObservable();
  xIsNext$ = this.xIsNextSubject.asObservable();
  winner$ = this.winnerSubject.asObservable();
  winningLine$ = this.winningLineSubject.asObservable();

  makeMove(index: number): void {
    const board = this.boardSubject.value.slice();
    if (this.winnerSubject.value || board[index]) {
      return;
    }

    board[index] = this.xIsNextSubject.value ? 'X' : 'O';
    this.boardSubject.next(board);
    this.xIsNextSubject.next(!this.xIsNextSubject.value);

    this.checkWinner(board);
  }

  resetGame(): void {
    this.boardSubject.next(Array(9).fill(null));
    this.xIsNextSubject.next(true);
    this.winnerSubject.next(null);
    this.winningLineSubject.next(null);
  }

  private checkWinner(board: Array<'X' | 'O' | null>): void {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        this.winnerSubject.next(board[a]);
        this.winningLineSubject.next(line);
        return;
      }
    }

    if (!board.includes(null)) {
      this.winnerSubject.next(null);
      this.winningLineSubject.next(null);
    }
  }
}
