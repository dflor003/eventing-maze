'use strict';

import {Direction} from '../../common/direction';
import {Vector2D} from '../../common/vector-2d';

type WallMap = { [key: string]: boolean; };

export interface IMazeCellData {
    [direction: string]: boolean;
}

export class MazeCell {
    private static lastSetId = 1;
    private x: number;
    private y: number;
    private walls: WallMap = {};

    setId: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.setId = MazeCell.lastSetId++;
        this.walls[Direction.Up.toString()] = true;
        this.walls[Direction.Down.toString()] = true;
        this.walls[Direction.Left.toString()] = true;
        this.walls[Direction.Right.toString()] = true;
    }

    static fromData(x: number, y: number, data: IMazeCellData) {
        let cell = new MazeCell(x, y);
        for(let direction in data) {
            if (data.hasOwnProperty(direction)) {
                cell.walls[direction] = data[direction];
            }
        }

        return cell;
    }

    get position(): Vector2D {
        return new Vector2D(this.x, this.y);
    }

    getX(): number {
        return this.x;
    }

    getY(): number {
        return this.y;
    }

    hasWall(direction: Direction): boolean {
        return this.walls[direction.toString()] === true;
    }

    mergeWith(other: MazeCell): void {
        let directionToOther = this.directionTo(other);
        this.walls[directionToOther.name()] = false;
        other.walls[directionToOther.opposite().name()] = false;
        other.setId = this.setId;
    }

    isSameSetAs(other: MazeCell): boolean {
        return this.setId === other.setId;
    }

    directionTo(other: MazeCell): Direction {
        if (this.x < other.x && this.y === other.y) {
            return Direction.Right;
        }

        if (this.x > other.x && this.y === other.y) {
            return Direction.Left;
        }

        if (this.y < other.y && this.x === other.x) {
            return Direction.Down;
        }

        if (this.y > other.y && this.x === other.x) {
            return Direction.Up;
        }

        throw new Error('Invalid direction comparison');
    }

    toData(): any {
        return this.walls; // TODO: Change this to copy
    }
}