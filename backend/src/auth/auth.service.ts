import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwt: JwtService,
  ) {}

  async register(dto: AuthDto) {
    const hash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersService.create(dto.email, hash);

    return this.signToken(user.id);
  }

  async login(dto: AuthDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) throw new UnauthorizedException();

    return this.signToken(user.id);
  }

  private signToken(userId: string) {
    return {
      access_token: this.jwt.sign({ sub: userId }),
    };
  }
}