import { Test, TestingModule } from '@nestjs/testing';
import { PhotosnpmService } from './photosnpm.service';

describe('PhotosnpmService', () => {
  let service: PhotosnpmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotosnpmService],
    }).compile();

    service = module.get<PhotosnpmService>(PhotosnpmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
