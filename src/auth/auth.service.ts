import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(email: string, password: string) {
    const user = await this.authRepository.findUserByEmail(email);

    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!isMatch) {
      throw new UnauthorizedException(
        '이메일 또는 패스워드가 잘못 되었습니다.',
      );
    }
    return { message: '로그인성공', userId: user?.id };
  }
}
