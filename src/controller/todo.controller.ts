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
interface TodoDto {
  id: number;
  name: string;
  complete: boolean;
  deletion_time: Date;
}

@Controller('items')
export class TodosController {
  constructor(private todosService: TodosService) { }
  @Post()
  async create(@Body() createTodoDto: TodoDto, @Res() res: Response) {
    if (!createTodoDto.name) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'O campo NAME não pode ser vazio. Por favor, preencher o campo corretamente.',
      });
    }
    if (!this.todosService.validateFields(createTodoDto)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Você digitou um campo inválido. Por favor, digitar somente campos existentes.`,
      });
    }
    return res.status(HttpStatus.OK).json({ message: 'Registro criado com sucesso!' });
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
  async update(
    @Param('id') id: number, @Body() todoDto: TodoDto, @Res() res: Response) {
    if(!todoDto.name) {
      res.status(HttpStatus.BAD_REQUEST).send({ message: `Não foi possível atualizar o ID ${id} pois o campo NAME está vazio.` });
    }
    if (!this.todosService.validateFields(todoDto)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `Você digitou um campo inválido. Por favor, digitar somente campos existentes.`,
      });
    }
    const item = await this.todosService.findOne(id);
    if (item) {
      await this.todosService.update(id, todoDto);
      res.status(HttpStatus.OK).send({ message: `Registro com a ID ${id} foi alterada com sucesso!` });
    } else {
      res.status(HttpStatus.NOT_FOUND).send({ message: `Não foi possível atualizar o ID ${id} pois o mesmo não existe.` });
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
