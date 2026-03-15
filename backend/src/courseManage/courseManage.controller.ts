import { Controller, Get, Delete, Param } from '@nestjs/common';
import { CourseManageService } from './courseManage.service';

@Controller('courses')
export class CourseManageController {

  constructor(private readonly courseService: CourseManageService) {}

  @Get('instructor/:id')
  getInstructorCourses(@Param('id') id: string) {
    return this.courseService.getInstructorCourses(id);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }

  @Get('stats/:courseId')
  getStats(@Param('courseId') courseId: string) {
    return this.courseService.getCourseStats(courseId);
  }

}