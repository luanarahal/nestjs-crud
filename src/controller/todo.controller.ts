import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { TodoInterface, TodosService } from 'src/provider/todo.service';
interface CreateTodoDto {
  id: number;
  name: string;
  complete: boolean;
  deletion_time: Date;
}

@Controller('items')
export class TodosController {
  constructor(private todosService: TodosService) { }
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Res() res: Response) {
    const todo = await this.todosService.create(createTodoDto);
    if (!todo) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Erro ao criar registro.'});
    }
    res.status(HttpStatus.OK).json({ message: 'Registro criado com sucesso!'});
  }
  @Get()
  async findAll(@Res() res: Response) {
    const items: Array<TodoInterface> = await this.todosService.findAll();
    if (items) { 
      res.status(HttpStatus.OK).json(items);
    } else {
      res.status(HttpStatus.NOT_FOUND)
      .json({ message: 'Não foi possível encontrar nenhum ID registrado.' });
    }
  }
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const item = await this.todosService.findOne(id);
    if (item) {
      res.status(HttpStatus.OK).json(item);
    } else {
      res.status(HttpStatus.NOT_FOUND)
      .json({ message: `Não foi possível encontrar o registro com ID ${id}.` });
    }
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body() data: CreateTodoDto, @Res() res: Response) {
    const item = await this.todosService.findOne(id);
    if (item) {
      await this.todosService.update(id, data);
      res.status(HttpStatus.OK)
      .json({ message: `Registro com a ID ${id} foi alterada com sucesso!`});
    } else {
      res.status(HttpStatus.NOT_FOUND)
      .json({ message: `Não foi possível atualizar o ID ${id} pois não existe.` });
    } 
  }
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    const item = await this.todosService.findOne(id);
    if (item) {
      await this.todosService.delete(id);
      res.status(HttpStatus.OK)
      .json({ message: `Registro com a ID ${id} foi deletada com sucesso!`});
    } else {
      res.status(HttpStatus.NOT_FOUND)
      .json({ message: `Não foi possível deletar o ID ${id} pois não existe.` });
    }
  }
}
