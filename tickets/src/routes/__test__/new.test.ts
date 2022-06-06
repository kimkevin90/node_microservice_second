import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

// 404 - 라우터 없을 시
it('has a route handler listening to /api/tickets for post requests', async () => {
  const res = await request(app).post('/api/tickets').send({});

  expect(res.status).not.toEqual(404);
});

// 비로그인시 401 에러(NotAuthroizedError)
it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', global.signin()).send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'title',
    })
    .expect(400);
});

it('create a ticket with valid inputs', async () => {
  // beforeEach로 모든 데이터 삭제 했으므로
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = 'title';
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual(title);
});
