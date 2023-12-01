import { myDataSource } from '../database';
import { Todo } from '../entities/todo';
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
    }
  });
};

export { findTodoById, findAllTodos };
