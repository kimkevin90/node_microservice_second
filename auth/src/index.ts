import mongoose from 'mongoose';

import { app } from './app';

const startApp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY muste be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI muste be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB For Auth Service');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening 3000 PORT3 For Auth Service');
  });
};

startApp();
