import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

// session 토큰 확인 & payload 확인 실패 시, currentUser null 반환에 따른 후속 미들웨어
// 경로접근 막기
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};
