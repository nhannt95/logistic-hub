import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false })
  const config = app.get(ConfigService)

  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.enableCors({
    origin: config.get<string>('CORS_ORIGIN', 'http://localhost:5173'),
    credentials: true,
  })

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Logistics-Hub API')
    .setDescription('Backend API cho hệ thống quản lý vận chuyển container Khải Hoàng Logistics')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)

  const port = config.get<number>('PORT', 3001)
  await app.listen(port)
  Logger.log(`🚀 API running at http://localhost:${port}/api`, 'Bootstrap')
  Logger.log(`📚 Swagger docs at http://localhost:${port}/docs`, 'Bootstrap')
}

bootstrap()
