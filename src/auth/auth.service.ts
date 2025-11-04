import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  private signAccessToken(user: User) {
    return this.jwt.sign(
      { sub: user.id, email: user.email },
      { 
        secret: process.env.ACCESS_TOKEN_SECRET!, 
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRES || '15m') as any
      },
    );
  }

  private signRefreshToken(user: User) {
    return this.jwt.sign(
      { sub: user.id, tv: user.tokenVersion },
      { 
        secret: process.env.REFRESH_TOKEN_SECRET!, 
        expiresIn: (process.env.REFRESH_TOKEN_EXPIRES || '7d') as any
      },
    );
  }

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.signAccessToken(user);
    const refreshToken = this.signRefreshToken(user);
    return { accessToken, refreshToken, user: { id: user.id, email: user.email } };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify<{ sub: string; tv: number }>(
        refreshToken,
        { secret: process.env.REFRESH_TOKEN_SECRET! },
      );
      const user = await this.userModel.findById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');
      if (user.tokenVersion !== payload.tv) throw new UnauthorizedException('Token revoked');

      const accessToken = this.signAccessToken(user);
      const newRefreshToken = this.signRefreshToken(user); // rotate
      return { accessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
    return { message: 'Logged out' };
  }
}
