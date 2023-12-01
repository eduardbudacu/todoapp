import { Router, type Request, type Response, type RequestHandler } from 'express';
import { User } from '../entities/user';
import { myDataSource } from '../database';
import { hashPassword, comparePasswords, createJWT } from '../modules/auth';
const auth = Router();

auth.post('/login', (async (req: Request, res: Response) => {
  const results = await myDataSource.getRepository(User).findOneBy({
    email: req.body.email
  });
  if (results !== null) {
    if (comparePasswords(req.body.password, results.password)) {
      const response = {
        token: createJWT(results)
      };
      res.status(200).json(response);
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}) as RequestHandler);

auth.post('/users', (async (req: Request, res: Response) => {
  const userExists = await myDataSource.getRepository(User).findOneBy({
    email: req.body.email
  });
  if (userExists !== null) {
    res.status(409).json({ message: 'User already exists' });
    return;
  };
  const userData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: await hashPassword(req.body.password)
  };
  const user = myDataSource.getRepository(User).create(userData);
  const results = await myDataSource.getRepository(User).save(user);
  const response = {
    id: results.id,
    firstName: results.firstName,
    lastName: results.lastName,
    email: results.email
  };
  return res.status(201).send(response);
}) as RequestHandler);

export default auth;
