export class CellLocation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class GameOfLifeModel {
    livingCells = []

    static emptyWorld() {
        return new GameOfLifeModel();
    }

    clear() {
        this.livingCells = []
    }

    isEmpty() {
        return this.livingCells.length === 0
    }

    setLivingAt(location) {
        this.livingCells.push(location)
    }

    aliveInNextGeneration(cell) {
        let numLivingNeighbors = 0
        let iAmAlive = this.livingNow(cell)
        this.neighborsOfCellAt(cell.x, cell.y).forEach(neighbor => {
            if (this.livingNow(neighbor))
                numLivingNeighbors++
        })
        return iAmAlive ? numLivingNeighbors >= 2 && numLivingNeighbors < 4 : numLivingNeighbors === 3
    }

    livingNow(locationInQuestion) {
        return this.livingCells.find(location =>
            location.x === locationInQuestion.x &&
            location.y === locationInQuestion.y) !== undefined;
    }

    /*
        [x-1,y+1] [x,y+1] [x+1,y+1]
        [x-1,y]   [x,y]   [x+1,y]
        [x-1,y-1] [x,y-1] [x+1,y-1]
     */
    neighborsOfCellAt(x, y) {
        return [
            new CellLocation(x - 1, y + 1), new CellLocation(x, y + 1), new CellLocation(x + 1, y + 1),
            new CellLocation(x - 1, y), new CellLocation(x + 1, y),
            new CellLocation(x - 1, y - 1), new CellLocation(x, y - 1), new CellLocation(x + 1, y - 1)
        ]
    }
}
