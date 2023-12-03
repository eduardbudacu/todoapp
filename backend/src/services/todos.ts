import { myDataSource } from '../database';
import { Todo } from '../entities/todo';

interface TodoRequest {
  description: string
}

const findTodoById = async (todoId: string, userId: string): Promise<Todo | null> => {
  return await myDataSource.getRepository(Todo).findOne({
    where: {
      id: todoId,
      user: {
        id: userId
      }
    }
  });
};

const findAllTodos = async (userId: string): Promise<Todo[]> => {
  return await myDataSource.getRepository(Todo).find({
    where: {
      user: {
        id: userId
      }
    },
    order: {
      createdAt: 'DESC'
    }
  });
};

const saveTodo = async (todo: Todo): Promise<Todo> => {
  return await myDataSource.getRepository(Todo).save(todo);
};

const createTodo = async (todoItem: TodoRequest): Promise<Todo> => {
  const todo: Todo = myDataSource.getRepository(Todo).create(todoItem);
  return await saveTodo(todo);
};

const softRemoveTodo = async (todoItem: Todo): Promise<void> => {
  await myDataSource.getRepository(Todo).softRemove(todoItem);
};

export { findTodoById, findAllTodos, saveTodo, createTodo, softRemoveTodo, type TodoRequest };
