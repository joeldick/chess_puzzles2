import { useState } from 'react'

import './App.css'

import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

const polgar_puzzle_1 = //mate in one
{
  "problemid":1,
  "first":"White to Move",
  "type":"Mate in One",
  "fen":"3q1rk1/5pbp/5Qp1/8/8/2B5/5PPP/6K1 w - - 0 1",
  "moves":"f6-g7"
}
const polgar_position_307 = //mate in two
{
  "problemid":307,
  "first":"White to Move",
  "type":"Mate in Two",
  "fen":"1Q6/8/8/8/8/k2K4/8/8 w - - 0 1",
  "moves":"d3-c3;a3-a2;b8-b2"
}; 
const game = new Chess(polgar_puzzle_1.fen);

function App() {
  const [fen, setFen] = useState(game.fen())
  const [promptText, setPromptText] = useState("")
  
  function makeAMove(move) {
    const result = game.move(move)
    setFen(game.fen())
    return result; //null if move is illegal
  }
  
  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare
    });
    
    // check if the move made is legal
    if (move === null) return false;
    return true;
  }

  return (
    <>
      <div id="PuzzleNumber">
        <h2 style={{marginLeft: "0px"}}> Puzzle #{ polgar_position_307.problemid } </h2>
      </div>
      <div id="PuzzleBoard" style={{ height: "400", width: "400px" }}>
        <Chessboard id="ChessBoardObject" position={fen} onPieceDrop={onDrop} />
      </div>
      <br></br>
      <div id="PromptTextArea"></div>
    </>
  );
}

export default App
