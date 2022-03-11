import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import { Job } from 'bull';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ExcelExtractorService } from 'src/excel-extractor/excel-extractor.service';
import { GraphqlService } from 'src/graphql/graphql.service';
import { NotificationsService } from 'src/websockets/notifications/notifications.service';
@Processor('upload-queue')
export class UploadProcessor {
  constructor(
    @InjectPinoLogger(UploadProcessor.name)
    private readonly logger: PinoLogger,
    private excelExtractor: ExcelExtractorService,
    private graphqlService: GraphqlService,
    private notificationSocket: NotificationsService,
  ) {}

  @Process('file-processor')
  async processFile(job: Job) {
    this.logger.debug(`File upload job started. Job ID:${job.id}`);
    try {
      const records = await this.excelExtractor.extractStudentData(
        job?.data?.buffer?.data,
      );
      const response = await this.graphqlService.sendStudentsRecords(records);
      if (response.status === 200) return true;
    } catch (error) {
      this.notificationSocket.notifyJobStatus('Failed');
      this.logger.error(`File upload job failed : ${error}`);
      return false;
    }
  }

  @OnQueueCompleted()
  onJobCompleted(job: Job, result: any) {
    this.logger.debug('completed: job ', job.id, ' -> result: ', result);
    this.notificationSocket.notifyJobStatus('Success');
  }

  @OnQueueFailed()
  OnJobFailed(job: Job, err: Error) {
    this.logger.error('failed: job ', job.id, ' -> result: ', err);
    this.notificationSocket.notifyJobStatus('Failed');
  }
}
