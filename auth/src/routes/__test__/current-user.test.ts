import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
  /*
  res.body-- { currentUser: null } 로 반환 ~ 쿠키가 전송되지 않기 떄문에 쿠키 set 필요
  1) 강제로 signup 후 쿠키 받아오기 ~ 모든 다른 서비스 테스트도 signup 진행해야하는 문제 발생
  2) global signin 생성 후 적용
  */

  /* 1)
  const authRes = await request(app)
  .post('/api/users/signup')
  .send({
    email: 'test@test.com',
    password: 'password',
  })
  .expect(201);
  const cookie = authRes.get('Set-Cookie');
  */

  // 2)
  const cookie = await global.signin();

  const res = await request(app).get('/api/users/currentuser').set('Cookie', cookie).send().expect(200);

  expect(res.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app).get('/api/users/currentuser').send().expect(200);

  expect(response.body.currentUser).toEqual(null);
});
