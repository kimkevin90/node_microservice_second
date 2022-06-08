import mongoose from 'mongoose';

import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const startApp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY muste be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI muste be defined');
  }

  try {
    await natsWrapper.connect('ticketing', 'random', 'http://nats-srv:4222');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB For TicketService');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening 3000 PORT3!!');
  });
};

startApp();
