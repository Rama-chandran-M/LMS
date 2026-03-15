import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course-dto';
import { CourseService } from './course.service';
import { CreateAssessmentDTO } from './dto/create-assessment-dto';
import { CreateQuestionDTO } from './dto/create-question.dto';

@Controller('course')
export class CourseController {

    constructor(private courseservice : CourseService){}
    @Post()
    async createcourse(@Body() createcoursedto : CreateCourseDto){
        const data = await this.courseservice.createcourse(createcoursedto);
        return data;
    }

    @Get(':id')
    async getcontent(@Param('id') id : string){
        return await this.courseservice.getcontent(id);
    }

    @Get('fetchassessment/:course_id')
    async fetchassessment(@Param('course_id') id : string){
        return await this.courseservice.fetchassessment(id);
    }

    @Post('createassessment')
    async createassessment(@Body() dto : CreateAssessmentDTO){
        return await this.courseservice.createassessment(dto);
    }
    @Post('/questions')
    async createquestion(@Body() dto : CreateQuestionDTO){
        return await this.courseservice.createquestion(dto);
    }

    @Get('/questions/assessment/:assessmentId')
    async fetchquestions(@Param('assessmentId') id : string){
        return await this.courseservice.getquestions(id);
    }

    @Delete('/questions/:id')
    async deletequestion(@Param('id') id : string){
        return await this.courseservice.deletequestion(id);
    }
    @Patch('/questions/update/:id')
    async updatequestion(@Param('id') id:string, @Body() dto : CreateQuestionDTO ){
        return await this.courseservice.updatequestion(id,dto);
    }
    @Delete('deleteassessment/:assessmentId')
    async deleteassessment(@Param('assessmentId') id : string){
        console.log("deleting assessment");
        return await this.courseservice.deleteassessment(id);
    }
}
