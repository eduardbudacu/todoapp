import { type Todo } from '../entities/todo';
import { findAllTodos, findTodoById, createTodo, saveTodo, softRemoveTodo } from '../services/todos';
import { type RequestHandler, type Request, type Response } from 'express';

type LoggedInRequest = Request & { user: { id: string } };

interface TodoResponse {
  id: string
  description: string
  completed: boolean
  dueDate?: string
  createdAt: string
  updatedAt: string
}

const todoResponse = (todo: Todo): TodoResponse => {
  return {
    id: todo.id,
    description: todo.description,
    completed: todo.completed,
    dueDate: todo.dueDate === null ? undefined : todo.dueDate.toISOString(),
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString()
  };
};

export const getTodos: RequestHandler = async (req: LoggedInRequest, res: Response) => {
  try {
    const todoItems = await findAllTodos(req.user.id);
    res.status(200).json(todoItems.map(todoResponse));
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const postTodo: RequestHandler = async (req: LoggedInRequest, res: Response) => {
  const todoItem = {
    description: req.body.description,
    user: {
      id: req.user.id
    }
  };
  try {
    const result = await createTodo(todoItem);
    res.status(201).json(todoResponse(result));
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const patchTodo: RequestHandler = async (req: LoggedInRequest, res: Response) => {
  const todoItem: Todo | null = await findTodoById(req.params.id, req.user.id);
  if (todoItem === null) {
    res.status(404).json({ message: 'Todo item not found' });
    return;
  }
  const keys = ['description', 'dueDate', 'completed'];
  let changes = 0;
  for (const key of keys) {
    if (req.body[key] !== undefined) {
      todoItem[key] = req.body[key];
      changes++;
    }
  }
  if (changes > 0) {
    try {
      const result = await saveTodo(todoItem);
      res.status(200).json(todoResponse(result));
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(400).json({ message: 'Invalid keys provided' });
  }
};

export const deleteTodo: RequestHandler = async (req: LoggedInRequest, res: Response) => {
  const todoItem: Todo | null = await findTodoById(req.params.id, req.user.id);
  if (todoItem === null) {
    res.status(404).json({ message: 'Todo item not found' });
    return;
  }
  await softRemoveTodo(todoItem);
  res.status(204).end();
};
