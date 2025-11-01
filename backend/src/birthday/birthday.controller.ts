import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  BadRequestException,
  Query,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BirthdayService } from './birthday.service';
import { CsvImportService } from './CsvImportService';
import { UpcomingBirthday } from './birthday.service';
import { diskStorage } from 'multer';

@Controller('birthdays')
export class BirthdayController {
  constructor(
    private readonly birthdayService: BirthdayService,
    private readonly csvImportService: CsvImportService,
  ) {}

  @Get()
  async findAll() {
    return this.birthdayService.findAll();
  }

  @Get('upcoming')
  async findUpcoming(
    @Query('days') days?: number,
  ): Promise<UpcomingBirthday[]> {
    const daysToCheck = days ? parseInt(days.toString()) : 30;
    return this.birthdayService.findUpcoming(daysToCheck);
  }

  @Get('statistics')
  async getStatistics(): Promise<any> {
    return this.birthdayService.getStatistics();
  }

  @Get('by-month/:month')
  async getBirthdaysByMonth(@Param('month') month: number) {
    const allBirthdays = await this.birthdayService.findAll();
    return allBirthdays.filter((birthday) => {
      if (!birthday.dateOfBirth) return false;

      let birthdayMonth: number;
      if (birthday.dateOfBirth.startsWith('--')) {
        birthdayMonth = parseInt(birthday.dateOfBirth.substring(2, 4));
      } else {
        birthdayMonth = parseInt(birthday.dateOfBirth.substring(5, 7));
      }

      return birthdayMonth === parseInt(month.toString());
    });
  }

  @Post('upload-csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Erweiterte MIME-Types für CSV
        const allowedTypes = [
          'text/csv',
          'application/csv',
          'text/plain',
          'application/vnd.ms-excel',
        ];

        const isCSV =
          allowedTypes.includes(file.mimetype) ||
          file.originalname.toLowerCase().endsWith('.csv');

        if (!isCSV) {
          return cb(new BadRequestException('Only CSV files allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.csvImportService.importFromCsv(file.path);
    return {
      message: 'CSV imported successfully',
      ...result,
    };
  }

  @Post('generate-sample')
  async generateSample() {
    const result = await this.csvImportService.generateSampleData();
    return {
      message: 'Sample data generated',
      count: result.length,
    };
  }
}
