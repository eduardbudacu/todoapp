import { type Request, type Response, type RequestHandler } from 'express';
import { type User } from '../entities/user';
import { hashPassword, comparePasswords, createJWT } from '../modules/auth';
import { createUser, findUserByEmail } from '../services/users';

export const login: RequestHandler = async (req: Request, res: Response) => {
  if (req.body.email === undefined || req.body.password === undefined) {
    res.status(400).json({ message: 'Invalid credentials prvided' });
    return;
  }
  const results = await findUserByEmail(req.body.email);
  if (results !== null) {
    try {
      const result = await comparePasswords(req.body.password, results.password);
      if (result) {
        const response = {
          token: createJWT(results)
        };
        res.status(200).json(response);
      } else {
        throw Error('Invalid password');
      }
    } catch (err) {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

export const register: RequestHandler = async (req: Request, res: Response) => {
  const userExists = await findUserByEmail(req.body.email);
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
  try {
    const result: User = await createUser(userData);
    const response = {
      id: result.id,
      firstName: result.firstName,
      lastName: result.lastName,
      email: result.email
    };
    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};
