import { useState } from 'react'

import './App.css'

import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'

function App() {
  const polgar_position_1 = '3q1rk1/5pbp/5Qp1/8/8/2B5/5PPP/6K1 w - - 0 1'; //mate in one
  const polgar_position_307 = '1Q6/8/8/8/8/k2K4/8/8 w - - 0 1'; //mate in two
  const [game, setGame] = useState(new Chess(polgar_position_307));

  function makeAMove(move) {
    const result = game.move(move)
    const newGame = new Chess(result.after)
    setGame(newGame)
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
    <div style={{ height: "400", width: "400px" }}>
      <Chessboard id="BasicBoard" position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
}

export default App
