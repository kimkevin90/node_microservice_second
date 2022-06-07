import { Publisher } from './base-publisher';
import { Subjects } from './subject';
import { TicketCreatedEvent } from './ticket-created-event';
import { TicketCreatedListener } from './ticket-created-listener';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
