import { Module, NotFoundException } from '@nestjs/common';
import { QuranController } from './quran.controller';
import { QuranService } from './quran.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuranDto, UpdateQuranDto } from './dto';

@Module({
  controllers: [QuranController],
  providers: [QuranService],
})
export class QuranModule {}
