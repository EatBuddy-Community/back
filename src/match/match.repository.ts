import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchRepository {
  constructor(private prisma: PrismaService) {}

  async createMatch(userAId: string, createMatchDto: any) {
    return this.prisma.match.create({
      data: {
        userAId,
        placeId: createMatchDto.placeId,
        placeName: createMatchDto.placeName,
        status: 'PENDING', // 처음 생성 시에는 대기 상태
      },
    });
  }

  async joinMatch(userBId: string, matchId: string) {
    // 1. 해당 매칭이 존재하는지, 그리고 현재 PENDING 상태인지 확인
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match || match.status !== 'PENDING') {
      throw new Error('참여 가능한 매칭이 아닙니다.');
    }

    // 2. 방장(UserA) 본인이 참여하는지 확인
    if (match.userAId === userBId) {
      throw new Error('본인이 만든 방에는 참여할 수 없습니다.');
    }

    // 3. 매칭 업데이트 (상태 변경 및 참여자 등록)
    return this.prisma.match.update({
      where: { id: matchId },
      data: {
        userBId: userBId,
        status: 'ACCEPTED', // 매칭 완료 상태로 변경
      },
    });
  }
}
