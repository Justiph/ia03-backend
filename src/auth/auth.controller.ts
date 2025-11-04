import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { JwtAuthGuard } from './jwt.guard';
import { Request } from 'express';

class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
}
class RefreshDto {
  @IsString() refreshToken: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @Post('refresh')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req: Request & { user: any }) {
    return this.auth.logout(req.user.sub);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request & { user: any }) {
    return { id: req.user.sub, email: req.user.email };
  }
}
