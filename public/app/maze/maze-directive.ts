'use strict';

import {Utils} from '../common/utils';
import {IMazeData} from './models/maze';
import {Maze} from './models/maze';
import {loadAssets} from './maze-renderer';
import {renderMaze} from './maze-renderer';

class MazeRenderController {
    private maze: Maze;
    private element: ng.IAugmentedJQuery;

    constructor() {
        if (!this.maze) throw new Error('No maze!');
        console.log(this.maze);
    }

    init() {
        if (!this.maze) throw new Error('No maze!');

        Utils.debug('Loading assets...');
        loadAssets(() => {
            Utils.debug('Initializing renderer...');
            let gameManager = renderMaze(this.maze);
            this.element.append(gameManager.canvas);
            Utils.debug('Starting game loop...');
            gameManager.start();
        })
    }
}

function mazeDirective(): ng.IDirective {
    return <ng.IDirective>{
        restrict: 'E',
        scope: {},
        bindToController: {
            maze: '='
        },
        controllerAs: '$ctrl',
        controller: MazeRenderController,
        link($scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: any) {
            ctrl.element = element;
            ctrl.init();
        }
    };
}

angular.module('app.maze').directive('mazeRenderer', mazeDirective);