import app from '../src/server';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const todos = [
  {
    id: '7797fb3e-0b10-4d89-b5f8-ebc791c312ea',
    description: 'update inventory system',
    completed: false,
    dueDate: null,
    createdAt: new Date('2023-12-03T19:15:41.622Z'),
    updatedAt: new Date('2023-12-03T19:15:41.622Z')
  },
  {
    id: '8be3c3dc-85d9-4645-a819-c58a060880ca',
    description: 'configure hr software',
    completed: true,
    dueDate: new Date('2023-12-04T13:00:00.000Z'),
    createdAt: new Date('2023-12-03T18:55:48.201Z'),
    updatedAt: new Date('2023-12-03T19:15:05.000Z')
  },
  {
    id: '7cc47f35-c6cc-4d9d-9e97-2d401235948b',
    description: 'connect bank account',
    completed: false,
    dueDate: null,
    createdAt: new Date('2023-12-03T18:55:35.074Z'),
    updatedAt: new Date('2023-12-03T18:55:35.074Z')
  }
];

jest.mock('uuid');
jest.mock('typeorm', () => {
  return {
    ...(jest.requireActual('typeorm')),
    DataSource: jest.fn().mockImplementation(() => ({
      initialize: jest.fn().mockResolvedValue(true),
      getRepository: jest.fn().mockImplementation(() => ({
        find: jest.fn().mockResolvedValue(todos),
        findOneBy: jest.fn(async (criteria) => {
          if (criteria.id === '1') {
            return await Promise.resolve({
              id: 'xyz'
            });
          }
          return await Promise.resolve(null);
        }),
        findOne: jest.fn(async (criteria) => {
          const todo = todos.find(el => el.id === criteria.where.id);
          return await Promise.resolve(todo ?? null);
        }),
        create: jest.fn().mockImplementation((todo) => todo),
        save: jest.fn(async (todo) => {
          if (todo.description === 'throwerr') {
            throw new Error('error');
          }
          return await Promise.resolve({
            id: '7cc47f35-c6cc-4d9d-9e97-2d401235948b',
            description: todo.description,
            completed: false,
            dueDate: null,
            createdAt: new Date('2023-12-03T18:55:35.074Z'),
            updatedAt: new Date('2023-12-03T18:55:35.074Z')
          });
        }),
        softRemove: jest.fn().mockResolvedValue(true)
      }))
    }))
  };
});

describe('test todos module', () => {
  it('should respond with 401 when token is not passed', async () => {
    const response = await request(app)
      .get('/api/todos')
      .expect(401);
    expect(response.body.message).toBe('not authorized');
  });
  it('should respond with 401 when invalid token is passed', async () => {
    const response = await request(app)
      .get('/api/todos')
      .set('Authorization', 'Bearer')
      .expect(401);
    expect(response.body.message).toBe('invalid token');
  });
  it('should respond with 401 when signature validation fails', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation((() => { throw new Error('invalid signature'); }) as any);
    const response = await request(app)
      .get('/api/todos')
      .set('Authorization', 'Bearer yourTokenHere')
      .expect(401);
    expect(response.body.message).toBe('invalid token');
  });
  it('should respond with 200 when token is passed', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' } as any));
    const response = await request(app)
      .get('/api/todos')
      .set('Authorization', 'Bearer yourTokenHere')
      .expect(200);
    expect(response.body.length).toBe(3);
  });
  it('should create a new todo', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' } as any));
    await request(app)
      .post('/api/todos')
      .send({ description: 'test' })
      .set('Authorization', 'Bearer yourTokenHere')
      .expect(201);
  });
  it('should handle error when creating todo', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' } as any));
    await request(app)
      .post('/api/todos')
      .send({ description: 'throwerr' })
      .set('Authorization', 'Bearer yourTokenHere')
      .expect(500);
  });
  it('should update a todo', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' } as any));
    const response = await request(app)
      .patch('/api/todos/7797fb3e-0b10-4d89-b5f8-ebc791c312ea')
      .send({ description: 'test' })
      .set('Authorization', 'Bearer yourTokenHere')
      .expect(200);
    expect(response.body.description).toBe('test');
  });
  it('should handle bad keys when updating', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' } as any));
    const response = await request(app)
      .patch('/api/todos/7797fb3e-0b10-4d89-b5f8-ebc791c312ea')
      .send({ desc: 'test' })
      .set('Authorization', 'Bearer yourTokenHere')
      .expect(400);
    expect(response.body.message).toBe('Invalid keys provided');
  });
  it('should handle update error', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' } as any));
    const response = await request(app)
      .patch('/api/todos/7797fb3e-0b10-4d89-b5f8-ebc791c312ea')
      .send({ description: 'throwerr' })
      .set('Authorization', 'Bearer yourTokenHere')
      .expect(500);
    expect(response.body.message).toBe('Internal server error');
  });
  it('should return 404 when updating unexistent todo', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' } as any));
    await request(app)
      .patch('/api/todos/notavailable')
      .send({ description: 'test' })
      .set('Authorization', 'Bearer yourTokenHere')
      .expect(404);
  });
  it('should delete todo by id', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' } as any));
    await request(app)
      .delete('/api/todos/7797fb3e-0b10-4d89-b5f8-ebc791c312ea')
      .set('Authorization', 'Bearer yourTokenHere')
      .expect(204);
  });
  it('should respond with 404 when deleting unexistent todo', async () => {
    jest.spyOn(jwt, 'verify').mockImplementation(() => ({ id: '123' } as any));
    await request(app)
      .delete('/api/todos/notavailable')
      .set('Authorization', 'Bearer yourTokenHere')
      .expect(404);
  });
});
