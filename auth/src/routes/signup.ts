import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('이메일을 입력해 주세요.'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('패스워드 4자 및 20자 이하로 입력해 주세요.'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // 벨리데이터의 에러 전달
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    console.log('유저 생성중');
    throw new DatabaseConnectionError();
    console.log('이상해');
    res.send({});
  },
);

export { router as signupRouter };
