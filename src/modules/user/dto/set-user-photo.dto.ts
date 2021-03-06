import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MimeTypesEnum } from '../../../constants';

import { AffiliationEnum } from '../../../constants';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SetUserPhotoDto {
  @ApiProperty({
    description: 'Type MIME',
    type: String,
    enum: MimeTypesEnum,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(MimeTypesEnum)
  mime: MimeTypesEnum;

  @ApiProperty({
    description: 'Belonging to object',
    type: String,
    enum: AffiliationEnum,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(AffiliationEnum)
  affiliation: AffiliationEnum;

  @ApiPropertyOptional({ description: 'Attached object ID' })
  @IsOptional()
  @IsString()
  ownerId: string;

  @ApiPropertyOptional({ description: 'Array of filenames', default: null })
  @IsOptional()
  @IsString()
  files: [string] = null;

  @ApiPropertyOptional({ description: 'Filename', default: null })
  @IsOptional()
  @IsString()
  file: string;
}
