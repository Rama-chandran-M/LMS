import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { Role } from '../../../common/enums/role.enum';
import { StudentCoursesService } from './student-courses.service';
import { CourseQueryDto, EnrollCourseDto } from './dto/course.dto';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from '../../../auth/jwt/jwt.guard';

@Controller('student/courses')
export class StudentCoursesController {
  constructor(private readonly coursesService: StudentCoursesService) { }


  @Get()
  async getAllCourses(@Query() query: CourseQueryDto) {
    return this.coursesService.getAllCourses(query);
  }

  @Get('my-courses')
  @UseGuards(JwtGuard)
  @Roles(Role.STUDENT)
  async getMyEnrolledCourses(@CurrentUser() user: JwtPayload) {
    return this.coursesService.getMyEnrolledCourses(user?.sub);
  }

  @Get(':courseId')
  @UseGuards(JwtGuard)
  async getCourseDetails(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.getCourseDetails(courseId, user?.sub);
  }


  @Get(':courseId/progress')
  @UseGuards(JwtGuard)
  @Roles(Role.STUDENT)
  async getCourseProgress(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.coursesService.getCourseProgress(user.sub, courseId);
  }




  @Post('enroll')
  @UseGuards(JwtGuard)
  @Roles(Role.STUDENT)
  async enrollInCourse(
    @CurrentUser() user: JwtPayload,
    @Body() dto: EnrollCourseDto,
  ) {
    return this.coursesService.enrollInCourse(user.sub, dto);
  }
}
