import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Todo } from './todo';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column()
    firstName: string;

  @Column()
    lastName: string;

  @Column()
    email: string;

  @Column()
    password: string;

  @OneToMany(() => Todo, todo => todo.user)
    todos: Todo[];
}
