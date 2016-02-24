'use strict';

import {Maze} from './models/maze';
import {IMazeData} from './models/maze';

export class PlayMazeCtrl {
    private maze: Maze;

    constructor(maze: IMazeData) {
        this.maze = new Maze(maze);
    }
}

angular.module('app.maze').controller('playMazeCtrl', PlayMazeCtrl);