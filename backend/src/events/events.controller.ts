import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Request as NestRequest,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, FilterEventsDto, UpdateEventDto } from './event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request, Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiBearerAuth('evolution')
@ApiTags('events') // Groups under "events" in Swagger UI
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @UseInterceptors(
    FileInterceptor('eventImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: (
          req: Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const timestamp = Date.now();
          const random = Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          const safeFilename = `event-${timestamp}-${random}${fileExt}`;
          cb(null, safeFilename);
        },
      }),
    }),
  )
  create(
    @NestRequest() req,
    @UploadedFile() file: Express.Multer.File,
    @Body() createEventDto: CreateEventDto,
  ) {
    if (!file) {
      throw new BadRequestException({
        message: 'Event image is required',
        field: 'eventImage',
        statusCode: 400,
      });
    }

    const userId = req?.user?.userId;

    const imagePath = `http://localhost:3000/uploads/${file.filename}`;
    return this.eventsService.create(
      {
        ...createEventDto,
        eventImage: imagePath,
      },
      userId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({ summary: 'Get events' })
  @ApiQuery({
    name: 'search',
    required: false,
    example: '',
    description: 'Search by event name',
  })
  @ApiQuery({ name: 'category', required: false, example: 'dancePerformance' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of events returned successfully',
  })
  async findAll(@Query() filterDto: FilterEventsDto, @NestRequest() req) {
    const userId = (req as Request & { user: { userId: string } }).user.userId;
    // const userId = req.user.userId;
    return this.eventsService.findAll(filterDto, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing event' })
  @ApiParam({ name: 'id', example: '123' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @UseInterceptors(
    FileInterceptor('eventImage', {
      storage: diskStorage({
        destination: './uploads',
        filename: (
          req: Request,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const timestamp = Date.now();
          const random = Math.round(Math.random() * 1e9);
          const fileExt = extname(file.originalname);
          const safeFilename = `event-${timestamp}-${random}${fileExt}`;
          cb(null, safeFilename);
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const updatedData = { ...updateEventDto };

    if (file) {
      updatedData.eventImage = `http://localhost:3000/uploads/${file.filename}`;
    }

    return this.eventsService.update(id, updatedData);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event by ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    example: '64f8f4881e75d7e27fc3e444',
    description: 'The ID of the event to delete',
  })
  @ApiResponse({ status: 204, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
