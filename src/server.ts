'use strict';
import * as express from 'express';
import * as favicon from 'serve-favicon';
import * as path from 'path';
import * as logger from 'morgan';
import * as debug from 'debug';
import * as http from 'http';
import {Request, Response} from 'express';
import * as browserify from 'browserify-middleware';

function start(workingDir?: string): void {
    // Setup
    let app = express(),
        serverPort = 3000;
    workingDir = workingDir || __dirname;

    // View Engine setup
    app.set('views', path.join(workingDir, 'views'));
    app.set('view engine', 'jade');

    // Configuration
    app.use(favicon(workingDir + '/public/assets/favicon.ico'));
    app.use(logger('dev'));
    app.use(require('less-middleware')(path.join(workingDir, 'public'), {
        force: true,
        debug: true,
    }));
    app.use(express.static(path.join(workingDir, 'public')));
    app.get('/bundles/app.js', browserify(path.join(workingDir, 'public/app/main.js'), {
        transform: [
            ['babelify', {presets: ['es2015']}]
        ]
    }));

    // Routes
    app.get('/', (req: Request, res: Response) => res.render('layout', {}));

    // Error handlers
    app.use((req: Request, res: Response, next: Function) => {
        var message = `Could not find resource: ${req.url}`,
            err = new Error(message);
        err['status'] = 404;
        next(err);
    });

    app.use((err: Error, req: Request, res: Response) => {
        res.status(err['status'] || 500);
        res.render('error', {
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
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
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
}
start(path.join(__dirname, '../'));