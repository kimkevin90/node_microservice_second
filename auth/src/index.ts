import mongoose from 'mongoose';

import { app } from './app';

const startApp = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY muste be defined');
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening 3000 PORT3!!');
  });
};

startApp();
