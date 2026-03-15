import { Body, Controller, Get, HttpCode, NotFoundException, Param, Post, Query, UnauthorizedException } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async list(@Query('userId') userId?: string) {
    return this.coursesService.listCourses(userId);
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const course = await this.coursesService.getCourseById(id);
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.coursesService.login(body.email, body.password);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    return user;
  }

  @Post('enroll')
  async enroll(@Body() body: { user_id: string; course_id: string }) {
    return this.coursesService.enroll(body.user_id, body.course_id);
  }

  @Post('unroll')
  async unroll(@Body() body: { user_id: string; course_id: string }) {
    return this.coursesService.unroll(body.user_id, body.course_id);
  }
}
