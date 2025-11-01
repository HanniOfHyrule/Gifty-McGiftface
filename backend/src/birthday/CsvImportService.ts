import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { Birthday, TODO } from './entities/birthday.entity';

interface CsvRow {
  'First Name'?: string;
  'Last Name'?: string;
  Birthday?: string;
  [key: string]: any;
}

@Injectable()
export class CsvImportService {
  constructor(
    @InjectRepository(Birthday)
    private birthdayRepository: Repository<Birthday>,
  ) {}

  async importFromCsv(
    filePath: string,
  ): Promise<{ imported: number; errors: string[] }> {
    const results: CsvRow[] = [];
    const errors: string[] = [];
    const imported = 0;

    return new Promise((resolve) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: CsvRow) => results.push(data))
        .on('end', () => {
          this.processResults(results, errors, imported)
            .then((result) => {
              resolve(result);
            })
            .catch((error: unknown) => {
              const errorMessage =
                error instanceof Error ? error.message : String(error);
              resolve({
                imported: 0,
                errors: [errorMessage],
              });
            });
        });
    });
  }

  private async processResults(
    results: CsvRow[],
    errors: string[],
    imported: number,
  ): Promise<{ imported: number; errors: string[] }> {
    let importCount = imported; // Lokale Variable für Zählung

    for (const row of results) {
      try {
        const firstName = (row['First Name'] || '').toString();
        const lastName = (row['Last Name'] || '').toString();
        const birthdayString = (row['Birthday']?.toString() || '').trim();

        if (!firstName.trim() || !lastName.trim() || !birthdayString) {
          continue;
        }

        let isValidDate = false;
        if (birthdayString.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const testDate = new Date(birthdayString);
          isValidDate = !isNaN(testDate.getTime());
        } else if (birthdayString.match(/^--\d{2}-\d{2}$/)) {
          isValidDate = true;
        }

        if (!isValidDate) {
          errors.push(
            `Invalid date format for ${firstName} ${lastName}: ${birthdayString}`,
          );
          continue;
        }

        const existing = await this.birthdayRepository.findOne({
          where: {
            name: firstName,
            lastName: lastName,
          },
        });

        if (existing) {
          errors.push(`Person ${firstName} ${lastName} already exists`);
          continue;
        }

        const birthday = new Birthday();
        birthday.name = firstName;
        birthday.lastName = lastName;
        birthday.dateOfBirth = birthdayString;
        birthday.Todo = TODO.NEEDPRESENT;

        await this.birthdayRepository.save(birthday);
        importCount++; // Lokale Variable erhöhen
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        errors.push(
          `Error processing ${row['First Name']} ${row['Last Name']}: ${errorMessage}`,
        );
      }
    }
    return { imported: importCount, errors }; // Lokale Variable zurückgeben
  }

  async generateSampleData(): Promise<Birthday[]> {
    const sampleData = [
      {
        name: 'Max',
        lastName: 'Mustermann',
        dateOfBirth: '1990-05-15',
        Todo: TODO.NEEDPRESENT,
      },
      {
        name: 'Anna',
        lastName: 'Schmidt',
        dateOfBirth: '1985-12-03',
        Todo: TODO.WHATSAPP,
      },
      {
        name: 'Peter',
        lastName: 'Müller',
        dateOfBirth: '1992-08-22',
        Todo: TODO.NEEDCARD,
      },
    ];

    return this.birthdayRepository.save(sampleData);
  }
}
