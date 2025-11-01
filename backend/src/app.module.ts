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
      host: 'localhost',
      port: 5433, // Geänderter Port!
      username: 'giftuser',
      password: 'giftpass',
      database: 'gifty_db',
      entities: [Birthday],
      synchronize: true,
      logging: true,
    }),
    BirthdayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
