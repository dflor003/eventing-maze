'use strict';

import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as path from 'path';
import * as logger from 'morgan';
import * as debug from 'debug';
import * as http from 'http';
import * as browserify from 'browserify-middleware';
import * as bodyParser from 'body-parser';
import * as socketIo from 'socket.io';
import * as uuid from 'node-uuid';
import {Request, Response} from 'express';
import {Utils} from '../public/app/common/utils';
import {MazeApi} from './maze-controller';
import {SocketEmitter} from './socket-emitter';
import {NotFoundError} from './errors/http-errors';

function start(workingDir?: string): void {
    workingDir = workingDir || __dirname;
    // Setup
    let app = express(),
        serverPort = process.env.EVTMAZE_PORT || 3000,
        publicUrl = process.env.EVTMAZE_PUBLIC_URL || `http://localhost:${serverPort}/`

    // View Engine setup
    app.set('views', path.join(workingDir, 'views'));
    app.set('view engine', 'jade');

    // Configuration
    app.disable('etag'); // Disables etags for JSON requests
    app.use(favicon(workingDir + '/public/assets/favicon.ico'));
    app.use(logger('dev'));
    app.use(require('less-middleware')(path.join(workingDir, 'public'), {
        force: true,
        debug: true,
    }));
    app.use(bodyParser.json());
    app.use(express.static(path.join(workingDir, 'public'), { etag: true }));

    // JS Bundles
    app.get('/bundles/app.js', browserify(path.join(workingDir, 'public/app/app.js'), {
        transform: [
            ['babelify', {presets: ['es2015']}]
        ]
    }));

    // Main SPA route
    app.get('/', (req: Request, res: Response) => res.render('layout', {}));

    // APIs
    let apis = [
        new MazeApi()
    ];
    apis.forEach(api => app.use(api.routes()));

    // Error handlers
    app.use((req: Request, res: Response, next: Function) => {
        var message = `Could not find resource: ${req.url}`,
            err = new NotFoundError(message);
        next(err);
    });

    app.use((err: Error, req: Request, res: Response) => {
        let errorId =  uuid.v4();
        res.status(err['status'] || 500);
        res.render('error', {
            id: errorId,
            message: err.message,
            error: err
        });
    });

    // Setup server
    let port = serverPort;
    app.set('port', port);
    let server = http.createServer(app);

    console.log(`Server listening on port ${port}`);
    server.listen(port);
    server.on('error', (error: any) => {
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // Handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                Utils.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                Utils.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });

    server.on('listening', () => {
        var addr = server.address(),
            bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
        debug('Listening on ' + bind);
    });

    let io = socketIo.listen(server);
    io.on('error', err => Utils.error(err));
    SocketEmitter.instance.init(io);
}
start(path.join(__dirname, '../'));