import {HttpError} from './http-error';
import {HttpStatus} from '../common/http-status';

export class NotFoundError extends HttpError{
    constructor(message: string) {
        super(HttpStatus.NotFound, message);
    }
}

export class NoContentError extends HttpError{
    constructor(message: string) {
        super(HttpStatus.NoContent, message);
    }
}