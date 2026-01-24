import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchTransactionManaget {
  constructor(private readonly prisma: PrismaService) {}

  async joinMatchWithActivity(
    userBId: string,
    matchId: string,
    placeName: string,
    userAId: string,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. 매칭 상태 업데이트
      const updatedMatch = await tx.match.update({
        where: { id: matchId },
        data: { userBId, status: 'ACCEPTED' },
      });

      // 2. 알림 생성
      await tx.activity.create({
        data: {
          userId: userAId,
          type: 'MATCH_SUCCESS',
          content: `'${placeName}' 매칭 성공!`,
        },
      });

      return updatedMatch;
    });
  }
}
