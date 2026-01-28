import { Injectable } from '@nestjs/common';
import { EventsGateway } from 'src/event/event.gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchTransactionManaget {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  async joinMatchWithActivity(
    userBId: string,
    matchId: string,
    placeName: string,
    userAId: string,
  ) {
    const updatedMatch = await this.prisma.$transaction(async (tx) => {
      const match = await tx.match.update({
        where: { id: matchId },
        data: { userBId, status: 'ACCEPTED' },
      });

      await tx.activity.create({
        data: {
          userId: userAId,
          type: 'MATCH_SUCCESS',
          content: `'${placeName}' 매칭 성공!`,
        },
      });

      return match;
    });

    // 2. 트랜잭션이 '완전히' 성공한 후 알림 전송 (안전!)
    this.eventsGateway.sendNotification(userAId, {
      type: 'MATCH_SUCCESS',
      content: `'${placeName}' 매칭이 성공했습니다! 지금 확인해보세요.`,
    });

    return updatedMatch;
  }

  async cancelMatchWithActivity(
    matchId: string,
    userAId: string,
    userBId: string | null,
    placeName: string,
  ) {
    // 1. DB 작업 완료
    const cancelledMatch = await this.prisma.$transaction(async (tx) => {
      const match = await tx.match.update({
        where: { id: matchId },
        data: { status: 'CANCELLED' },
      });

      await tx.activity.create({
        data: {
          userId: userAId,
          type: 'MATCH_CANCELLED',
          content: `'${placeName}' 매칭을 취소했습니다.`,
        },
      });

      if (userBId) {
        await tx.activity.create({
          data: {
            userId: userBId,
            type: 'MATCH_CANCELLED_BY_HOST',
            content: `아쉽게도 '${placeName}' 매칭이 방장에 의해 취소되었습니다.`,
          },
        });
      }
      return match;
    });

    // 2. 트랜잭션 성공 후 알림 전송
    if (userBId) {
      this.eventsGateway.sendNotification(userBId, {
        type: 'MATCH_CANCELLED',
        content: `참여 중이던 '${placeName}' 매칭이 취소되었습니다.`,
      });
    }

    return cancelledMatch;
  }
}
