import { Injectable } from '@nestjs/common';
import { studentSchema } from '../excel.schema';
import readXlsxFile from 'read-excel-file/node';
import { bufferToStream, isIsoDate } from '../utils';
import { Logger } from '@nestjs/common';

@Injectable()
export class ExcelExtractorService {
  private readonly logger = new Logger(ExcelExtractorService.name);
  async extractStudentData(bufferData: Buffer) {
    const stream = bufferToStream(Buffer.from(bufferData));
    try {
      const extractedData = await readXlsxFile(stream, {
        schema: studentSchema,
      });
      const dataList = extractedData.rows.map((row: any) => {
        if (isIsoDate(row?.dob.toISOString())) {
          row.dob = row.dob.toISOString().split('T', 1)[0];
        }
        return row;
      });
      this.logger.debug(
        `Excel file reading success with ${dataList.length} records`,
      );
      return dataList;
    } catch (error) {
      this.logger.error(`Excel file reading failed : ${error}`);
    }
  }
}
