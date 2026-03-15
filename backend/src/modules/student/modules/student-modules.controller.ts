import {
  Controller,
  Get,
  Post,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { Role } from '../../../common/enums/role.enum';
import { StudentModulesService } from './student-modules.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtGuard } from '../../../auth/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';


//this role is not working 
// @Roles(Role.STUDENT)
@Controller('student')
export class StudentModulesController {
  constructor(private readonly modulesService: StudentModulesService) { }

  @Get('courses/:courseId/modules')
  @UseGuards(JwtGuard)
  async getCourseModules(
    @Param('courseId', ParseUUIDPipe) courseId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.modulesService.getCourseModules(user.sub, courseId);
  }

  @Get('modules/:moduleId')
  @UseGuards(JwtGuard)
  async getModuleContent(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.modulesService.getModuleWithSections(user.sub, moduleId);
  }

  @Post('modules/:moduleId/complete')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async markModuleComplete(
    @Param('moduleId', ParseUUIDPipe) moduleId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.modulesService.markModuleAsComplete(user.sub, moduleId);
  }

  @Get('completions')
  @UseGuards(JwtGuard)
  async getMyCompletions(@CurrentUser() user: JwtPayload) {
    return this.modulesService.getMyCompletions(user.sub);
  }
}
