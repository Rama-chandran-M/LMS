import { Test, TestingModule } from '@nestjs/testing';
import { CoursemoduleController } from './coursemodule.controller';

describe('CoursemoduleController', () => {
  let controller: CoursemoduleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursemoduleController],
    }).compile();

    controller = module.get<CoursemoduleController>(CoursemoduleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
