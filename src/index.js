// https://codepen.io/gaearon/pen/oWWQNa?editors=0010
// ========================================

// IMPORT LIBRARY
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// SQUARE FUNCTIONAL COMPONENT - RENDERS A SINGLE <button>
function Square(props) {
  return (
    // square component fill in an X when clicked
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// BOARD COMPONENT - RENDERS 9 SQUARES
class Board extends React.Component {
  // BOARD RENDER METHOD
  renderSquare(i) {
  // pass a `value` prop to square
  return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
         />;
  }
    render() {
      return (
      <div>
      <div className="board-row">
        {this.renderSquare(0)}
        {this.renderSquare(1)}
        {this.renderSquare(2)}
      </div>
      <div className="board-row">
        {this.renderSquare(3)}
        {this.renderSquare(4)}
        {this.renderSquare(5)}
      </div>
      <div className="board-row">
        {this.renderSquare(6)}
        {this.renderSquare(7)}
        {this.renderSquare(8)}
      </div>
    </div>
    );
  }
}

// GAME COMPONENT - RENDERS A BOARD
class Game extends React.Component {
  // initial state for storing history
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        /*
        squares: [
          null, null, null,
          null, null, null,
          null, null, null,
        ]
        */
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
  handleClick(i) {
    // aware of stepNumber so can go back in time
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // const history = this.state.history;
    const current = history[history.length - 1];
    // .slice() operator to copy the squares array prior to making changes and to prevent mutating the existing array
    const squares = current.squares.slice();
    // ignore the click if game already won or square filled
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // toggle `xIsNext` by flipping the boolean value and saving the state
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      // update stepNumber when a new move is made
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  // game to update state
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  render() {
    // looks at recent history entry
    const history = this.state.history;
    // read step in history
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // show previous moves made in game
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      return (
        // unique ID for each step
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    })
    // calculating game status
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');
    }
    return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
    );
  }
}

// ========================================
// HELPER FUNCTION - WHEN A GAME IS WON
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    return squares[a];
    }
  }
  return null;
}

// ========================================
// RENDER METHOD
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  