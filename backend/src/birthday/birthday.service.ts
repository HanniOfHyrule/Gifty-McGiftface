import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Birthday } from './entities/birthday.entity';

export interface UpcomingBirthday extends Birthday {
  daysUntilBirthday: number;
  birthdayThisYear: string;
  age: number | null;
}

@Injectable()
export class BirthdayService {
  constructor(
    @InjectRepository(Birthday)
    private birthdayRepository: Repository<Birthday>,
  ) {}

  async findAll(): Promise<Birthday[]> {
    return this.birthdayRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findUpcoming(days: number = 30): Promise<UpcomingBirthday[]> {
    const birthdays = await this.birthdayRepository.find();
    const today = new Date();
    const upcoming: UpcomingBirthday[] = [];

    for (const birthday of birthdays) {
      const birthdayThisYear = this.calculateBirthdayThisYear(
        birthday.dateOfBirth,
      );
      if (birthdayThisYear) {
        const daysDiff = this.daysDifference(today, birthdayThisYear);
        if (daysDiff >= 0 && daysDiff <= days) {
          upcoming.push({
            ...birthday,
            daysUntilBirthday: daysDiff,
            birthdayThisYear: birthdayThisYear.toISOString().split('T')[0],
            age: this.calculateAge(birthday.dateOfBirth),
          });
        }
      }
    }

    return upcoming.sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
  }

  async getStatistics() {
    const total = await this.birthdayRepository.count();
    const upcoming = await this.findUpcoming(30);
    const byMonth = await this.getBirthdaysByMonth();

    return {
      total,
      upcomingCount: upcoming.length,
      byMonth,
      upcoming: upcoming.slice(0, 5), // Nächste 5
    };
  }

  private async getBirthdaysByMonth() {
    const birthdays = await this.birthdayRepository.find();
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      monthName: new Date(2024, i).toLocaleDateString('de-DE', {
        month: 'long',
      }),
      count: 0,
    }));

    birthdays.forEach((birthday) => {
      if (birthday.dateOfBirth) {
        let month: number;
        if (birthday.dateOfBirth.startsWith('--')) {
          // Format --MM-DD
          month = parseInt(birthday.dateOfBirth.substring(2, 4));
        } else {
          // Format YYYY-MM-DD
          month = parseInt(birthday.dateOfBirth.substring(5, 7));
        }
        if (month >= 1 && month <= 12) {
          months[month - 1].count++;
        }
      }
    });

    return months;
  }

  private calculateBirthdayThisYear(dateOfBirth: string | null): Date | null {
    if (!dateOfBirth) return null;

    const today = new Date();
    let month: number, day: number;

    if (dateOfBirth.startsWith('--')) {
      // Format --MM-DD
      month = parseInt(dateOfBirth.substring(2, 4));
      day = parseInt(dateOfBirth.substring(5, 7));
    } else {
      // Format YYYY-MM-DD
      const parts = dateOfBirth.split('-');
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
    }

    let birthdayThisYear = new Date(today.getFullYear(), month - 1, day);

    // Wenn Geburtstag dieses Jahr schon vorbei, nächstes Jahr
    if (birthdayThisYear < today) {
      birthdayThisYear = new Date(today.getFullYear() + 1, month - 1, day);
    }

    return birthdayThisYear;
  }

  private daysDifference(date1: Date, date2: Date): number {
    const diffTime = date2.getTime() - date1.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private calculateAge(dateOfBirth: string | null): number | null {
    if (!dateOfBirth || dateOfBirth.startsWith('--')) return null;

    const birthYear = parseInt(dateOfBirth.substring(0, 4));
    const today = new Date();
    return today.getFullYear() - birthYear;
  }
}
