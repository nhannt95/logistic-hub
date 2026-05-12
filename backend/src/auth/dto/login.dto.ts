import { IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ example: 'demo' })
  @IsString()
  @IsNotEmpty()
  username!: string

  @ApiProperty({ example: 'demo123' })
  @IsString()
  @MinLength(4)
  password!: string
}
