import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { GetExercisesDto } from './dto/get-exercises.dto.js';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: GetExercisesDto) {
    return this.prisma.exercise.findMany({
      where: dto.category ? { category: dto.category } : undefined,
      include: {
        muscles: true,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.exercise.findUnique({
      where: { id },
      include: {
        muscles: true,
      },
    });
  }
}
