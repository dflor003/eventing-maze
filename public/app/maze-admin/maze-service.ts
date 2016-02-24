'use strict';

import IHttpPromise = angular.IHttpPromise;
import {IMazeData} from '../maze/models/maze';

export class MazeService {
    private $http: angular.IHttpService;

    constructor($http: angular.IHttpService) {
        this.$http = $http;
    }

    createMaze(mazeName: string, width: number, height: number): ng.IPromise<IMazeData> {
        return this.$http.post<IMazeData>('/api/mazes', {
            name: mazeName,
            width: width,
            height: height
        }).then(x => x.data);
    }

    getMaze(id: string): ng.IPromise<IMazeData> {
        return this.$http.get<IMazeData>(`/api/mazes/${id}`)
            .then(x => x.data);
    }

    getAll(): ng.IPromise<IMazeData[]> {
        return this.$http.get<IMazeData[]>('/api/mazes')
            .then(x => x.data);
    }

    move(mazeId: string, direction: string): ng.IPromise<any> {
        return this.$http.post(`/api/mazes/${mazeId}/moves`, {
            direction: direction
        }).then(x => x.data);
    }
}

angular.module('app.mazeAdmin').service('mazeService', MazeService);