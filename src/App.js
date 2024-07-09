import './App.css';
import { useEffect, useState, useRef } from 'react';

function App() {
  const [squareValues, setSquareValues] = useState(Array(81).fill(" "));
  const [numberBrushValue, setNumberBrushValue] = useState("9");
  const swipl = useRef();

  const preparePuzzleInput = (squareValues) => {
    const underscored = squareValues.map(x => {
      if (x === ' ') {
        return '_';
      }
      return x;
    })

    let unflattenedSquareValues = [];
    for (let i = 0; i < 9; i++) {
      unflattenedSquareValues.push("[" + underscored.slice(9*i, 9*i+9).toString() + "]");
    }
    return ("[" + unflattenedSquareValues.toString() + "]");
  }

  useEffect(() => {
    const loadSwipl = async () => {
      const { SWIPL } = await import("https://SWI-Prolog.github.io/npm-swipl-wasm/latest/dynamic-import.js");
      swipl.current = await SWIPL({ arguments: ['-q'] });
      await swipl.current.prolog.consult("swipl/sudoku.pl");
      console.log('SWIPL loaded.');
    };

    loadSwipl();
  }, []);

  const onClickPuzzleCell = async (cellNumber) => {
    const newSquareValues = Array.from(squareValues);
    newSquareValues[cellNumber] = numberBrushValue;
    setSquareValues(newSquareValues);
  }

  const onChangeNumberRadio = async (event, radioId) => {
    const newNumberBrushValue = radioId.toString();
    setNumberBrushValue(newNumberBrushValue);
  }

  const numberRadios = [...Array(9).keys()].map(x => 
    <div className="Number-radio">
      <input type="radio" id={x+1} name="number-radio" onChange={(e) => onChangeNumberRadio(e, x+1)}/>
      <label for={x+1}>{x+1}</label>
    </div>
  );

  const solvePuzzle = async () => {
    const puzzleInput = preparePuzzleInput(squareValues);
    const query = 'P = ' + puzzleInput + ', solve(P).';
    const solution = swipl.current.prolog.query(query, {Puzzle: puzzleInput}).once().P;

    const newSquareValues = solution.flat()
    setSquareValues(newSquareValues);
  };

  const resetPuzzle = async () => {
    const newSquareValues = Array(81).fill(' ');
    setSquareValues(newSquareValues);
  }
 
  return (
    <div className="App">
      <header className="App-header">
        <div className="Puzzle-grid">
          {[...Array(squareValues.length).keys()].map(x => <div className="Puzzle-cell" onClick={() => onClickPuzzleCell(x)}>{squareValues[x]}</div>)}
        </div>
        <div className="Number-radios">
          {numberRadios}
        </div>
        <button type="button" onClick={solvePuzzle}>Solve!</button>
        <button type="button" onClick={resetPuzzle}>Reset</button>
      </header>
    </div>
  );
}

export default App;
