import { Test, TestingModule } from '@nestjs/testing';
import { DocuwareService } from './docuware.service';

describe('DocuwareService', () => {
  let service: DocuwareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocuwareService],
    }).compile();

    service = module.get<DocuwareService>(DocuwareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
