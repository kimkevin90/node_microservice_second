import { CustomError } from './custom-error';

// require-auth 미들웨어에 사용
export class NotAuthorizedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors() {
    return [{ message: 'Not authorized' }];
  }
}
