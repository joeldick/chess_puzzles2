import { useEffect, useState } from 'react';
import './App.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import problems from './assets/problems.json';

const numberOfPuzzles = problems.problems.length;

function App() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState("");
  const [correctMoves, setCorrectMoves] = useState([]);
  const [correctMoveIndex, setCorrectMovesIndex] = useState(0);
  const [promptText, setPromptText] = useState("");
  const [resultText, setResultText] = useState("");
  const [selectedProblemID, setSelectedProblemID] = useState(0);

  function unpackSolution(solutionString) {
    return solutionString.split(";").map(move => {
      const [from, toAndPromotion] = move.split("-");
      const to = toAndPromotion.slice(0, 2);
      const promotion = toAndPromotion.length > 2 ? toAndPromotion[2] : undefined;
      const result = { from, to };
      if (promotion) {
        result.promotion = promotion;
      }
      return result;
    });
  }

  useEffect(() => {
    goToProblem(0);
  }, []);

  function goToProblem(problemID) {
    setCurrentProblemIndex(problemID);
    const problem = problems.problems[problemID];
    const newCorrectMoves = unpackSolution(problem.moves);
    setCorrectMoves(newCorrectMoves);
    setCorrectMovesIndex(0);
    const newGame = new Chess(problem.fen);
    setGamePosition(newGame.fen());
    setGame(newGame);
    setPromptText(`${problem.first} and ${problem.type}`);
    setResultText('Make a Move'); //to control the dropdown
    setSelectedProblemID(problemID);
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    console.debug(sourceSquare);
    console.debug(targetSquare);
    console.debug(piece);
    console.debug(correctMoves[correctMoveIndex]);

    // Destructure the first correct move
    const { from, to, promotion } = correctMoves[correctMoveIndex];

    // Check if the move being made is correct
    if (sourceSquare === from && 
        targetSquare === to && 
        (!promotion || promotion === piece[1]?.toLowerCase())) {
      console.debug("Correct move");
      setResultText("Good Move!");
    } 
    else {
      console.debug("Incorrect move");
      setResultText("Sorry. Incorrect :(");
      return false;
    }

    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1]?.toLowerCase() ?? "q",
    });
    if (move === null) return false;

    setGamePosition(game.fen());

    if (game.isCheckmate()) {
      setResultText("Checkmate! Good job!");
      setTimeout(() => {
        const nextProblem = (currentProblemIndex + 1) % numberOfPuzzles;
        goToProblem(nextProblem);
      }, 500);
    }

    //computer makes the next move, if there is one
    const nextMoveIndex = correctMoveIndex + 1;

    if (nextMoveIndex < correctMoves.length){
      setTimeout(() => {
        const computerMove = correctMoves[nextMoveIndex];
        game.move(computerMove);
        setGamePosition(game.fen())
        setCorrectMovesIndex(nextMoveIndex + 1);
      }, 300)
    }

    return true;
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
          {Array.from({ length: numberOfPuzzles }, (_, index) => (
            <option key={index} value={index}>
              {index + 1}
            </option>
          ))}
        </select>
        <button onClick={() => goToProblem(selectedProblemID)}>Go</button>
      </div>
      <div className="container" id="PuzzleContainer">
        <div id="PuzzleNumberText">
          <h2>Puzzle #{problems.problems[currentProblemIndex].problemid}</h2>
        </div>
        <div id="ChessBoardContainer">
          <Chessboard 
            id="ChessBoard" 
            position={gamePosition} 
            onPieceDrop={onDrop}
            customBoardStyle={{
              borderRadius: "4px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            }}
            customNotationStyle={{
              fontSize: '12px',
              fontWeight: 'bold'
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

export default App;