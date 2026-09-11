import { Controller, Get, Param, Query } from '@nestjs/common';
import { ExercisesService } from './exercises.service.js';
import { GetExercisesDto } from './dto/get-exercises.dto.js';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  findAll(@Query() dto: GetExercisesDto) {
    return this.exercisesService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }
}
