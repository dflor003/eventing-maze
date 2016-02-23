/// <reference path="../express/express.d.ts" />

declare module 'browserify-middleware' {
    import {RequestHandler} from 'express';

    interface IBrowserifyOptions {
        cache?: boolean|string|number;
        precompile?: boolean;
        minify?: boolean;
        gzip?: boolean;
        debug?: boolean;
        transform?: any[];
    }

    interface IBrowserifyStatic {
        (file: string, options?: IBrowserifyOptions): RequestHandler;
        settings: {
            production: IBrowserifySettings;
            development: IBrowserifySettings;
            (key: string, value: any): void;
            (opts: IBrowserifyOptions): void;
        };
    }

    interface IBrowserifySettings {
        (key: string, value: any): void;
        (opts: IBrowserifyOptions): void;
    }

    var browserify: IBrowserifyStatic;

    export = browserify;
}