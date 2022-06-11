import { OrderCreatedEvent, Publisher, Subjects } from '@jsk8stickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
