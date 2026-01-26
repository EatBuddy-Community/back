import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityRepository } from './activity.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService, ActivityRepository, PrismaService],
})
export class ActivityModule {}
