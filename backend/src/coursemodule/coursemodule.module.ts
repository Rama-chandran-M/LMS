import { Module } from '@nestjs/common';
import { CoursemoduleService } from './coursemodule.service';
import { CoursemoduleController } from './coursemodule.controller';

@Module({
  providers: [CoursemoduleService],
  controllers: [CoursemoduleController]
})
export class CoursemoduleModule {}
