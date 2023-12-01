import { Router, type Request, type Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
const todos = Router();

const todoItems = [{
  id: '123e4567-e89b-12d3-a456-426614174000',
  description: 'Connect bank account',
  dueDate: '2023-12-10T12:00:00',
  completed: false,
  deleted: false
}, {
  id: '123e4567-e89b-12d3-a456-426614174001',
  description: 'Configure ERP',
  dueDate: '2023-12-10T12:00:00',
  completed: false,
  deleted: false
}, {
  id: '123e4567-e89b-12d3-a456-426614174002',
  description: 'Setup company details',
  dueDate: '2023-12-10T12:00:00',
  completed: false,
  deleted: false
}];

todos.get('/todos', (req: Request, res: Response) => {
  res.status(200).json(todoItems);
});

todos.post('/todos', (req: Request, res: Response) => {
  const todoItem = req.body;
  todoItem.id = uuidv4();
  todoItem.deleted = false;
  todoItems.push(todoItem);
  res.status(201).json(todoItem);
});

todos.patch('/todos/:id', (req: Request, res: Response) => {
  const todoItem = todoItems.find(item => item.id === req.params.id);
  if (todoItem === undefined) {
    return res.status(404).json({ message: 'Todo item not found' });
  }
  const keys = ['dueDate', 'completed', 'description'];
  for (const key of keys) {
    if (req.body[key] !== undefined) {
      todoItem[key] = req.body[key];
    }
  }
  res.status(200).json(todoItem);
});

todos.delete('/todos/:id', (req: Request, res: Response) => {
  const todoItem = todoItems.find(item => item.id === req.params.id);
  if (todoItem === undefined) {
    return res.status(404).json({ message: 'Todo item not found' });
  }
  todoItem.deleted = true;
  res.status(204).end();
});

export default todos;
