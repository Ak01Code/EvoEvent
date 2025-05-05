import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { Event, EventDocument } from './events.schema';
import { CreateEventDto, FilterEventsDto, UpdateEventDto } from './event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModal: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto, userId: string): Promise<Event> {
    const newEvent = new this.eventModal({
      ...createEventDto,
      creator: userId,
    });
    return newEvent.save();
  }

  async findAll(filterDto: FilterEventsDto, userId: string) {
    const { search, category, page = 1, limit = 10 } = filterDto;

    const skip = (page - 1) * limit;

    // Build the aggregation pipeline
    const aggregationPipeline: PipelineStage[] = [];

    // Match stage for filtering
    const matchStage: Record<string, any> = {
      creator: new Types.ObjectId(userId),
    };

    // Search implementation
    if (search) {
      matchStage.$or = [
        { eventName: { $regex: search, $options: 'i' } },
        // { eventCategory: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      matchStage.eventCategory = category;
    }

    // Add match stage to pipeline if there are any filters
    if (Object.keys(matchStage).length > 0) {
      aggregationPipeline.push({ $match: matchStage } as PipelineStage.Match);
    }

    // Create a separate pipeline for counting total documents (before pagination)
    const countPipeline = [...aggregationPipeline, { $count: 'total' }];

    // Add pagination
    aggregationPipeline.push({ $skip: skip } as PipelineStage);
    aggregationPipeline.push({
      $limit: parseInt(limit.toString()),
    } as PipelineStage);

    // Execute both pipelines in parallel
    const [events, countResult] = await Promise.all([
      this.eventModal.aggregate(aggregationPipeline).exec(),
      this.eventModal.aggregate(countPipeline).exec(),
    ]);

    // Extract total count with proper type safety
    const total =
      countResult.length > 0 ? (countResult[0] as { total: number }).total : 0;

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      data: events,
      meta: {
        page: parseInt(page.toString()),
        limit: parseInt(limit.toString()),
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Event> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }

    const event = await this.eventModal.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }

    const updatedEvent = await this.eventModal
      .findByIdAndUpdate(id, updateEventDto, { new: true })
      .exec();

    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return updatedEvent;
  }

  async remove(id: string): Promise<Event> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Invalid ID format`);
    }

    const deletedEvent = await this.eventModal.findByIdAndDelete(id).exec();

    if (!deletedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return deletedEvent;
  }
}
