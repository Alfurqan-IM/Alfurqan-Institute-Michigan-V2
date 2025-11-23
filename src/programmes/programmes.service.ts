import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateProgrammeDto,
  UpdateProgrammeDto,
  UpdateProgrammeOutcomesDto,
} from './dto';
import cloudinary from 'src/utils/cloudinary.config';
import * as fs from 'fs';
@Injectable()
export class ProgrammesService {
  constructor(private prisma: PrismaService) {}

  async createProgramme(data: CreateProgrammeDto) {
    // 1 — create main programme
    const programme = await this.prisma.programmes.create({
      data,
    });

    // 2 — auto-create default images
    await this.prisma.programmesimages.create({
      data: {
        programme_id: programme.programme_id,
        image0: '/uploads/default.jpeg',
        image0_public_id: 'default_public_id',
        image1: '/uploads/default.jpeg',
        image1_public_id: 'default_public_id',
        image2: '/uploads/default.jpeg',
        image2_public_id: 'default_public_id',
      },
    });

    // 3 — auto-create default outcomes
    await this.prisma.programmeoutcomes.create({
      data: {
        programme_id: programme.programme_id,
        outcome1: 'placeholder benefit 1',
        outcome2: 'placeholder benefit 2',
        outcome3: 'placeholder benefit 3',
      },
    });

    return {
      message: 'Programme created successfully',
      programme,
    };
  }

  // update programme
  async updateProgramme(programmeId: number, data: UpdateProgrammeDto) {
    const programme = await this.prisma.programmes.findUnique({
      where: { programme_id: programmeId },
    });

    if (!programme) {
      throw new NotFoundException(`No programme found with id ${programmeId}`);
    }

    await this.prisma.programmes.update({
      where: { programme_id: programmeId },
      data,
    });

    return { msg: 'programme updated successfully' };
  }

  // update programme outcomes
  async updateProgrammeOut(
    programmeId: number,
    data: UpdateProgrammeOutcomesDto,
  ) {
    const programme = await this.prisma.programmes.findUnique({
      where: { programme_id: programmeId },
      include: {
        programmeoutcomes: true, // fetch all related outcomes
      },
    });

    if (!programme) {
      throw new NotFoundException(`No programme found with id ${programmeId}`);
    }

    await this.prisma.programmeoutcomes.update({
      where: { outcome_id: programmeId },
      data,
    });

    return { msg: 'programme outcomes updated successfully' };
  }

  //upload programmes images
  async uploadProgrammeImages(
    programmeId: number,
    files: Express.Multer.File[],
  ) {
    
    if (!files || files.length === 0) {
      throw new BadRequestException('Please upload at least one image');
    }

    // Fetch existing images record
    const imageRecord = await this.prisma.programmesimages.findFirst({
      where: { img_id: programmeId },
    });

    if (!imageRecord) {
      throw new NotFoundException(
        `No images record found for programme ID ${programmeId}`,
      );
    }

    const uploadedImages = await Promise.all(
      files.map(async (file, i) => {
        if (!file) return null;

        if (!file.mimetype || !file.mimetype.startsWith('image')) {
          return null;
        }

        const maxSize = 4000 * 6000; // 12MB
        if (file.size > maxSize) return null;

        // Delete existing Cloudinary image if exists
        const currentPublicId = imageRecord[`image${i}_public_id`];
        if (currentPublicId) {
          await cloudinary.uploader.destroy(currentPublicId);
        }

        // Upload new image
        const result = await cloudinary.uploader.upload(file.path, {
          use_filename: true,
          folder: 'AIM programmes Images',
        });

        // Update DB record
        imageRecord[`image${i}`] = result.secure_url;
        imageRecord[`image${i}_public_id`] = result.public_id;
        await this.prisma.programmesimages.update({
          where: { img_id: imageRecord.img_id },
          data: {
            [`image${i}`]: result.secure_url,
            [`image${i}_public_id`]: result.public_id,
          },
        });

        // Delete temp file
        fs.unlinkSync(file.path);

        return {
          id: result.public_id,
          src: result.secure_url,
        };
      }),
    );

    // Filter out skipped files
    const validUploadedImages = uploadedImages.filter(Boolean);

    return { images: validUploadedImages };
  }
}
