import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app } from '../app';

// 테스트 시, cookie 얻기 위해 사용
declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper');

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
  // jset mockImplementation 초기화
  jest.clearAllMocks();
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

global.signin = () => {
  const payload = {
    // signin 두개 들어가는 테스트에서 각기다른 사용자로 페이크 처리
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  const token = jwt.sign(payload, process.env.JWT_KEY!);

  const session = { jwt: token };

  // session JSON 적용
  const sessionJSON = JSON.stringify(session);

  // JSON Base64 인코딩 적용
  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
};
