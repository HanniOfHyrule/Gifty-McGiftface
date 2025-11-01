import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = 3000;
  await app.listen(port);
  console.log(`🚀 Backend läuft auf http://localhost:${port}`);
  console.log(`✅ CORS aktiviert für alle Origins`);
}
bootstrap();
