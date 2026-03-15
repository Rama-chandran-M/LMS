import { Test, TestingModule } from '@nestjs/testing';
import { CoursemoduleService } from './coursemodule.service';

describe('CoursemoduleService', () => {
  let service: CoursemoduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursemoduleService],
    }).compile();

    service = module.get<CoursemoduleService>(CoursemoduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
