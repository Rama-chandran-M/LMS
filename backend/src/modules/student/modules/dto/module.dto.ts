// import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class MarkModuleCompleteDto {
  // @ApiProperty({ description: 'ID of the module to mark as complete' })
  @IsUUID()
  module_id: string;
}
