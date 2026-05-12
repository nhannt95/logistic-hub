import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator'

export class CreateCustomerDto {
  @ApiProperty({ example: '0001', description: 'Mã KH 4 chữ số 0001-9999' })
  @IsString()
  @Matches(/^\d{4}$/, { message: 'Mã KH phải gồm 4 chữ số' })
  code!: string

  @ApiProperty({ example: 'Công ty TNHH ACOM Long Bình' })
  @IsString() @IsNotEmpty() @MaxLength(255)
  name!: string

  @ApiProperty({ example: 'ACOM LB' })
  @IsString() @IsNotEmpty() @MaxLength(64)
  shortName!: string

  @ApiPropertyOptional()
  @IsOptional() @IsString() @MaxLength(255)
  address?: string

  @ApiPropertyOptional()
  @IsOptional() @IsString() @MaxLength(32)
  taxCode?: string

  @ApiPropertyOptional()
  @IsOptional() @IsString() @MaxLength(128)
  contactPerson?: string

  @ApiPropertyOptional()
  @IsOptional() @IsString() @MaxLength(32)
  phone?: string

  @ApiPropertyOptional()
  @IsOptional() @IsEmail()
  email?: string

  @ApiPropertyOptional({ enum: ['active', 'inactive'], default: 'active' })
  @IsOptional() @IsEnum(['active', 'inactive'])
  status?: 'active' | 'inactive'
}
