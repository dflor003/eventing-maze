'use strict';

import {Maze} from './models/maze';
import {MazeCell} from './models/maze-cell';
import {Utils} from '../common/utils';

export function generateMaze(id: string, name: string, width: number, height: number): Maze {
    const MergeHorizontalChance = 0.50;
    const MergeVerticalChance = 0.3;
    let maze = new Maze({
        id: id,
        name: name,
        width: width,
        height: height
    });

    // Iterate every row but the last
    for (let row = 0; row < height - 1; row++) {
        // Capture distinct cells and each cell by set
        let distinctSets = [];
        let setCells = {};

        // Iterate all the columns and randomly join adjacent cells
        for (let col = 0; col < width; col++) {
            let current = maze.getCell(col, row),
                next = col === width - 1 ? null : maze.getCell(col + 1, row),
                setId = current.setId,
                cellsForSet = setCells[setId] || (setCells[setId] = []),
                shouldJoin = !!next && Math.random() < MergeHorizontalChance && !current.isSameSetAs(next);

            if (cellsForSet.indexOf(current) === -1) {
                cellsForSet.push(current);
            }

            if (distinctSets.indexOf(setId) === -1) {
                distinctSets.push(setId);
            }

            if (shouldJoin) {
                current.mergeWith(next);
            }
        }

        // Randomly merge cells downward, at least one per set
        for (let i = 0; i < distinctSets.length; i++) {
            let setId = distinctSets[i],
                cells: MazeCell[] = setCells[setId],
                nextRow = row + 1,
                stop = false;

            while (!stop) {
                let randomIndex = Utils.randInt(0, cells.length),
                    randomCell = cells[randomIndex],
                    cellUnder = maze.getCell(randomCell.getX(), nextRow);

                randomCell.mergeWith(cellUnder);
                cells.splice(randomIndex, 1);
                if (Math.random() > MergeVerticalChance || cells.length === 0) {
                    stop = true;
                }
            }
        }
    }

    // Merge all cells with adjacent cells that are of different sets
    for (let col = 0; col < width - 1; col++) {
        let current = maze.getCell(col, height - 1),
            next = maze.getCell(col + 1, height - 1);

        if (!current.isSameSetAs(next)) {
            current.mergeWith(next);
        }
    }

    return maze;
}