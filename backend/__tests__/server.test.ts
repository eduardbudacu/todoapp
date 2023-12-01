import app from '../src/server';
import request from 'supertest';
jest.mock('uuid');

describe('test app', () => {
  it('should respond with 404 for non existing endpoint', async () => {
    await request(app)
      .get('/not-available')
      .expect(404);
  });

  it('should respond with 200 for login endpoint', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'eduard.budacu@gmail.com',
        password: '1234'
      })
      .expect(200);
    expect(response.body.token).toBe('abcd');
  });

  it('should retrieve a list of todos', async () => {
    const response = await request(app)
      .get('/todos')
      .expect(200);
    expect(response.body.length).toBe(3);
    expect(response.body[0].id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(response.body[0].description).toBe('Connect bank account');
    expect(response.body[0].dueDate).toBe('2023-12-10T12:00:00');
    expect(response.body[0].deleted).toBe(false);
    expect(response.body[0].completed).toBe(false);
  });

  it('should add a new todo', async () => {
    const response = await request(app)
      .post('/todos')
      .send({
        description: 'Upload product inventory',
        dueDate: '2023-12-10T12:00:00',
        completed: false
      })
      .expect(201);
    expect(response.body.id).toBe('123e4567-e89b-12d3-a456-426614174004');
    expect(response.body.description).toBe('Upload product inventory');
    expect(response.body.dueDate).toBe('2023-12-10T12:00:00');
    expect(response.body.deleted).toBe(false);
    expect(response.body.completed).toBe(false);
  });

  it('should update description for a todo', async () => {
    const response = await request(app)
      .patch('/todos/123e4567-e89b-12d3-a456-426614174001')
      .send({
        description: 'Create account for HR'
      })
      .expect(200);
    expect(response.body.description).toBe('Create account for HR');
  });

  it('should update due date for a todo', async () => {
    const response = await request(app)
      .patch('/todos/123e4567-e89b-12d3-a456-426614174001')
      .send({
        dueDate: '2023-12-31T12:00:00'
      })
      .expect(200);
    expect(response.body.dueDate).toBe('2023-12-31T12:00:00');
  });

  it('should mark todo as completed', async () => {
    const response = await request(app)
      .patch('/todos/123e4567-e89b-12d3-a456-426614174001')
      .send({
        completed: true
      })
      .expect(200);
    expect(response.body.completed).toBe(true);
  });

  it('should respond with 404 when updated item doesnt exists', async () => {
    const response = await request(app)
      .patch('/todos/123e4567-e89b-12d3-a456-426614174009')
      .send({
        dueDate: '2023-12-31T12:00:00'
      })
      .expect(404);
  });

  it('should delete a todo', async () => {
    const response = await request(app)
      .delete('/todos/123e4567-e89b-12d3-a456-426614174001')
      .expect(204);
  });

  it('should respond with 404 when deleting item that doesnt exists', async () => {
    const response = await request(app)
      .delete('/todos/123e4567-e89b-12d3-a456-426614174009')
      .expect(404);
  });
});
