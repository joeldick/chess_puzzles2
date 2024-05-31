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
const polgar_puzzle_307 = //mate in two
{
  "problemid":307,
  "first":"White to Move",
  "type":"Mate in Two",
  "fen":"1Q6/8/8/8/8/k2K4/8/8 w - - 0 1",
  "moves":"d3-c3;a3-a2;b8-b2"
}; 
const currentProblem = polgar_puzzle_307;

function App() {
  const [game, setGame] = useState(new Chess(currentProblem.fen));
  const [fen, setFen] = useState(game.fen())
  const [promptText, setPromptText] = useState(`${currentProblem.first} and ${currentProblem.type}`)
  const [resultText, setResultText] = useState("Make a Move")
  
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
    if (move === null) {
      setResultText("Illegal Move");
      return false;
    }
    else {
      if (game.isCheckmate()) {
        setResultText("Checkmate! Good job!");  
      }
      else {
        setResultText("Good Move");
      }
      return true;
    }
  }

  return (
    <div className="container" id="PuzzleContainer">
      <div id="PuzzleNumberText">
        <h2 style={{ marginLeft: "0px" }}>Puzzle #{currentProblem.problemid}</h2>
      </div>
      <div id="PuzzleBoard">
        <Chessboard id="ChessBoardObject" position={fen} onPieceDrop={onDrop} />
      </div>
      <br />
      <div id="PromptText">
        {promptText}
      </div>
      <div id="ResultText">
        {resultText}
      </div>
    </div>
  );
}

export default App
