import { Router, type Request, type Response } from 'express';

const auth = Router();

auth.post('/login', (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).json({
    token: 'abcd'
  });
});

auth.post('/users', (req: Request, res: Response) => {
  console.log(req.body);
  res.status(200).json({
    token: 'abcd'
  });
});

export default auth;
