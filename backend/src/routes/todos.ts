import { Router } from 'express';

import { getTodos, postTodo, patchTodo, deleteTodo } from '../controllers/todos';

const todos = Router();

todos.get('/todos', getTodos);
todos.post('/todos', postTodo);
todos.patch('/todos/:id', patchTodo);
todos.delete('/todos/:id', deleteTodo);

export default todos;
