import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { QuranService } from './quran.service';
import { CreateQuranDto, UpdateQuranDto } from './dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorators';

@Controller('api/v2/surah')
export class QuranController {
  constructor(private quranService: QuranService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  addSurah(@Body() dto: CreateQuranDto) {
    return this.quranService.addSurah(dto);
  }

  @Get()
  getSurah() {
    return this.quranService.getSurah();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':surah_id')
  updateSurah(
    @Param('surah_id', ParseIntPipe) surah_id: number,
    @Body() dto: UpdateQuranDto,
  ) {
    return this.quranService.updateSurah(surah_id, dto);
  }
}
