import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

// 테스트 시, cookie 얻기 위해 사용
declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
// 테스트 실행 전 설정
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';

  mongo = await MongoMemoryServer.create();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri);
});

// 각 테스트 실행 전
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  // 데이터 삭제
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app).post('/api/users/signup').send({ email, password }).expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
};
