import { useEffect, useState } from 'react';
import './App.css';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import problems from './assets/problems.json';
import { db, auth, provider } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import loadUserProgress from './utils/loadUserProgress';
import saveUserProgress from './utils/saveUserProgress';
import unpackSolution from './utils/unpackSolution';

const numberOfPuzzles = problems.problems.length;

function App() {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [game, setGame] = useState(new Chess());
  const [gamePosition, setGamePosition] = useState('');
  const [correctMoves, setCorrectMoves] = useState([]);
  const [correctMoveIndex, setCorrectMoveIndex] = useState(0);
  const [promptText, setPromptText] = useState('');
  const [resultText, setResultText] = useState('');
  const [selectedProblemID, setSelectedProblemID] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadUserProgress(user.uid).then((progress) => {
          const nextUnsolved = Array.from(
            { length: numberOfPuzzles },
            (_, i) => i + 1
          ).find((i) => !progress[i]?.solved);
          setCurrentProblemIndex(nextUnsolved - 1 || 0);
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    goToProblem(currentProblemIndex);
  }, [currentProblemIndex]);

  function goToProblem(problemID) {
    setCurrentProblemIndex(problemID);
    const problem = problems.problems[problemID];
    const newCorrectMoves = unpackSolution(problem.moves);
    setCorrectMoves(newCorrectMoves);
    setCorrectMoveIndex(0);
    const newGame = new Chess(problem.fen);
    setGamePosition(newGame.fen());
    setGame(newGame);
    setPromptText(`${problem.first} and ${problem.type}`);
    setResultText('Make a Move'); //to control the dropdown
    setSelectedProblemID(problemID);
  }

  function onDrop(sourceSquare, targetSquare, piece) {
    const currentMove = correctMoves[correctMoveIndex];

    if (!currentMove) {
      setResultText('Invalid move. No further moves expected.');
      return false;
    }

    const { from, to, promotion } = currentMove;

    // Check if the move being made is correct
    if (
      sourceSquare === from &&
      targetSquare === to &&
      (!promotion || promotion === piece[1]?.toLowerCase())
    ) {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1]?.toLowerCase() ?? 'q',
      });

      if (move === null) return false;

      setGamePosition(game.fen());

      if (game.isCheckmate()) {
        setResultText('Checkmate! Good job!');
        setTimeout(() => {
          if (user) {
            saveUserProgress(user.uid, currentProblemIndex + 1, true);
          }
          setCurrentProblemIndex((currentProblemIndex + 1) % numberOfPuzzles);
        }, 500);
        return true;
      }

      setResultText('Good Move!');

      // computer makes the next move, if there is one
      const nextMoveIndex = correctMoveIndex + 1;

      if (nextMoveIndex < correctMoves.length) {
        setTimeout(() => {
          const computerMove = correctMoves[nextMoveIndex];
          game.move(computerMove);
          setGamePosition(game.fen());
          setCorrectMoveIndex(nextMoveIndex + 1);
        }, 300);
      }
      return true;
    } else {
      setResultText('Sorry. Incorrect :(');
      return false;
    }
  }

  return (
    <>
      <div id="main-header">
        <h1>Chess Puzzles</h1>
      </div>
      <div id="login-container">
        {!user ? (
          <div>
            <button
              className="login-button"
              onClick={() => signInWithPopup(auth, provider)}
            >
              Log In
            </button>
            <p id="login-status">Please log in.</p>
          </div>
        ) : (
          <div>
            <button className="logout-button" onClick={() => signOut(auth)}>
              Log Out
            </button>
            <p id="login-status">Hi {user.displayName}. You are logged in.</p>
          </div>
        )}
      </div>
      <div id="problem-select-container">
        <label id="select-problem-text" htmlFor="problem-select">
          Select problem number:{' '}
        </label>
        <button
          className="navigation-button"
          onClick={() =>
            setCurrentProblemIndex(
              (currentProblemIndex - 1 + numberOfPuzzles) % numberOfPuzzles
            )
          }
        >
          &#9664;
        </button>
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
        <button id="go-button" onClick={() => goToProblem(selectedProblemID)}>
          Go
        </button>
        <button
          className="navigation-button"
          onClick={() =>
            setCurrentProblemIndex((currentProblemIndex + 1) % numberOfPuzzles)
          }
        >
          &#9654;
        </button>
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
              borderRadius: '4px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            }}
            customNotationStyle={{
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          />
        </div>
        <div id="FENText">FEN: {gamePosition}</div>
        <div id="PromptText">{promptText}</div>
        <div id="ResultText">{resultText}</div>
      </div>
    </>
  );
}

export default App;
