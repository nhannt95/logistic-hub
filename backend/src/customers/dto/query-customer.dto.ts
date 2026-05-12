import { ApiPropertyOptional } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'

export class QueryCustomerDto {
  @ApiPropertyOptional()
  @IsOptional() @IsString()
  search?: string

  @ApiPropertyOptional({ enum: ['active', 'inactive'] })
  @IsOptional() @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive'

  @ApiPropertyOptional({ default: 1 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number = 1

  @ApiPropertyOptional({ default: 25 })
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(200)
  pageSize?: number = 25
}
