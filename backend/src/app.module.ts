import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BirthdayModule } from './birthday/birthday.module';
import { Birthday } from './birthday/entities/birthday.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'giftuser',
      password: process.env.DATABASE_PASSWORD || 'giftpass',
      database: process.env.DATABASE_NAME || 'gifty_db',
      entities: [Birthday],
      synchronize: true,
    }),
    BirthdayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
