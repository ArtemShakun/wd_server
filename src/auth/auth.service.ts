import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthDto } from './dto/auth.dto.js';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';




@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    
    async register(dto: AuthDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { phone: dto.phone },
        });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
        data: {
            phone: dto.phone,
            password: hashedPassword,
            username: dto.username || null,
        },
        select: {
            id: true,
            phone: true,
            username: true,
            createdAt: true,
            // Поле password навмисно не повертаємо клієнту для безпеки
        },
    });
    
    return {
      message: 'Користувач успішно зареєстрований',
      user,
    }};

    async login(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: { phone: dto.phone },
        });

        if (!user) {
            throw new UnauthorizedException('Невірний номер телефону або пароль');
        }

        const isMatch = await bcrypt.compare(dto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Невірний номер телефону або пароль');
        }

        return {
      message: 'Успішний вхід',
      userId: user.id,
      phone: user.phone,
      username: user.username,
    };
    }
}
