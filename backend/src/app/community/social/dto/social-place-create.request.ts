import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { SocialPlaceCreateRequestCommand } from '@app/community/social/commands/social-place.commands';

export class SocialPlaceCreateRequest
  implements SocialPlaceCreateRequestCommand
{
  @ApiProperty({ example: '건물 이름', nullable: true })
  @IsString()
  @IsNotEmpty()
  buildingName: string | null;

  @ApiProperty({ example: '위도' })
  @IsString()
  @IsNotEmpty()
  latitude: string;

  @ApiProperty({ example: '경도' })
  @IsString()
  @IsNotEmpty()
  longitude: string;

  @ApiProperty({ example: '주소' })
  @IsString()
  @IsNotEmpty()
  placeAddress: string;

  @ApiProperty({ example: '시/도' })
  @IsString()
  @IsNotEmpty()
  region1DepthName: string;

  @ApiProperty({ example: '시/군/구' })
  @IsString()
  @IsNotEmpty()
  region2DepthName: string;

  @ApiProperty({ example: '읍/면/동' })
  @IsString()
  @IsNotEmpty()
  region3DepthName: string;
}
