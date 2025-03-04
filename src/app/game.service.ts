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

  
  //number[] is same as Array<number>
  /*if you want to define an array with exactly 2 number you should use a tuple:
  Example: c: [number, number] = [1,2];
  array of numbers:
  c:number[] = [];
  or
  c: Array<number> = [];
  */
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
    /*
      .value is a property of a BehaviorSubject from the RxJS library.
      it allows you to access the current value held by the BehaviorSubject.
      this is useful for getting the latest state without needing to subscribe to the BehaviorSubject.
    */
    if (this.winnerSubject.value || board[index]) {
      return;
    }


    /*
    this is ternary operator ( a short way to use if statement).
    explination: this.xIsNextSubject.value is the condition
    if the condition is true, 'X' will be assigned to board[index]
    else 'O' will be assigned to board[index].
    can be rewritten with a normal if-else statement:
        if (this.xIsNextSubject.value) {
          board[index] = 'X';
        } else {
          board[index] = 'O';
        }
    */
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

/*
board: Array<'X' | 'O' | null>
above code define board as a regular array that can have any number of elements or can be empty array.

board: ['X' | 'O' | null]
this define board as a tuple type with exactly one element,
that mean board can have x or o or null as value and it can not be empty.
checkWinner(['X']);  // ✅ Valid
checkWinner(['O']);  // ✅ Valid
checkWinner([null]); // ✅ Valid
checkWinner(['X', 'O']); // ❌ Invalid (too many elements)
checkWinner([]); // ❌ Invalid (empty array
*/

  private checkWinner(board: Array<'X' | 'O' | null>): void {
    // Define all possible winning combinations
    /**
     * we can write line like this 2:
     * const lines: number[][] =.....    // (an array of arrays of numbers).
     * this is same as const lines = ... // Here, TypeScript infers the type as number[][]
     * or
     * const lines : any[][] = ....
     * or
     * const lines: Array<any> = ...
     * or
     * const lines: Array<number[]> = ...
     */
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
  // Iterate over each winning combination
    for (const line of lines) {
      /*
      we can write the below code like this:
        const a = line[0];
        const b = line[1];
        const c = line[2];
      */
      const [a, b, c] = line;// Destructure the indices of the winning combination
      // Check if the board positions are the same and not null
      /* 
        === check if both side are the same value and type
        example:
          1===1; //true (both value and type are the same)
          1=== '1'; /7false (value is the same , but type is different)
        
        == check only the value and performs type coercion if necessery.
        example:
          1==1; // true (both value and type are the same)
          1=='1'// true ( value is the same, type is coerced to be the same).
          
          = is assignment Operator:
          let x = 5;

      */
     //board[a] check if the cell at index a is not null that mean it verifies that the cell is occupied by X or O.
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        this.winnerSubject.next(board[a]);// Notify subscribers of the winner
        this.winningLineSubject.next(line);// Notify subscribers of the winning line
        /*
              *diff between using return and break statement:
        the return statement exit the function immediately once we found a winner
        using the break statement will only exit the current iteration
        and will continue checking the remaining winning combinations.
        * return: exit the entire checkWinner function .
        * break: exit the current loop iteration and continues with the next iteration of the loop.
        */
        return;// Exit the function as we have found a winner
      }
    }

    /*
                          *explaining .includes():
      board here is an array.
      .includes() is primarily an array method in typeScript.
      it is used to determine whether an array contains a certain element.
      return true if it does and false otherwise..includes() can be used with string.
      when used with a string it check if a substring is present within the string.
      Example with an array:
        const array = [1, 2, 3];
        console.log(array.includes(2)); // true
        console.log(array.includes(4)); // false
      Example with a string:
        const string = "Hello, world!";
        console.log(string.includes("world")); // true
        console.log(string.includes("foo")); // false
    */
   /*
   if(board !==null)
   this condition is wrong because it
   Checks whether board itself is not null.
  This does not check whether board contains null values, it only ensures that board is assigned some array value.
  example: let board3 = ['X', 'O', null];   // ✅ Condition is TRUE (board is an array)
            let board4 = null;               // ❌ Condition is FALSE (board itself is null)

    if(!board.includes(null))
    this is the right condition because:
    Checks if null is not present anywhere inside the board array.
    This ensures that all elements in the board array are either 'X' or 'O', meaning the board is completely filled.
    example: const board1 = ['X', 'O', 'X'];   // ✅ Condition is TRUE (no nulls)
             const board2 = ['X', null, 'O'];  // ❌ Condition is FALSE (null exists)

   */
  // Check if the board is full
    if (!board.includes(null)) {
      this.winnerSubject.next(null);// Notify subscribers that the game is a draw
      this.winningLineSubject.next(null);// Notify subscribers that there is no winning line
    }
  }
}
