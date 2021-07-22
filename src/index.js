import React from 'react';
import ReactDOM from 'react-dom';
import {CellLocation, GameOfLifeModel} from "./gameOfLifeModel";

import './index.css';

function Square(props) {
    let className = 'square';
    if (props.value === 'X') {
        className += ' living';
    }
    return (
        <button
            className={className}
            onClick={() => props.onClick()}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                key={i.toString()}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>{
                Array.from({length: this.props.gridSize}, (_, i) => (
                    <div className="board-row">{
                        Array.from({length: this.props.gridSize}, (_, j) => (
                            this.renderSquare((i * this.props.gridSize) + j)
                        ))
                    }</div>
                ))
            }</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gridSize: props.gridSize,
            squares: Array(props.gridSize * props.gridSize).fill(null),
        }
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        squares[i] = squares[i] === null ? 'X' : null;
        this.setState({squares: squares});
    }

    render() {
        const instructions =
            'Click on individual cells to set initial state\n' +
            'Click Start to start the simulation, and Stop to stop the simulation';
        return (
            <div className="game">
                <div className="game-board">
                    <div style={{whiteSpace: "pre-line"}} className="instructions">{instructions}</div>
                    <Board
                        gridSize={this.state.gridSize}
                        squares={this.state.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>
                        <button onClick={() => this.startSimulation()}>Start</button>
                        <button onClick={() => this.stopSimulation()}>Stop</button>
                    </div>
                </div>
            </div>
        );
    }

    startSimulation() {
        if (this.interval === undefined) {
            console.log('starting simulation');
            this.interval = setInterval(() => this.nextGen(), 500);
        }
    }

    clearGrid() {
        this.setState({
            squares: Array(this.state.gridSize * this.state.gridSize).fill(null),
        });
    }

    stopSimulation() {
        this.interval = clearInterval(this.interval);
        this.clearGrid();
        gameOfLife.clear();
        console.log('simulation stopped');
    }

    nextGen() {
        console.log("running simulation...");
        this.fromViewToModel();
        let nextGenLivingCells = [];
        for (let row = 0; row < gridSize; row++) {
            for (let column = 0; column < gridSize; column++) {
                const cellLocation = new CellLocation(row, column);
                if (gameOfLife.aliveInNextGeneration(cellLocation)) {
                    nextGenLivingCells.push(cellLocation);
                }
            }
        }
        gameOfLife.livingCells = nextGenLivingCells;
        this.fromModelToView();
    }

    fromViewToModel() {
        this.state.squares.forEach( (square, i) => {
            if (square === 'X') {
                let x = Math.floor(i/this.state.gridSize);
                let y = i%this.state.gridSize;
                gameOfLife.livingCells.push(new CellLocation(x, y));
            }
        });
    }

    fromModelToView() {
        let squares = Array(this.state.gridSize * this.state.gridSize).fill(null);
        gameOfLife.livingCells.forEach((cell) => {
            squares[cell.x * this.state.gridSize + cell.y] = 'X';
        })
        this.setState({
            squares: squares,
        })
    }
}
let gameOfLife = new GameOfLifeModel();


// ========================================

const
    gridSize = 5;

ReactDOM
    .render(
        <Game gridSize={
            gridSize
        }

        />,
        document.getElementById('root')
    )
;
