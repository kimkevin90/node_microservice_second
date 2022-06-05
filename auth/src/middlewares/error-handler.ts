import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

/*
{
    errors: {
        message: string, field?: string
    }[]
}
*/
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  /*
  // Custeom Error 전환 전
  if (err instanceof RequestValidationError) {
    // const formattedErrors = err.errors.map((error) => {
    //   // 전달받은 ValidationError 구조 통일
    //   return { message: error.msg, field: error.param };
    // });
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  if (err instanceof DatabaseConnectionError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  */

  if (err instanceof CustomError) {
    // console.error(err);
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  res.status(400).send({ errors: [{ message: '어딘가 오류났는데 모르겠어..' }] });
};
