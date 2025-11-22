import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto, UpdateEventDto } from './dto';
import cloudinary from 'src/utils/cloudinary.config';
import * as fs from 'fs';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}
  //Get all event
  async getAllEvent(page = 1, limit = 5) {
    const totalEvent = await this.prisma.events.count();
    const offset = (page - 1) * limit;

    const event = await this.prisma.events.findMany({
      skip: offset,
      take: limit,
    });

    return {
      event,
      currentCount: event.length,
      numOfPages: Math.ceil(totalEvent / limit),
      totalEvent,
    };
  }
  // create events
  async createEvent(data: CreateEventDto) {
    await this.prisma.events.create({
      data,
    });
    return { msg: 'event created successfully' };
  }
  // update events
  async updateEvent(eventId: number, data: UpdateEventDto) {
    const event = await this.prisma.events.findUnique({
      where: { event_id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`No event found with id ${eventId}`);
    }

    await this.prisma.events.update({
      where: { event_id: eventId },
      data,
    });

    return { msg: 'event updated successfully' };
  }

  async removeEvent(eventId: number) {
    const event = await this.prisma.events.findUnique({
      where: { event_id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`No event found with id ${eventId}`);
    }

    await this.prisma.events.delete({
      where: { event_id: eventId },
    });

    return {
      msg: `event with id ${eventId} has been deleted successfully`,
    };
  }

  //upload campaign image
  async uploadEventImg(eventId: number, file: Express.Multer.File) {
    //console.log(file);
    if (!file) throw new BadRequestException('Please upload an image');

    if (!file.mimetype.startsWith('image')) {
      throw new BadRequestException('Only images are allowed');
    }

    const maxSize = 2000 * 3000;
    if (file.size > maxSize) {
      throw new BadRequestException('Image should not exceed 18MB');
    }

    const event = await this.prisma.events.findUnique({
      where: { event_id: eventId },
    });

    if (!event) {
      throw new NotFoundException(
        `events with id ${eventId} does not exist, create events first!`,
      );
    }

    // Delete existing image from Cloudinary
    if (event.image_public_id) {
      await cloudinary.uploader.destroy(event.image_public_id);
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(file.path, {
      use_filename: true,
      folder: 'AIM events Images',
    });

    // 2. Update DB
    const updatedEvents = await this.prisma.events.update({
      where: { event_id: eventId },
      data: {
        image_url: result.secure_url,
        image_public_id: result.public_id,
      },
    });

    // 3. Delete temp file
    fs.unlinkSync(file.path);

    // 4. Return response exactly like your Express code
    return {
      image: {
        src: result.secure_url,
      },
      campaign: updatedEvents,
    };
  }
}
