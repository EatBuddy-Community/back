import { Module } from '@nestjs/common';
import { MatchController } from './match.controller';
import { MatchService } from './match.service';
import { MatchRepository } from './match.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchTransactionManaget } from './match-transaction.manager';

@Module({
  controllers: [MatchController],
  providers: [
    MatchService,
    MatchRepository,
    PrismaService,
    MatchTransactionManaget,
  ],
})
export class MatchModule {}
