'use strict';

import {MazeService} from './maze-service';
import {IMazeData} from '../maze/models/maze';

export class MazeListCtrl {
    private mazeService: MazeService;

    mazes: IMazeData[];

    constructor(mazes: IMazeData[], mazeService: MazeService) {
        this.mazeService = mazeService;
        this.mazes = mazes;
    }
}

angular.module('app.mazeAdmin').controller('mazeListCtrl', MazeListCtrl);