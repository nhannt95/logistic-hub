import {
  Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CustomersService } from './customers.service'
import { CreateCustomerDto } from './dto/create-customer.dto'
import { UpdateCustomerDto } from './dto/update-customer.dto'
import { QueryCustomerDto } from './dto/query-customer.dto'

@ApiTags('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private customers: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Liệt kê khách hàng (có phân trang + filter)' })
  findAll(@Query() q: QueryCustomerDto) {
    return this.customers.findAll(q)
  }

  @Get(':code')
  @ApiOperation({ summary: 'Xem chi tiết theo mã KH' })
  findOne(@Param('code') code: string) {
    return this.customers.findOne(code)
  }

  @Post()
  @ApiOperation({ summary: 'Tạo khách hàng mới' })
  create(@Body() dto: CreateCustomerDto) {
    return this.customers.create(dto)
  }

  @Put(':code')
  @ApiOperation({ summary: 'Cập nhật khách hàng' })
  update(@Param('code') code: string, @Body() dto: UpdateCustomerDto) {
    return this.customers.update(code, dto)
  }

  @Patch(':code/toggle-status')
  @ApiOperation({ summary: 'Đổi trạng thái active / inactive' })
  toggleStatus(@Param('code') code: string) {
    return this.customers.toggleStatus(code)
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Xóa khách hàng' })
  remove(@Param('code') code: string) {
    return this.customers.remove(code)
  }
}
