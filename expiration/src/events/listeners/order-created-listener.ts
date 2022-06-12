import { Listener, OrderCreatedEvent, Subjects } from '@jsk8stickets/common';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queue/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process the job:', delay);

    // 15분 후  expirationQueue.process에 orderId 전달
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: 5000,
      },
    );

    msg.ack();
  }
}
