import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphqlService } from './graphql/graphql.service';
import { UploadProcessor } from './processors/file.processor';
import { ExcelExtractorService } from './excel-extractor/excel-extractor.service';
import { LoggerModule } from 'nestjs-pino';
import { NotificationsService } from './websockets/notifications/notifications.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.BULL_REDIS_HOST,
        port: parseInt(process.env.BULL_REDIS_PORT, 10) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'upload-queue',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    GraphqlService,
    UploadProcessor,
    ExcelExtractorService,
    NotificationsService,
  ],
})
export class AppModule {}
