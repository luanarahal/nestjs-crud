import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from 'src/entity/Todo.entity';
import {
  DeleteResult,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
export interface TodoInterface {
  id?: number;
  name: string;
  complete: boolean;
}
@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<TodoInterface>,
  ) {}
  create(todo: TodoInterface): Promise<TodoInterface> {
    return this.todoRepository.save(this.todoRepository.create(todo));
  }
  findAll(): Promise<TodoInterface[]> {
    return this.todoRepository.find();
  }
  findOne(id: number): Promise<TodoInterface> {
    const options: FindOneOptions<TodoInterface> = { where: { id } };
    return this.todoRepository.findOne(options);
  }
  update(id: number, data: TodoInterface): Promise<UpdateResult> {
    return this.todoRepository
      .createQueryBuilder()
      .update()
      .set({
        name: data.name,
        complete: data.complete,
      })
      .where('id = :id', { id })
      .execute();
  }
  delete(id: number): Promise<DeleteResult> {
    return this.todoRepository
      .createQueryBuilder()
      .delete()
      .from(Todo)
      .where('id = :id', { id })
      .execute();
  }
}
