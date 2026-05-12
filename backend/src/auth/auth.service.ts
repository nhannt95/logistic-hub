import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { User } from '@prisma/client'

export interface AuthPayload {
  sub: string // user id (BigInt serialized as string)
  username: string
  role: User['role']
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { username } })
    if (!user) throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng')
    if (user.status === 'locked') throw new UnauthorizedException('Tài khoản đã bị khóa')

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) throw new UnauthorizedException('Tên đăng nhập hoặc mật khẩu không đúng')

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    return user
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password)
    const payload: AuthPayload = {
      sub: user.id.toString(),
      username: user.username,
      role: user.role,
    }
    return {
      access_token: this.jwt.sign(payload),
      user: {
        id: user.id.toString(),
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  }
}
