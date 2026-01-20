import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, PrismaService],
})
export class AuthModule {}
