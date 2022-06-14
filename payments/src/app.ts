import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@jsk8stickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  }),
);

// 티켓 라우터 사용자 인증 검사(requireAuth)를 위해 currentUser 미들웨어 적용
app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async (req, res, next) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
