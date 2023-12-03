import { type User } from '../../src/entities/user';
import { comparePasswords, hashPassword, createJWT } from '../../src/modules/auth';
import jwt from 'jsonwebtoken';

describe('test authentication utilities', () => {
  it('should compare passwords', async () => {
    const password = '#Pass123';
    const hashedPassword = '$2b$05$bBS.yHOWnuNNcwN4JmQESOZQb/G3VtvjuCBV7ZlEUiLpdFj9.CR.y';
    expect(await comparePasswords(password, hashedPassword)).toBeTruthy();
  });

  it('should reject invalid passwords', async () => {
    const password = '#Pass';
    const hashedPassword = '$2b$05$bBS.yHOWnuNNcwN4JmQESOZQb/G3VtvjuCBV7ZlEUiLpdFj9.CR.y';
    expect(await comparePasswords(password, hashedPassword)).toBeFalsy();
  });

  it('should reject error', async () => {
    const password = '';
    const hashedPassword = '';
    expect(await comparePasswords(password, hashedPassword)).toBeFalsy();
  });

  it('should hash password', async () => {
    const password = '#Pass123';
    expect((await hashPassword(password))[0]).toBe('$');
  });

  it('should sign JWT', () => {
    const OLD_JWT_SECRET = process.env.JWT_SECRET;
    process.env.JWT_SECRET = 'test';
    const user: User = {
      id: '1234',
      email: 'eduard.budacu@gmail.com',
      firstName: 'Eduard',
      lastName: 'Budacu',
      password: 'test',
      todos: []
    };
    const token = createJWT(user);
    expect(token).toBeDefined();
    const data = jwt.verify(token, 'test');
    expect(data.id).toBe(user.id);
    expect(data.email).toBe(user.email);
    process.env.JWT_SECRET = OLD_JWT_SECRET;
  });
});
