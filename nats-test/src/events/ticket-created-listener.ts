import { Message } from 'node-nats-streaming';
import { Listenr } from './base-listener';

export class TicketCreatedListener extends Listenr {
  subject = 'ticket:created';
  queueGroupName = 'payment-service';

  onMessage(data: any, msg: Message) {
    console.log('Event Data!', data);

    msg.ack();
  }
}
