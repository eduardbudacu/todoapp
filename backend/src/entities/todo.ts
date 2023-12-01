import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from './user';
@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn('uuid')
    id: string;

  @Column({ type: 'text', nullable: false })
    description: string;

  @Column({ type: 'timestamp', nullable: true })
    dueDate: Date;

  @Column({ type: 'boolean', default: false })
    completed: boolean;

  @CreateDateColumn()
    createdAt: Date;

  @UpdateDateColumn()
    updatedAt: Date;

  @DeleteDateColumn()
    deletedAt?: Date;

  @ManyToOne(() => User, user => user.todos)
    user: User;
}
