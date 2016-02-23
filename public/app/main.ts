import {generateMaze} from './maze-generator';
import {loadAssets, renderMaze} from "./maze-renderer";

$(function () {
    var maze = generateMaze(20, 18);

    var $main = $('#maze-container');
    loadAssets(function () {
        var runner = renderMaze($main[0], maze);
        runner.start();
    });
});