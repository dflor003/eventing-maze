'use strict';

import {Direction} from '../common/direction';
import {Maze} from './models/maze';
import {IMazeData} from './models/maze';
import {EventBus} from '../common/event-bus';
import {Utils} from '../common/utils';

export class PlayMazeCtrl {
    private maze: Maze;
    private $uibModal: any;

    constructor(maze: IMazeData, $uibModal: any, toaster: any) {
        this.$uibModal = $uibModal;
        this.maze = new Maze(maze);

        EventBus.instance.on('move', evt => {
            toaster.pop({
                body: `Move ${evt.direction.name()} (${evt.player || 'Local'})`
            })
        });

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

    showJoinCode(): void {
        let mazeUrl = this.getUrl();

        this.$uibModal.open({
            templateUrl: 'qr-modal.html',
            size: 'lg',
            controllerAs: '$modal',
            controller($uibModalInstance: any) {
                this.url = mazeUrl;
                this.done = () => $uibModalInstance.dismiss('cancel');
            }
        })
    }

    private getUrl(): string {
        let mazeId = this.maze.id,
            scheme = window.location.protocol,
            host = window.location.host;
        return `${scheme}//${host}/#/m/${mazeId}`;
    }
}

angular.module('app.maze').controller('playMazeCtrl', PlayMazeCtrl);