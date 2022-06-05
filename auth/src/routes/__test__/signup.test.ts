import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return (
    request(app)
      .post('/api/users/signup')
      // body
      .send({
        email: 'test@test.com',
        password: 'password',
      })
      .expect(201)
  );
});

it('returns a 400 with an invalid email', async () => {
  return (
    request(app)
      .post('/api/users/signup')
      // body
      .send({
        email: 'tesfd',
        password: 'password',
      })
      .expect(400)
  );
});

it('returns a 400 with an invalid password', async () => {
  return (
    request(app)
      .post('/api/users/signup')
      // body
      .send({
        email: 'tesfd@tst.com',
        password: 'p',
      })
      .expect(400)
  );
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    // body
    .send({})
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    // body
    .send({
      email: 'hi',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    // body
    .send({
      password: 'hi',
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

// set 쿠키 적용
it('sets a cookie after successful singup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  /*
  coockieSession의 옵션 중 secure:true는 http 커넥션에 쿠키를 적용
  하므로 일반적으로 test에서는 res에 undefined 반환
  secure: process.env.NODE_ENV !== 'test' 적용필요
  */
  expect(res.get('Set-Cookie')).toBeDefined();
});
