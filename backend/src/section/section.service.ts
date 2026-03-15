import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SectionService {
    constructor(private prismaservice : PrismaService){}
    createsection(id : string,dto : CreateSectionDto){
        return this.prismaservice.section.create(
            {
                data : {
                    section_title:dto.section_title,
                    section_content:dto.section_content,

                    section_images:dto.section_images,
                    image_description:dto.image_description,

                    content_url: dto.content_url,
                    url_description: dto.url_description,
                    
                    module:{
                        connect:{
                            module_id:id
                        }
                    }
                }
            }
        )
    }

    getsections(id : string){
        return this.prismaservice.section.findMany({
            where : {module_id : id},
            orderBy : { created_at : 'asc'}
        })
    }

    deletesection(id : string){
        return this.prismaservice.section.delete(
            {
                where:{
                    section_id:id,
                }
            }
        )
    }

    updatesection(id:string,data:CreateSectionDto){
        return this.prismaservice.section.update(
            {
                where:{
                    section_id:id,
                },
                data:{
                    section_title:data.section_title,
                    section_content:data.section_content,
                    section_images:data.section_images,
                    image_description:data.image_description,
                    content_url:data.content_url,
                    url_description:data.url_description,
                }
            }
        )
    }
}
