import { Publisher, Subjects, TicketCreatedEvent } from '@jsk8stickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
