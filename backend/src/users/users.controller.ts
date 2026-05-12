import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { UsersService } from './users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  findAll() {
    return this.users.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.users.findOne(id)
  }
}
