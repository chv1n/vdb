import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FestivalModule } from './festival/festival.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017',
      {
        dbName: process.env.MONGODB_DB ?? 'ai',
      },
    ),
    FestivalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
