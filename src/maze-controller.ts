'use strict';

import {Direction} from '../public/app/common/direction';
import {Maze} from '../public/app/maze/models/maze';
import {Request, Response} from 'express';
import {Utils} from '../public/app/common/utils';
import {generateMaze} from '../public/app/maze/maze-generator';
import {IdGenerator} from '../public/app/common/utils';
import {SocketEmitter} from './socket-emitter';

export class MazeStorage {
    private mazes: {[key:string]: Maze} = {};

    save(id: string, maze: Maze): void {
        this.mazes[id] = maze;
    }

    get(id: string): Maze {
        return this.mazes[id];
    }

    getAll(): Maze[] {
        let results: Maze[] = [];
        for(let prop in this.mazes) {
            if(this.mazes.hasOwnProperty(prop)) {
                results.push(this.mazes[prop]);
            }
        }

        return results;
    }

    exists(id: string): boolean {
        return !!this.mazes[id];
    }
}

export class MazeController {
    private storage = new MazeStorage();

    newMaze(req: Request, res: Response, next: Function): void {
        if (!req.body) {
            res.sendStatus(400);
            return;
        }

        let width = req.body.width,
            height = req.body.height,
            name = req.body.name,
            id = this.getMazeId();

        let maze = generateMaze(id, name, width, height);
        this.storage.save(id, maze);

        res.status(201).json(maze.toData());
    }

    getAll(req: Request, res: Response, next: Function): void {
        let mazes = this.storage.getAll().map(maze => ({
            id: maze.id,
            width: maze.width,
            height: maze.height,
            name: maze.name,
        }));
        res.json(mazes);
    }

    getMaze(req: Request, res: Response, next: Function): void {
        let id = req.param('id');
        if (!id) {
            res.sendStatus(400);
            return;
        }
        if (!this.storage.exists(id)){
            res.sendStatus(404);
            return;
        }

        let maze = this.storage.get(id);
        res.json(maze.toData());
    }

    moveInMaze(req: Request, res: Response, next: Function): void {
        let id = req.param('id');
        if (!id) {
            res.sendStatus(400);
            return;
        }
        if (!this.storage.exists(id)){
            res.sendStatus(404);
            return;
        }

        let body = req.body || {},
            directionName = body.direction;

        if (!directionName) {
            res.status(400).json({
                message: `Missing 'direction' from body`
            });
            return;
        }

        let direction = Direction.fromName(directionName);
        SocketEmitter.instance.broadcast(id, 'move', { direction: direction.name() });
        res.sendStatus(204);
    }

    private getMazeId(): string {
        let id = IdGenerator.nextId();
        while (this.storage.exists(id)) {
            id = IdGenerator.nextId();
        }

        return id;
    }
}