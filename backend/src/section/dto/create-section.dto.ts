import { IsOptional, IsString } from "class-validator"

export class CreateSectionDto{
    @IsString()
    section_title !: string

    @IsString()
    @IsOptional()
    section_content ?: string

    @IsString()
    @IsOptional()
    section_images ?: string

    @IsString()
    @IsOptional()
    image_description ?: string

    @IsString()
    @IsOptional()
    content_url ?:string

    @IsString()
    @IsOptional()
    url_description ?: string

    // @IsString()
    // @IsOptional()
    // module_id : string
}