import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuranDto, UpdateQuranDto } from './dto';

@Injectable()
export class QuranService {
  constructor(private prisma: PrismaService) {}

  async addSurah(dto: CreateQuranDto) {
    await this.prisma.quran_surahs.create({
      data: { ...dto, },
    });

    return { msg: 'Surah added successfully' };
  }

  async getSurah() {
    const surahs = await this.prisma.quran_surahs.findMany();
    return { surahs };
  }

  async updateSurah(id: number, dto: UpdateQuranDto) {
    const exists = await this.prisma.quran_surahs.findUnique({
      where: { surah_id: id },
    });

    if (!exists) {
      throw new NotFoundException(`There is no surah with an id of ${id}`);
    }

    await this.prisma.quran_surahs.update({
      where: { surah_id: id },
      data: dto,
    });

    return { msg: 'QURAN updated successfully' };
  }
}
