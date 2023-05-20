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
  id: number;
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
    const items: Array<TodoInterface> = await this.todosService.findAll();
    return items;
  }
  @Get(':id')
  async findOne(@Param('id') id: number) {
     const item = await this.todosService.findOne(id);
     return item;
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: any) {
    const newItem: any = await this.todosService.update(id, body);
    return 'Registro atualizado';
  }
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.todosService.delete(id);
    return 'Registro deletado';
  }
}
