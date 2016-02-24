'use strict';

import {MazeService} from '../maze-admin/maze-service';

export class ControlMazeCtrl {
    private mazeService: MazeService;
    private mazeId: string;

    constructor(mazeId: string, mazeService: MazeService) {
        this.mazeId = mazeId;
        this.mazeService = mazeService;
    }

    move(direction: string) {
        this.mazeService.move(this.mazeId, direction);
    }
}

angular.module('app.mazeControl').controller('controlMazeCtrl', ControlMazeCtrl);