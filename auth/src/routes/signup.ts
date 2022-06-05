import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { User } from '../models/user';
import { validateRequest } from '../middlewares/validate-request';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('이메일을 입력해 주세요.'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('패스워드 4자 및 20자 이하로 입력해 주세요.'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    // validate-request 미들웨어로 대체
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   // 벨리데이터의 에러 전달
    //   throw new RequestValidationError(errors.array());
    // }

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('존재하는 이메일 입니다.');
    }

    const user = User.build({ email, password });
    await user.save();

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      // index.ts에서 실행 시 점검 하므로 !적용
      process.env.JWT_KEY!,
    );

    // base64인코딩 후 { jwt : 'jwt토큰' } session에 저장
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  },
);

export { router as signupRouter };
