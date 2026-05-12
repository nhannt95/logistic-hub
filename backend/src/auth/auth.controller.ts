import { Body, Controller, HttpCode, Post, Get, UseGuards, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './jwt-auth.guard'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng nhập, nhận JWT' })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.username, dto.password)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin user hiện tại từ JWT' })
  me(@Req() req: Request & { user: { userId: string; username: string; role: string } }) {
    return req.user
  }
}
