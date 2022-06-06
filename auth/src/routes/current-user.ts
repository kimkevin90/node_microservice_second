import express from 'express';

import { currentUser } from '@jsk8stickets/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  /* 
  다른 서비스에도 쉽게 적용하기 위해 currentUser 미들웨어 생성
    
  current-user 미들웨어 적용 전
   if (!req.session?.jwt) {
    // 비로그인 처리
    return res.send({ currentUser: null });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    // 로그인 처리
    res.send({ currentUser: payload });
  } catch (err) {
    // 비로그인 처리
    res.send({ currentUser: null });
  }
  */

  // sesson 없거나 혹은 jwt 오류 있을 시 null
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
