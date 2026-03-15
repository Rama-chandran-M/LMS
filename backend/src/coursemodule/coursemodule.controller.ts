import { Controller, Post, Body, Get, Param,Patch,Delete } from '@nestjs/common';
import { CoursemoduleService } from './coursemodule.service';
import { CreateModuleDto } from './dto/create-module.dto';

@Controller('coursemodule')
export class CoursemoduleController {
    constructor(private coursemoduleservice : CoursemoduleService){}

    @Post(':id')
    createcoursemodule(@Param('id') courseid : string , @Body() createcoursemoduledto : CreateModuleDto){
        return this.coursemoduleservice.createmodule(courseid,createcoursemoduledto);
    }

    @Get(':id')
    getcoursemodules(@Param('id') id : string){
        return this.coursemoduleservice.getcoursemodules(id);
    }

    @Patch('/updatemodule/:id')
    updatemodule(@Param('id') id : string , @Body() data : CreateModuleDto){
        return this.coursemoduleservice.updatemodule(id,data);
    }

    @Delete('/deletemodule/:id')
    deletemodule(@Param('id') id : string){
        return this.coursemoduleservice.deletemodule(id);
    }
}
