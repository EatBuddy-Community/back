import { Injectable } from '@nestjs/common';
import { MatchRepository } from './match.repository';

@Injectable()
export class MatchService {
  constructor(private readonly matchRepository: MatchRepository) {}
}
