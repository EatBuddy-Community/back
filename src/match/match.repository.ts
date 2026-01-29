import { Injectable } from '@nestjs/common';
import { MatchStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.match.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.match.create({ data });
  }

  async updateStatus(id: string, userBId: string, status: MatchStatus) {
    return this.prisma.match.update({
      where: { id },
      data: { userBId, status },
    });
  }

  async findActivePlaceIds() {
    const activeMatches = await this.prisma.match.findMany({
      where: { status: 'PENDING' },
      select: { placeId: true },
      distinct: ['placeId'], // 중복 제거
    });

    return activeMatches.map((m) => m.placeId);
  }
}
