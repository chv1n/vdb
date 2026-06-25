import { Module } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { FestivalController } from './festival.controller';

@Module({
  controllers: [FestivalController],
  providers: [FestivalService],
})
export class FestivalModule {}
