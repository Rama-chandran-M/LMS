import { Body, Controller, Post, Get, Param,Delete,Patch } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';

@Controller('section')
export class SectionController {
    constructor(private sectionservice : SectionService){}

    @Post(':id')
    createsection(@Param('id') id : string,@Body() sectiondto : CreateSectionDto){
        return this.sectionservice.createsection(id,sectiondto);
    }

    @Get(':id')
    getsections(@Param('id') id : string){
        return this.sectionservice.getsections(id);
    }

    @Delete('/deletesection/:id')
    deletesection(@Param('id') id : string){
        return this.sectionservice.deletesection(id);
    }

    @Patch('/updatesection/:id')
    updatesection(@Param('id') id : string , @Body() data : CreateSectionDto){
        return this.sectionservice.updatesection(id,data);
    }
}
