import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProgramDto } from './dto/create-program.dto.js';
import { UpdateProgramDto } from './dto/update-program.dto.js';
import { ProgramsService } from './programs.service.js';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  async create(@Body('userId') userId: string, @Body() dto: CreateProgramDto) {
    return this.programsService.create(userId, dto);
  }

  @Get('user/:userId')
  async findAllByUser(@Param('userId') userId: string) {
    return this.programsService.findAllByUser(userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body('userId') userId: string, // Тимчасово для перевірки власника
    @Body() dto: UpdateProgramDto,
  ) {
    return this.programsService.update(id, userId, dto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Body('userId') userId: string, // Тимчасово для перевірки власника
  ) {
    return this.programsService.remove(id, userId);
  }
}
