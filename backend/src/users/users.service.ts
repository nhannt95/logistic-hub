import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true, username: true, name: true, email: true, phone: true,
        role: true, status: true, lastLoginAt: true, createdAt: true,
      },
    })
    return users.map((u) => ({ ...u, id: u.id.toString() }))
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true, username: true, name: true, email: true, phone: true,
        role: true, status: true, lastLoginAt: true, createdAt: true,
      },
    })
    if (!user) throw new NotFoundException('User không tồn tại')
    return { ...user, id: user.id.toString() }
  }
}
