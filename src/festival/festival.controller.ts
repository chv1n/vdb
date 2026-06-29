import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FestivalService } from './festival.service';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { QueryParamDto } from './dto/query-param.dto';

@Controller('festival')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @Post()
  create(@Body() createFestivalDto: CreateFestivalDto) {
    return this.festivalService.createFestival(createFestivalDto);
  }

  @Get()
  searchFestivals(@Query() query: QueryParamDto) {
    return this.festivalService.searchFestivals(query.search, query.limit);
  }


}
