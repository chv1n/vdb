import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Festival extends Document {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  category: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  location: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: [Number], default: [] })
  vector: number[];
}

export const FestivalSchema = SchemaFactory.createForClass(Festival);
