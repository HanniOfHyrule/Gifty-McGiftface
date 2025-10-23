import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Birthday } from './entities/birthday.entity';

@Injectable()
export class BirthdayService {
  constructor(
    @InjectRepository(Birthday)
    private birthdayRepository: Repository<Birthday>,
  ) {}

  async findAll(): Promise<Birthday[]> {
    return this.birthdayRepository.find({
      order: { dateOfBirth: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Birthday | null> {
    return this.birthdayRepository.findOne({ where: { id } });
  }

  async create(birthday: Partial<Birthday>): Promise<Birthday> {
    const newBirthday = this.birthdayRepository.create(birthday);
    return this.birthdayRepository.save(newBirthday);
  }

  async update(id: number, birthday: Partial<Birthday>): Promise<Birthday> {
    await this.birthdayRepository.update(id, birthday);
    const updatedBirthday = await this.findOne(id);
    if (!updatedBirthday) {
      throw new Error(`Birthday with id ${id} not found`);
    }
    return updatedBirthday;
  }

  async remove(id: number): Promise<void> {
    await this.birthdayRepository.delete(id);
  }

  async findUpcoming(days: number = 30): Promise<Birthday[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return this.birthdayRepository
      .createQueryBuilder('birthday')
      .where('EXTRACT(month FROM birthday.birthdate) >= :startMonth', {
        startMonth: today.getMonth() + 1,
      })
      .andWhere('EXTRACT(day FROM birthday.birthdate) >= :startDay', {
        startDay: today.getDate(),
      })
      .orderBy('EXTRACT(month FROM birthday.birthdate)', 'ASC')
      .addOrderBy('EXTRACT(day FROM birthday.birthdate)', 'ASC')
      .getMany();
  }
}
