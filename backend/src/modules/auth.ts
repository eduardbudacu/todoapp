import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { type User } from '../entities/user';

export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result: boolean) {
      if (err !== undefined) {
        reject(err);
      }
      resolve(result);
    });
  });
};

export const hashPassword = async (password): Promise<string> => {
  return bcrypt.hash(password, 5);
};

export const createJWT = (user: User): string => {
  const token = jwt.sign({
    id: user.id,
    email: user.email
  },
  process.env.JWT_SECRET
  );
  return token;
};

export const protect = (req, res, next): void => {
  const bearer = req.headers.authorization;

  if (bearer === undefined) {
    res.status(401);
    res.json({ message: 'not authorized' });
    return;
  }

  const [, token] = bearer.split(' ');

  if (token === undefined) {
    res.status(401);
    res.json({ message: 'not valid token' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (e) {
    console.error(e);
    res.status(401);
    res.json({ message: 'not valid token' });
  }
};
