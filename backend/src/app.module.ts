import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BirthdayModule } from './birthday/birthday.module';

@Module({
  imports: [BirthdayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
