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

  async cancelMatchWithActivity(
    matchId: string,
    userAId: string,
    userBId: string | null,
    placeName: string,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. 매칭 상태를 CANCELLED로 변경
      const cancelledMatch = await tx.match.update({
        where: { id: matchId },
        data: { status: 'CANCELLED' },
      });

      // 2. 방장 본인에게 취소 확인 알림 기록
      await tx.activity.create({
        data: {
          userId: userAId,
          type: 'MATCH_CANCELLED',
          content: `'${placeName}' 매칭을 취소했습니다.`,
        },
      });

      // 3. 참여자가 있었을 경우, 참여자에게도 취소 알림 전송
      if (userBId) {
        await tx.activity.create({
          data: {
            userId: userBId,
            type: 'MATCH_CANCELLED_BY_HOST',
            content: `아쉽게도 '${placeName}' 매칭이 방장에 의해 취소되었습니다.`,
          },
        });
      }

      return cancelledMatch;
    });
  }
}
