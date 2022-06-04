import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  res.send('안녕!');
});

export { router as currentUserRouter };
