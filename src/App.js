import './style.css';
import { useEffect, useState, useRef } from 'react';

function App() {
  const [squareValues, setSquareValues] = useState(Array(81).fill(" "));
  const [brushValue, setBrushValue] = useState("9");
  const [status, setStatus] = useState("");
  const swipl = useRef();
  const paletteOptions = ([...Array(9).keys()].map(x => x.toString()));
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
      await swipl.current.prolog.consult("swipl/sudoku.pl");
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
 
  return (
    <div className="App">
        <div className="grid grid-cols-9 size-fit gap-1">
          {[...Array(squareValues.length).keys()].map(x => 
            <div className="size-10 bg-sky-500 hover:bg-sky-700 place-content-center" key={x} onClick={() => onClickPuzzleCell(x)}>
              <p className="text-center">{squareValues[x]}</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-5 size-fit">
          {paletteOptions.map(x =>
            <div key={x}>
              <input type="radio" id={x} name="editor-palette" className="hidden peer" onChange={(e) => onChangeNumberRadio(e, x)}/>
              <label className="inline-flex bg-red-300 hover:bg-red-400 peer-checked:bg-red-500" htmlFor={x}>
                <div className="size-16 place-content-center">
                  {x === "Erase" ? <img src="eraser.svg" className="p-5"/> : <p className="text-center">{x}</p>}
                </div>
              </label>
            </div>
          )}
        </div>
        <button type="button" onClick={solvePuzzle}>Solve!</button>
        <button type="button" onClick={resetPuzzle}>Reset</button>
        <div className="solverStatus">{status}</div>
    </div>
  );
}

export default App;
