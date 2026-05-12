import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { QueryCustomerDto } from './dto/query-customer.dto'

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(q: QueryCustomerDto) {
    const where: Prisma.CustomerWhereInput = {}
    if (q.status) where.status = q.status
    if (q.search) {
      where.OR = [
        { code: { contains: q.search } },
        { name: { contains: q.search } },
        { shortName: { contains: q.search } },
        { taxCode: { contains: q.search } },
        { phone: { contains: q.search } },
        { email: { contains: q.search } },
      ]
    }

    const page = q.page ?? 1
    const pageSize = q.pageSize ?? 25

    const [rows, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        orderBy: { code: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.customer.count({ where }),
    ])
    return { rows, total, page, pageSize }
  }

  async findOne(code: string) {
    const c = await this.prisma.customer.findUnique({ where: { code } })
    if (!c) throw new NotFoundException(`Khách hàng ${code} không tồn tại`)
    return c
  }

  async create(dto: CreateCustomerDto) {
    const exists = await this.prisma.customer.findUnique({ where: { code: dto.code } })
    if (exists) throw new ConflictException(`Mã KH ${dto.code} đã tồn tại`)
    return this.prisma.customer.create({ data: dto })
  }

  async update(code: string, dto: UpdateCustomerDto) {
    await this.findOne(code)
    return this.prisma.customer.update({ where: { code }, data: dto })
  }

  async remove(code: string) {
    await this.findOne(code)
    await this.prisma.customer.delete({ where: { code } })
    return { code, deleted: true }
  }

  async toggleStatus(code: string) {
    const c = await this.findOne(code)
    const next = c.status === 'active' ? 'inactive' : 'active'
    return this.prisma.customer.update({ where: { code }, data: { status: next } })
  }
}
