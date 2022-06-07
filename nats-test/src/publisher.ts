import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publishers';

console.clear();

// 클라이언트
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);

  // Publisher class 메소드 publish에 promise 적용했으므로 error 체크
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }
});
