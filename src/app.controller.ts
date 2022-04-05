import { InjectQueue } from '@nestjs/bull';
import {
  Controller,
  Get,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { Queue } from 'bull';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Request } from 'express';

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
    @Req() req: Request,
    @UploadedFile() fileToProcess: Express.Multer.File,
  ): Promise<any> {
    console.log(req.headers.wsheader);
    //reading from buffer tend to leads to a  memory overflow
    //save file to storage and read from there
    this.logger.debug(`File Upload request received`);
    this.fileQueue.add(
      'file-processor',
      { file: fileToProcess, wsId: req.headers.wsheader },
      {
        attempts: 3,
        backoff: 15000,
      },
    );
  }
}
