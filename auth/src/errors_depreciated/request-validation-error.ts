import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

// 인터페이스 사용을 통해 serializeErrors에 msge로 잘못작성 오류 잡아준다.
// interface CustomError {
//   statusCode: number;
//   serializeErrors(): {
//     message: string;
//     field?: string;
//   }[];
// }

// 추상클래스 적용
export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // built in class extending
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
