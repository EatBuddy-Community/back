import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ActivityRepository {
  constructor(private prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.activity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }, // 최신 알림이 위로 오도록
      take: 20, // 일단 최근 20개만
    });
  }
}
