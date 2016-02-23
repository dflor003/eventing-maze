'use strict';

import {Direction} from '../../common/direction';
import {Vector2D} from '../../common/vector-2d';
import {Utils} from '../../common/utils';
import {IMazeCellData, MazeCell} from './maze-cell';

export interface IMazeData {
    id: string;
    name: string;
    width: number;
    height: number;
    cells?: IMazeCellData[][];
}

export class Maze {
    private cells: MazeCell[][];

    id: string;
    name: string;
    width: number;
    height: number;

    constructor(data: IMazeData) {
        data = data || <any>{};
        this.width = data.width;
        this.height = data.height;
        this.id = data.id;
        this.name = data.name;
        this.cells = [];

        if (!data.cells) {
            this.initializeCells();
        } else {
            this.initializeFromData(data.cells);
        }
    }

    getCell(x: number, y: number): MazeCell {
        var cell = this.cells[y][x];
        if (!cell) {
            throw new Error(`No cell at (${x}, ${y})`);
        }

        return cell;
    }

    toData(): any {
        return {
            id: this.id,
            name: this.name,
            width: this.width,
            height: this.height,
            cells: this.cells.map(row => row.map(cell => cell.toData()))
        }
    }

    private initializeCells(): void {
        for (let row = 0; row < this.height; row++) {
            var cols = [];
            this.cells.push(cols);
            for (let col = 0; col < this.width; col++) {
                var cell = new MazeCell(col, row);
                cols.push(cell);
            }
        }
    }

    private initializeFromData(data: IMazeCellData[][]) {
        for (let row = 0; row < this.height; row++) {
            var cols = [];
            this.cells.push(cols);
            for (let col = 0; col < this.width; col++) {
                var cell = MazeCell.fromData(col, row, data[row][col]);
                cols.push(cell);
            }
        }
    }
}