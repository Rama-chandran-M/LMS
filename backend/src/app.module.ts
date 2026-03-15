import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CourseModule } from './course/course.module';
import { CoursemoduleModule } from './coursemodule/coursemodule.module';
import { SectionModule } from './section/section.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CoursesController } from './course_enrollment/courses.controller';
import { CoursesService } from './course_enrollment/courses.service';
import { CourseManageModule } from './courseManage/courseManage.module';
import { StudentModule } from './modules/student/student.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    AuthModule,
    CourseModule,
    CoursemoduleModule,
    SectionModule,
    DashboardModule,
    CourseManageModule,
    StudentModule,
  ],
  controllers: [AppController, CoursesController],
  providers: [AppService, CoursesService],
})
export class AppModule { }