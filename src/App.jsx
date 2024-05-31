import { useState } from 'react'

import './App.css'

import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import problems from './assets/problems.json'

const currentProblem = problems.problems[3];
console.debug(currentProblem)

function App() {
  const [game, setGame] = useState(new Chess(currentProblem.fen));
  const [fen, setFen] = useState(game.fen())
  const [promptText, setPromptText] = useState(`${currentProblem.first} and ${currentProblem.type}`)
  const [resultText, setResultText] = useState("Make a Move")
  
  function onDrop(sourceSquare, targetSquare) {
    const moveResult = game.move({
      from: sourceSquare,
      to: targetSquare
    });
    setFen(game.fen())
    
    // check if the move made is legal
    if (moveResult === null) {
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
        <h2>Puzzle #{currentProblem.problemid}</h2>
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
