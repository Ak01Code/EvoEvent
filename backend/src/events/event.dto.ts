import { IsOptional, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'image.jpg/png' })
  readonly eventImage: string;
  @ApiProperty({ example: 'akshay' })
  readonly eventName: string;
  @ApiProperty({ example: 'movieShow' })
  @IsIn([
    'singingConcert',
    'dancePerformance',
    'standupComedy',
    'movieShow',
    'magicShow',
  ])
  readonly eventCategory: string;
  @ApiProperty({ example: `2025-05-10` })
  readonly eventDate: string;
}

export class UpdateEventDto {
  @ApiProperty()
  readonly eventImage?: string;
  @ApiProperty()
  readonly eventName?: string;
  @ApiProperty()
  @IsIn([
    'singingConcert',
    'dancePerformance',
    'standupComedy',
    'movieShow',
    'magicShow',
  ])
  readonly eventCategory: string;
  @ApiProperty()
  readonly eventDate: string;
}

export class FilterEventsDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  search?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsIn([
    'singingConcert',
    'dancePerformance',
    'standupComedy',
    'movieShow',
    'magicShow',
  ])
  category?: string;
  @ApiProperty()
  @IsOptional()
  page?: number = 1;
  @ApiProperty()
  @IsOptional()
  limit?: number = 10;
}
