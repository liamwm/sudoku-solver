import { render } from 'react-dom';
import './style.css';
import { useEffect, useState, useRef } from 'react';

function App() {
  const [squareValues, setSquareValues] = useState(Array(81).fill(" "));
  const [brushValue, setBrushValue] = useState("1");
  const [status, setStatus] = useState("");
  const swipl = useRef();
  const paletteOptions = ([...Array(9).keys()].map(x => (x+1).toString()));
  paletteOptions.push("Erase");

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
      await swipl.current.prolog.consult("assets/swipl/sudoku.pl");
      console.log('SWIPL loaded.');
    };

    loadSwipl();
  }, []);

  const onClickPuzzleCell = async (cellNumber) => {
    const newSquareValues = Array.from(squareValues);
    const newValue = (brushValue === "Erase") ? " " : brushValue;
    newSquareValues[cellNumber] = newValue;
    setSquareValues(newSquareValues);
  }

  const onChangeNumberRadio = async (event, radioId) => {
    const newBrushValue = radioId;
    setBrushValue(newBrushValue);
  }

  const solvePuzzle = async () => {
    const puzzleInput = preparePuzzleInput(squareValues);
    const query = 'P = ' + puzzleInput + ', solve(P).';
    console.log(query);
    const solution = swipl.current.prolog.query(query, {Puzzle: puzzleInput}).once();

    if (typeof solution.P === 'undefined') {
      setStatus("No solution.");
    } else {
      const newSquareValues = solution.P.flat()
      setSquareValues(newSquareValues);
      setStatus("");
    }
  };

  const resetPuzzle = async () => {
    const newSquareValues = Array(81).fill(' ');
    setSquareValues(newSquareValues);
  }

  const renderSudokuPen = (penNumber) => {
    const penX = penNumber % 3;
    const penY = (penNumber - penX) / 3;

    let indices = [];
    for (let i = 0; i < 3; i++) {
      const row = penY * 3 + i;
      for (let j = 0; j < 3; j++) {
        const column = penX * 3 + j;
        indices.push(row * 9 + column);
      }
    }

    return (
      <div className="grid grid-cols-3 size-fit gap-0.5 bg-slate-300" key={penNumber}>
        {indices.map(x => {
          return (<div className="size-10 bg-slate-100 hover:bg-sky-200 place-content-center" key={x} onClick={() => onClickPuzzleCell(x)}>
            <p className="text-center">{squareValues[x]}</p>
          </div>);
        })}
      </div>
    );
  }
 
  return (
    <div className="App">
        <div className="grid grid-cols-3 size-fit gap-1 bg-slate-500 border-solid border-gray-500 border-2">
          {[...Array(9).keys()].map(x => renderSudokuPen(x))}
        </div>

        <div className="grid grid-cols-5 gap-0.5 size-fit border-solid border-gray-300 border-2 rounded-lg overflow-hidden">
          {paletteOptions.map(x =>
            <div className="size-16 bg-red-300 hover:bg-red-400 has-[:checked]:bg-red-500" key={x}>
              <input type="radio" id={x} name="editor-palette" className="hidden peer" onChange={(e) => onChangeNumberRadio(e, x)} checked={x === brushValue}/>
              <label className="block h-full content-center" htmlFor={x}>
                  {x === "Erase" ? <img src="assets/eraser.svg" alt="Eraser" className="p-5"/> : <p className="text-center">{x}</p>}
              </label>
            </div>
          )}
        </div>
        <button type="button" className="rounded-full bg-blue-200" onClick={solvePuzzle}>Solve!</button>
        <button type="button" className="rounded-full bg-slate-200" onClick={resetPuzzle}>Reset</button>
        <div className="solverStatus">{status}</div>
    </div>
  );
}

export default App;
