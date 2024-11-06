Try the web app here: https://liamwm.github.io/sudoku-solver/

A sudoku solver written in Prolog that runs in the browser, using [the SWI-Prolog WebAssembly port](https://www.swi-prolog.org/pldoc/man?section=wasm). The React-powered puzzle editor UI allows you to easily specify the partially-filled sudoku you need to solve. This tool can also be used as a way to test whether a solution exists for a given sudoku.

I originally used the Create-React-App tool, which provides a skeleton for a single-page React application as well as a means of building the application using Webpack. Upon realising that the Create-React-App tool has been discontinued, I removed all traces of it from my project and set up my own Webpack build configuration.

This is a static web application - Prolog is running in the browser, meaning the app can be hosted on Github Pages. I use a Github Action to build the application and push the build to Pages every time a commit is pushed to the main branch.

### Development
This app can be run locally by opening the project in a VSCode Dev Container. This container includes all dependencies necessary for development and building the app.