import { Test, TestingModule } from '@nestjs/testing';
import { FestivalService } from './festival.service';

describe('FestivalService', () => {
  let service: FestivalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FestivalService],
    }).compile();

    service = module.get<FestivalService>(FestivalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
