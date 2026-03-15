import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course-dto';
import { CreateAssessmentDTO } from './dto/create-assessment-dto';
import { CreateQuestionDTO } from './dto/create-question.dto';

@Injectable()
export class CourseService {
    constructor(private prismaservice : PrismaService){}

    createcourse(dto : CreateCourseDto){
        return this.prismaservice.course.create(
            {
                data : dto
            }
        )
    }

    getcontent(id : string){
        return this.prismaservice.course.findUnique(
            {
                where : {course_id : id},
                include : {
                    modules : {
                        include : {
                            sections : true,
                        }
                    }
                }
            }
        )
    }

    fetchassessment(id : string){
        return this.prismaservice.assessment.findUnique(
            {
                where : {fk_course_id : id}
            }
        )
    }

    createassessment(data : CreateAssessmentDTO){
        return this.prismaservice.assessment.create(
            {
                data : {
                    title : data.title,
                    description : data.description,
                    passing_score : data.passing_score,
                    fk_course_id : data.fk_course_id,
                }
            }
        )
    }

    deleteassessment(id : string){
        return this.prismaservice.assessment.delete(
            {
                where : {
                    assessment_id : id,
                }
            }
        )
    }

    createquestion(data : CreateQuestionDTO){
        return this.prismaservice.questions.create(
            {
                data : {
                    question_text : data.question_text,
                    question_type : data.question_type,
                    points : data.points,
                    fk_assessment_id : data.fk_assessment_id,
                    choices : {
                        create : data.choices.map((cho) => ({
                            choice_text : cho.choice_text,
                            is_correct : cho.is_correct
                        }))
                    }
                },
                include:{
                    choices:true,
                }
            }
        )
    }

    getquestions(id : string){
        return this.prismaservice.questions.findMany(
            {
                where : {
                    fk_assessment_id: id,
                },
                include:{
                    choices: true,
                },
                orderBy:{
                    question_text:'asc'
                }
            }
        )
    }

    deletequestion(id : string){
        return this.prismaservice.questions.delete(
            {
                where : {
                    question_id : id,
                }
            }
        )
    }

    async updatequestion(id :string , data : CreateQuestionDTO){
        await this.prismaservice.questionChoice.deleteMany(
            {
                where:{
                    fk_question_id:id,
                }
            }
        )

        return this.prismaservice.questions.update(
            {
                where:{
                    question_id:id
                },
                data:{
                    question_text : data.question_text,
                    question_type : data.question_type,
                    points : data.points,

                    choices:{
                        create : data.choices.map((cho) => ({
                            choice_text : cho.choice_text,
                            is_correct : cho.is_correct,
                        }))
                    }
                },
                include:{
                    choices:true,
                }
            }
        )
    }
}
