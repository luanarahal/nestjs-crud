import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from 'src/entity/Todo.entity';
import { FindOneOptions, Raw, Repository, UpdateResult } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
export interface TodoInterface {
  id?: number;
  name: string;
  complete: boolean;
  deletion_time: Date;
}
@Injectable()
export class TodosService {
  validateFields(createTodoDto: TodoInterface): boolean {
    const validFields: Array<keyof TodoInterface> = ['name', 'complete'];
    const invalidFields = Object.keys(createTodoDto).filter(campo => !validFields.includes(campo as keyof TodoInterface));
    if (invalidFields.length > 0) {
      return false;
    }
    return true;
  }
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<TodoInterface>
  ) {}
  
  create(todo: TodoInterface): Promise<TodoInterface> {
    return this.todoRepository.save(this.todoRepository.create(todo));
  }
  findAll(): Promise<TodoInterface[]> {
    const options: FindOneOptions<TodoInterface> = { 
      where: { 
        deletion_time: Raw(alias => `${alias} IS NULL`),
      } 
    };
    return this.todoRepository.find(options);
  }
  findOne(id: number): Promise<TodoInterface> {
    const options: FindOneOptions<TodoInterface> = { 
      where: { 
        id, 
        deletion_time: Raw(alias => `${alias} IS NULL`),
      } 
    };
    return this.todoRepository.findOne(options);
  }
  update(id: number, data: TodoInterface): Promise <UpdateResult> {
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

  delete(id: number): Promise<UpdateResult> {
    return this.todoRepository
      .createQueryBuilder()
      .update()
      .set({
        deletion_time: new Date()
      })
      .where('id = :id', { id })
      .execute();
  }
}
