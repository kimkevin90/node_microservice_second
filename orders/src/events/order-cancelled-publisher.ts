import { OrderCancelledEvent, Publisher, Subjects } from '@jsk8stickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
