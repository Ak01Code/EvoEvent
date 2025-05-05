import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type EventDocument = Event & Document;

@Schema()
export class Event {
  @Prop({ required: true })
  eventImage: string;

  @Prop({ required: true })
  eventName: string;

  @Prop({ required: true })
  eventDate: string;

  @Prop({ required: true })
  eventCategory: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: string;
}

export const EventSchema = SchemaFactory.createForClass(Event);
