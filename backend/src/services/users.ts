import { myDataSource } from '../database';
import { User } from '../entities/user';

interface UserRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

const findUserByEmail = async (email: string): Promise<User | null> => {
  return await myDataSource.getRepository(User).findOneBy({
    email
  });
};

const createUser = async (userData: UserRequest): Promise<User> => {
  const user = myDataSource.getRepository(User).create(userData);
  return await myDataSource.getRepository(User).save(user);
};

export { findUserByEmail, createUser };
