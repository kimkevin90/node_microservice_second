import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@jsk8stickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
