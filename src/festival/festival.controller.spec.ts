import { Test, TestingModule } from '@nestjs/testing';
import { FestivalController } from './festival.controller';
import { FestivalService } from './festival.service';

describe('FestivalController', () => {
  let controller: FestivalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FestivalController],
      providers: [FestivalService],
    }).compile();

    controller = module.get<FestivalController>(FestivalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
