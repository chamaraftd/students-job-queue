import { Test, TestingModule } from '@nestjs/testing';
import { ExcelExtractorService } from './excel-extractor.service';

describe('ExcelExtractorService', () => {
  let service: ExcelExtractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelExtractorService],
    }).compile();

    service = module.get<ExcelExtractorService>(ExcelExtractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
