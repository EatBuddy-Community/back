import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { MatchService } from './match.service';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  // 매칭 참여: PATCH /matches/:id/join
  @Patch(':id/join')
  async joinMatch(
    @Param('id') matchId: string,
    @Body('userId') userId: string,
  ) {
    return this.matchService.joinMatch(userId, matchId);
  }

  // 매칭 생성: POST /matches
  @Post()
  async createMatch(@Body() createMatchDto: any) {}
}
