import { BadRequestException, Injectable } from '@nestjs/common';
import { MatchRepository } from './match.repository';

@Injectable()
export class MatchService {
  constructor(private readonly matchRepository: MatchRepository) {}

  async joinMatch(userBId: string, matchId: string) {
    // [판단 1] 매칭이 존재하는가?
    const match = await this.matchRepository.findById(matchId);
    if (!match || match.status !== 'PENDING') {
      throw new BadRequestException('참여 가능한 매칭이 아닙니다.');
    }

    // [판단 2] 본인이 만든 방인가?
    if (match.userAId === userBId) {
      throw new BadRequestException('본인이 만든 방에는 참여할 수 없습니다.');
    }

    // [실행] 모든 검증 통과 시 Repository에 업데이트 요청
    return this.matchRepository.updateStatus(matchId, userBId, 'ACCEPTED');
  }
}
