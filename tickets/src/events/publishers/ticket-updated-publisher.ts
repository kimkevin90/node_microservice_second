import { Publisher, Subjects, TicketUpdatedEvent } from '@jsk8stickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
