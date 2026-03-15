import { Module } from '@nestjs/common';
import { CourseManageController } from './courseManage.controller';
import { CourseManageService } from './courseManage.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CourseManageController],
  providers: [CourseManageService, PrismaService],
  exports: [CourseManageService],
})
export class CourseManageModule {}