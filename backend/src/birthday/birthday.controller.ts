import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BirthdayService } from './birthday.service';
import { diskStorage } from 'multer';
import { CsvImportService } from 'src/birthday/CsvImportService';

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
        if (file.mimetype !== 'text/csv') {
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
