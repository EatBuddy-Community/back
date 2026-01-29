import { BadRequestException, Injectable } from '@nestjs/common';
import { MatchRepository } from './match.repository';
import { MatchTransactionManaget } from './match-transaction.manager';

@Injectable()
export class MatchService {
  constructor(
    private readonly matchRepository: MatchRepository,
    private readonly transactionManager: MatchTransactionManaget,
  ) {}

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

    // [실행] 기존 레포지토리 호출 대신 매니저의 트랜잭션 로직 호출!
    return this.transactionManager.joinMatchWithActivity(
      userBId,
      matchId,
      match.placeName,
      match.userAId,
    );
  }

  async cancelMatch(userId: string, matchId: string) {
    // 1. 매칭 존재 여부 확인
    const match = await this.matchRepository.findById(matchId);
    if (!match) {
      throw new BadRequestException('존재하지 않는 매칭입니다.');
    }

    // 2. 권한 확인: 방장만 취소할 수 있음
    if (match.userAId !== userId) {
      throw new BadRequestException('방장만 매칭을 취소할 수 있습니다.');
    }

    // 3. 이미 완료되거나 취소된 매칭인지 확인
    if (match.status === 'CANCELLED' || match.status === 'REJECTED') {
      throw new BadRequestException('이미 취소되었거나 종료된 매칭입니다.');
    }

    // 4. 트랜잭션 매니저 호출
    return this.transactionManager.cancelMatchWithActivity(
      matchId,
      match.userAId,
      match.userBId, // 참여자가 없으면 null이 넘어감
      match.placeName,
    );
  }

  async getActivePlaces() {
    return this.matchRepository.findActivePlaceIds();
  }
}
