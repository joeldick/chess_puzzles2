import { useEffect, useState } from 'react'
import './App.css'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import problems from './assets/problems.json'

const numberOfPuzzles = problems.problems.length;

function App() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(problems.problems[currentProblemIndex]);
  const [game, setGame] = useState(new Chess(currentProblem.fen));
  const [promptText, setPromptText] = useState(`${currentProblem.first} and ${currentProblem.type}`);
  const [resultText, setResultText] = useState("Make a Move");
  const [selectedProblemID, setSelectedProblemID] = useState(currentProblemIndex);
  
  useEffect(() => {
    const problem = problems.problems[currentProblemIndex];
    setCurrentProblem(problem)
    setGame(new Chess(problem.fen));
    setPromptText(`${problem.first} and ${problem.type}`);
    setResultText('Make a Move');
    setSelectedProblemID(currentProblemIndex);
  }, [currentProblemIndex]);

  function goToProblem (problemID) {
    setCurrentProblemIndex(problemID)
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const moveResult = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() ?? "q",
    });
    
    // check if the move made is legal
    if (moveResult === null) {
      setResultText("Illegal Move");
      return false;
    }
    else {
      if (game.isCheckmate()) {
        setResultText("Checkmate! Good job!");
        setTimeout(() => {
          setCurrentProblemIndex((currentProblemIndex + 1) % numberOfPuzzles);
        }
        ,1000)
      }
      else {
        setResultText("Good Move");
      }
      return true;
    }
  }

  return (
    <>
      <div>
        <label htmlFor="problem-select">Select problem number: </label>
        <select 
          id="problem-select"
          value={selectedProblemID} 
          onChange={(e) => setSelectedProblemID(parseInt(e.target.value))}
        >
          {Array.from({ length: numberOfPuzzles}, (_, index) => (
            <option key={index} value={index}>
              {index + 1}
            </option>
          ))}
        </select>
        <button onClick={() => goToProblem(selectedProblemID)}>Go</button>
      </div>
      <div className="container" id="PuzzleContainer">
        <div id="PuzzleNumberText">
          <h2>Puzzle #{currentProblem.problemid}</h2>
        </div>
        <div id="ChessBoardContainer">
          <Chessboard 
            id="ChessBoard" 
            position={game.fen()} 
            onPieceDrop={onDrop}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customNotationStyle={{
              fontSize: '12px',
              fondWeight: 'bold'
            }}
          />
        </div>
        <div id="PromptText">
          {promptText}
        </div>
        <div id="ResultText">
          {resultText}
        </div>
      </div>
    </>
  );
}

export default App
