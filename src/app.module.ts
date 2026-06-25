import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FestivalModule } from './festival/festival.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FestivalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
