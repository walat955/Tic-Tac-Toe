import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

   // BehaviorSubject to hold the current state of the board
  private readonly boardSubject = new BehaviorSubject<Array<'X' | 'O' | null>>(Array(9).fill(null));
   // BehaviorSubject to hold whose turn it is (true for 'X', false for 'O')
  private readonly xIsNextSubject = new BehaviorSubject<boolean>(true);
   // BehaviorSubject to hold the winner ('X', 'O', or null if no winner yet)
  private readonly winnerSubject = new BehaviorSubject<'X' | 'O' | null>(null);
  // BehaviorSubject to hold the winning line (array of indices or null if no winner yet)
  private readonly winningLineSubject = new BehaviorSubject<number[] | null>(null);

   // Observable for the board state, that mean it emits values to its subscribers
  board$ = this.boardSubject.asObservable();
   // Observable for whose turn it is
  xIsNext$ = this.xIsNextSubject.asObservable();
   // Observable for the winner
  winner$ = this.winnerSubject.asObservable();
  // Observable for the winning line
  winningLine$ = this.winningLineSubject.asObservable();
 // Method to make a move on the board
  makeMove(index: number): void {
    // Get a copy of the current board state
    const board = this.boardSubject.value.slice();
    // If there's already a winner or the cell is occupied, do nothing
    if (this.winnerSubject.value || board[index]) {
      return;
    }

    board[index] = this.xIsNextSubject.value ? 'X' : 'O';// Place 'X' or 'O' on the board
    this.boardSubject.next(board);// Update the board state
    this.xIsNextSubject.next(!this.xIsNextSubject.value);// Toggle the turn

    this.checkWinner(board);// Check if there's a winner
  }

   // Method to reset the game
  resetGame(): void {
    this.boardSubject.next(Array(9).fill(null));// Reset the board to all nulls
    this.xIsNextSubject.next(true);// Set the turn to 'X'
    this.winnerSubject.next(null);// Clear the winner
    this.winningLineSubject.next(null);// Clear the winning line
  }

  private checkWinner(board: Array<'X' | 'O' | null>): void {
    // Define all possible winning combinations
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
  // Iterate over each winning combination
    for (const line of lines) {
      const [a, b, c] = line;// Destructure the indices of the winning combination
      // Check if the board positions are the same and not null
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        this.winnerSubject.next(board[a]);// Notify subscribers of the winner
        this.winningLineSubject.next(line);// Notify subscribers of the winning line
        return;// Exit the function as we have found a winner
      }
    }
  // Check if the board is full and there is no winner
    if (!board.includes(null)) {
      this.winnerSubject.next(null);// Notify subscribers that the game is a draw
      this.winningLineSubject.next(null);// Notify subscribers that there is no winning line
    }
  }
}
