'use strict';

import {Direction} from '../common/direction';
import {Maze} from './models/maze';
import {IMazeData} from './models/maze';
import {EventBus} from '../common/event-bus';
import {Utils} from '../common/utils';

export class PlayMazeCtrl {
    private maze: Maze;

    constructor(maze: IMazeData) {
        this.maze = new Maze(maze);
        this.init();
    }

    init(): void {
        let socket = io.connect();
        socket
            .on('connect', () => {
                Utils.log(`Connected to server!`);
                socket.emit('join-maze', this.maze.id);
            })
            .on('error', err => Utils.error(err))
            .on('move', data => {
                data = data || {}
                let directionName = data.direction;
                if (!directionName) {
                    throw new Error(`Invalid move event payload`);
                }

                let direction = Direction.fromName(directionName);
                EventBus.instance.emit('move', {direction: direction});
            });
    }
}

angular.module('app.maze').controller('playMazeCtrl', PlayMazeCtrl);