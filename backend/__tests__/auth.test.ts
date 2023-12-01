import app from '../src/server';
import request from 'supertest';
import bcrypt from 'bcrypt';
import * as auth from '../src/modules/auth';

jest.mock('uuid');
jest.mock('typeorm', () => {
  return {
    ...(jest.requireActual('typeorm')),
    DataSource: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue(true),
      getRepository: jest.fn().mockImplementation(() => ({
        findOneBy: jest.fn(async (criteria) => {
          if (criteria.email === 'eduard.budacu@gmail.com') {
            return await Promise.resolve({
              id: 'xyz',
              email: 'eduard.budacu@gmail.com',
              password: 'password',
              firstName: 'Eduard',
              lastName: 'Budacu'
            });
          }
          return await Promise.resolve(null); // User not found
        }),
        create: jest.fn().mockImplementation((user) => user),
        save: jest.fn().mockResolvedValue({
          id: 'xyz',
          email: 'eduard@gmail.com',
          firstName: 'Eduard',
          lastName: 'Budacu'
        })
      }))
    }))
  };
});

jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

describe('test auth module', () => {
  it('should respond with 200 for login endpoint', async () => {
    (bcrypt.compare as jest.Mock).mockImplementation((password, hash, callback) => callback(undefined, true));
    jest.spyOn(auth, 'createJWT').mockImplementation(() => 'abcd' as any);
    jest.spyOn(auth, 'comparePasswords').mockImplementation(() => true as any);
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'eduard.budacu@gmail.com',
        password: '#Pass123'
      })
      .expect(200);
    expect(response.body.token).toBe('abcd');
  });

  it('should respond with 401 when password do not match', async () => {
    jest.spyOn(auth, 'comparePasswords').mockImplementation(() => false as any);
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'eduard.budacu@gmail.com',
        password: '#Pass123'
      })
      .expect(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should respond with 401 for login endpoint', async () => {
    (bcrypt.compare as jest.Mock).mockImplementation((password, hash, callback) => callback(undefined, true));
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'eduard@gmail.com',
        password: '#Pass123'
      })
      .expect(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  it('should respond with 409 for existent user', async () => {
    (bcrypt.compare as jest.Mock).mockImplementation((password, hash, callback) => callback(undefined, true));
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'eduard.budacu@gmail.com',
        password: '#Pass123',
        firstName: 'Eduard',
        lastName: 'Budacu'
      })
      .expect(409);
    expect(response.body.message).toBe('User already exists');
  });

  it('should create new user', async () => {
    jest.spyOn(auth, 'hashPassword').mockImplementation(() => 'abc' as any);
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'eduard@gmail.com',
        password: '#Pass123',
        firstName: 'Eduard',
        lastName: 'Budacu'
      })
      .expect(201);
    expect(response.body.id).toBe('xyz');
  });
});
