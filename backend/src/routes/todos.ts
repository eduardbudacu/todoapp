import { Router, type Request, type Response, type RequestHandler } from 'express';
import { myDataSource } from '../database';
import { Todo } from '../entities/todo';
import { findAllTodos, findTodoById } from '../services/todos';

const todos = Router();

type LoggedInRequest = Request & { user: { id: string } };

todos.get('/todos', (async (req: LoggedInRequest, res: Response) => {
  const todoItems = await findAllTodos(req.user.id);
  res.status(200).json(todoItems);
}) as RequestHandler);

todos.post('/todos', (async (req: LoggedInRequest, res: Response) => {
  const todoItem = {
    description: req.body.description,
    user: {
      id: req.user.id
    }
  };
  const todo = myDataSource.getRepository(Todo).create(todoItem);
  const result = await myDataSource.getRepository(Todo).save(todo);
  if (result === null) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
  res.status(201).json(result);
}) as RequestHandler);

todos.patch('/todos/:id', (async (req: LoggedInRequest, res: Response) => {
  const todoItem = await findTodoById(req.params.id, req.user.id);
  if (todoItem === null) {
    res.status(404).json({ message: 'Todo item not found' });
    return;
  }
  const keys = ['description', 'dueDate', 'completed'];
  for (const key of keys) {
    if (req.body[key] !== undefined) {
      todoItem[key] = req.body[key];
    }
  }
  const result = await myDataSource.getRepository(Todo).save(todoItem);
  res.status(200).json(result);
}) as RequestHandler);

todos.delete('/todos/:id', (async (req: LoggedInRequest, res: Response) => {
  const todoItem = await findTodoById(req.params.id, req.user.id);
  if (todoItem === null) {
    res.status(404).json({ message: 'Todo item not found' });
    return;
  }
  await myDataSource.getRepository(Todo).softRemove(todoItem);
  res.status(204).end();
}) as RequestHandler);

export default todos;
