import { Module } from '@nestjs/common';
import { DocuwareService } from './docuware.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DocuwareService],
})
export class DocuwareModule {}
