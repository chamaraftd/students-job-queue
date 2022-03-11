import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Queue } from 'bull';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Controller('files')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectQueue('upload-queue') private fileQueue: Queue,
    @InjectPinoLogger(AppController.name)
    private readonly logger: PinoLogger,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('files'))
  async fileUpload(
    @UploadedFile() fileToProcess: Express.Multer.File,
  ): Promise<any> {
    //reading from buffer tend to leads to a  memory overflow
    //save file to storage and read from there
    this.logger.debug(`File Upload request received`);
    this.fileQueue.add('file-processor', fileToProcess, {
      attempts: 3,
      backoff: 15000,
    });
  }
}
