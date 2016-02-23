'use strict';
import {MazeService} from './maze-service';

export class CreateMazeCtrl {
    private mazeService: MazeService;
    private $location: ng.ILocationService;

    name = '';
    width = 10;
    height = 10;

    constructor($location: ng.ILocationService, mazeService: MazeService){
        this.$location = $location;
        this.mazeService = mazeService;
    }

    save(): void {
        this.mazeService.createMaze(this.name, this.width, this.height)
            .then(x => this.$location.path(`/mazes/${x.id}`))
            .catch(err => alert('Error creating maze!'));
    }
}

angular.module('app.mazeAdmin').controller('createMazeCtrl', CreateMazeCtrl);