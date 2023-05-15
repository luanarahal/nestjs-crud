import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from 'src/entity/Todo.entity';
import { TodosController } from '../controller/todo.controller';
import { TodosService } from '../provider/todo.service';
@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
