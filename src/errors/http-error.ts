'use strict';

import {HttpStatus} from '../common/http-status';

export class HttpError extends Error {
    status:HttpStatus;

    constructor(status: HttpStatus, message: string) {
        super(message);

        this.status = status;
    }
}