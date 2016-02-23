import {MazeService} from './maze-admin/maze-service';
require('./maze-admin/module');

let module = angular.module('app', ['app.mazeAdmin', 'ngRoute']);

module
    .config(['$routeProvider', ($routeProvider: ng.route.IRouteProvider) => {
        $routeProvider
            .when('/mazes', {
                templateUrl: 'app/maze-admin/maze-list.html',
                controller: 'mazeListCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    mazes(mazeService: MazeService) {
                        return mazeService.getAll();
                    }
                }
            })
            .when('/mazes/new', {
                templateUrl: 'app/maze-admin/create-maze.html',
                controller: 'createMazeCtrl',
                controllerAs: 'ctrl',
            })
            .when('/mazes/:mazeId', {
                templateUrl: 'app/maze-admin/play-maze.html',
                controller: 'playMazeCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    maze($route: ng.route.IRouteService, mazeService: MazeService) {
                        let mazeId = $route.current.params.mazeId;
                        return mazeService.getMaze(mazeId);
                    }
                }
            })
            .when('/m/:mazeId', {
                templateUrl: 'app/maze-admin/control-maze.html',
                controller: 'mazeControlCtrl',
                controllerAs: 'ctrl',
            })
            .otherwise({
                redirectTo: '/mazes'
            });
    }]);