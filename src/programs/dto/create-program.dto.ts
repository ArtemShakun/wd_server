import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

class ProgramExerciseDto {
  @IsString()
  exerciseId: string;

  @IsInt()
  order: number;
}

export class CreateProgramDto {
  @IsString()
  name: string; // Наприклад: "День А (Груди + Трицепс)"

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProgramExerciseDto)
  exercises: ProgramExerciseDto[];
}
