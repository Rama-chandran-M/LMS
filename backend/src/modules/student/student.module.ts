import { Module } from '@nestjs/common';
import { StudentCoursesController } from './courses/student-courses.controller';
import { StudentCoursesService } from './courses/student-courses.service';
import { StudentModulesController } from './modules/student-modules.controller';
import { StudentModulesService } from './modules/student-modules.service';
import { StudentAssessmentsController } from './assessments/student-assessments.controller';
import { StudentAssessmentsService } from './assessments/student-assessments.service';

@Module({
  controllers: [
    StudentCoursesController,
    StudentModulesController,
    StudentAssessmentsController,
  ],
  providers: [
    StudentCoursesService,
    StudentModulesService,
    StudentAssessmentsService,
  ],
})
export class StudentModule { }
