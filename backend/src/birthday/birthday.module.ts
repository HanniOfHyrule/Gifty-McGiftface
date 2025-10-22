import { Module } from '@nestjs/common';
import { BirthdayController } from './birthday.controller';
import { BirthdayService } from './birthday.service';

@Module({
  imports: [DatabaseModule],
  controllers: [BirthdayController],
  providers: [BirthdayService],
})
export class BirthdayModule {}
