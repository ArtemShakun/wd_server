import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProgramDto } from './dto/create-program.dto.js';
import { UpdateProgramDto } from './dto/update-program.dto.js';

@Injectable()
export class ProgramsService {
  constructor(private prisma: PrismaService) {}

  // Створення програми
  async create(userId: string, dto: CreateProgramDto) {
    const exerciseIds = dto.exercises.map(e => e.exerciseId);
    const existingExercises = await this.prisma.exercise.findMany({
      where: { id: { in: exerciseIds } },
    });

    if (existingExercises.length !== exerciseIds.length) {
      throw new NotFoundException(
        'Одна або декілька вправ не знайдені в довіднику',
      );
    }

    return this.prisma.workoutProgram.create({
      data: {
        name: dto.name,
        userId: userId,
        exercises: {
          create: dto.exercises.map(item => ({
            exerciseId: item.exerciseId,
            order: item.order,
          })),
        },
      },
      include: {
        exercises: {
          include: { exercise: true },
        },
      },
    });
  }

  // Отримання всіх програм користувача
  async findAllByUser(userId: string) {
    return this.prisma.workoutProgram.findMany({
      where: { userId },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  // Редагування програми (оновлення назви та/або списку вправ)
  async update(id: string, userId: string, dto: UpdateProgramDto) {
    // Перевіряємо, чи існує програма і чи належить вона юзеру
    const program = await this.prisma.workoutProgram.findFirst({
      where: { id, userId },
    });

    if (!program) {
      throw new NotFoundException('Програма не знайдена');
    }

    // Використовуємо транзакцію для безпечного оновлення вправ
    return this.prisma.$transaction(async tx => {
      // Якщо передано новий список вправ, видаляємо старі зв'язки і створюємо нові
      if (dto.exercises) {
        await tx.programExercise.deleteMany({
          where: { programId: id },
        });
      }

      return tx.workoutProgram.update({
        where: { id },
        data: {
          name: dto.name,
          exercises: dto.exercises
            ? {
                create: dto.exercises.map(item => ({
                  exerciseId: item.exerciseId,
                  order: item.order,
                })),
              }
            : undefined,
        },
        include: {
          exercises: {
            include: { exercise: true },
            orderBy: { order: 'asc' },
          },
        },
      });
    });
  }

  // Видалення програми
  async remove(id: string, userId: string) {
    const program = await this.prisma.workoutProgram.findFirst({
      where: { id, userId },
    });

    if (!program) {
      throw new NotFoundException('Програма не знайдена');
    }

    return this.prisma.workoutProgram.delete({
      where: { id },
    });
  }
}
