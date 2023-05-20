import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { TodoInterface, TodosService } from 'src/provider/todo.service';
interface CreateTodoDto {
  name: string;
  complete: boolean;
}
@Controller('items')
export class TodosController {
  constructor(private todosService: TodosService) { }
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto) {
    const todo = await this.todosService.create(createTodoDto);
    if (!todo) {
      return 'Erro ao criar registro';
    }
    return 'Registro criado com sucesso';
  }
  @Get()
  async findAll(@Req() request: Request) {
    const item: Array<TodoInterface> = await this.todosService.findAll();
    return item;
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const newItem: any = await this.todosService.update(id, body);
    return 'Registro atualizado';
  }
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.todosService.delete(id);
    return 'Registro deletado';
  }
}
