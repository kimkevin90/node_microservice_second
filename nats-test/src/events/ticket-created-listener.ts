import { Message } from 'node-nats-streaming';
import { Listenr } from './base-listener';
import { Subjects } from './subject';
import { TicketCreatedEvent } from './ticket-created-event';

export class TicketCreatedListener extends Listenr<TicketCreatedEvent> {
  // 추상클래스에 적용한 제네릭 적용 필요
  // 한번더 subject에 타입 정의해준 이유는 추후 변경 불가능하도록 함
  //subject: Subjects.TicketCreated = Subjects.TicketCreated;
  readonly subject = Subjects.TicketCreated;
  queueGroupName = 'payment-service';

  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event Data!', data);
    // data : any로 할경우 property 검증 어려움
    msg.ack();
  }
}
