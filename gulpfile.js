'use strict';

let Promise = require('bluebird');
let gulp = require('gulp');
let gutil = require('gulp-util');
let path = require('path');
let ts = require('gulp-typescript');
let del = require('del');
let runSequence = require('run-sequence');
let tsd = require('gulp-tsd');
let bower = require('gulp-bower');

/**
 * Default gulp task. Runs build and test.
 */
gulp.task('default', (done) => {
    return runSequence(
        'clean',
        'build',
        done
    );
});

/**
 * Clean all generated code files and other build artifacts.
 */
gulp.task('clean', () => {
    banner('Cleaning build artifacts');

    return Promise.all([
        del('./src/**/*.js'),
        del('./src/**/*.js.map'),
        del('./public/app/**/*.js'),
        del('./public/app/**/*.js.map'),
    ]);
});

/**
 * Build the project by compiling all typescript files.
 */
gulp.task('build', () => {
    banner('Compiling TypeScript Files');

    let project = ts.createProject('./tsconfig.json');
    let result = project
        .src()
        .pipe(ts(project));

    return Promise.all([
            asPromise(result.js.pipe(gulp.dest('./'))),
        ])
        .then(() => log('Done compiling TypeScript files!'))
        .catch(() => error('Failed to compile TypeScript files!'));
});

/**
 * Pull TypeScript typings from DefinitelyTyped.
 */
gulp.task('typings', (done) => {
    banner('Pulling TypeScript Typings');

    tsd({
        command: 'reinstall',
        config: './tsd.json'
    }, done);
});

/**
 * Build the project by compiling all typescript files.
 */
gulp.task('bower', () => {
    banner('Pulling client-side dependencies');
    return bower();
});

/* Helpers */
function log() {
    gutil.log.apply(gutil.log, arguments);
}

function error() {
    let args = Array.prototype.slice.call(arguments, 0).map(arg => gutil.colors.bold.red(arg));
    log.apply(null, args);
}

function asPromise(stream) {
    return new Promise((resolve, reject) => {
        stream
            .on('error', reject)
            .on('end', resolve);
    });
}

function banner(message) {
    log('===========================================================');
    log(message);
    log('===========================================================');
    log('');
}