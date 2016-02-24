import {MazeService} from './maze-admin/maze-service';
require('./maze-admin/module');
require('./maze-control/module');
require('./maze/module');

let module = angular.module('app', ['ngRoute', 'ui.bootstrap', 'ja.qr', 'app.mazeAdmin', 'app.maze', 'app.mazeControl']);

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
                templateUrl: 'app/maze/play-maze.html',
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
                templateUrl: 'app/maze-control/control-maze.html',
                controller: 'controlMazeCtrl',
                controllerAs: 'ctrl',
                resolve: {
                    mazeId($route: ng.route.IRouteService) {
                        let mazeId = $route.current.params.mazeId;
                        return mazeId;
                    }
                }
            })
            .otherwise({
                redirectTo: '/mazes'
            });
    }]);