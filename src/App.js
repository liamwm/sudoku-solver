import './App.css';
import { useEffect, useState } from 'react';

function App() {
  useEffect(() => {
    const loadSwipl = async () => {
      const { SWIPL } = await import("https://SWI-Prolog.github.io/npm-swipl-wasm/latest/dynamic-import.js");
      console.log('SWIPL loaded.');
      const swipl = await SWIPL({ arguments: ['-q'] });
      const consultResult = await swipl.prolog.consult("swipl/sudoku.pl");
      const query = 'puzzle(1, P), solve(P).';
      const firstSolution = swipl.prolog.query(query).once().P;
      console.log(firstSolution);
    };

    loadSwipl();
  }, []);

  const values = [...Array(81).keys()].map(x => <div className="Puzzle-cell">{x}</div>)

  const solvePuzzle = async () => {
    // const swipl = await SWIPL({
    //   arguments: ["-q"],
    //   locateFile: (path) => {
    //     return `/dist/swipl/${path}`;
    //   },
    // });
    // const query = "member(X, [a, b, c]).";
    // const firstSolution = swipl.prolog.query(query).once().X;
    // console.log(firstSolution);
  };

  return (
    <div className="App">
      <script src="https://SWI-Prolog.github.io/npm-swipl-wasm/latest/index.js"></script>
      <header className="App-header">
        <div className="Puzzle-grid">
          {values}
        </div>
        <button type="button" onClick={solvePuzzle}>Solve!</button>
      </header>
    </div>
  );
}

export default App;
