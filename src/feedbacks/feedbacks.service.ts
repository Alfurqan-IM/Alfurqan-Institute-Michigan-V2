import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FeedbacksService {
  constructor(private prisma: PrismaService) {}

  // CREATE FEEDBACK
  async createFeedback(dto: CreateFeedbackDto, userId: number) {
    await this.prisma.feedbackcomplaints.create({
      data: {
        ...dto,
        user_id: userId,
      },
    });
    return { msg: 'Feedback created successfully' };
  }

  // UPDATE FEEDBACK
  async updateFeedback(
    feedbackId: number,
    userId: number,
    dto: UpdateFeedbackDto,
  ) {
    const feedback = await this.prisma.feedbackcomplaints.findUnique({
      where: { feedback_id: feedbackId },
    });

    if (!feedback) {
      throw new NotFoundException(`No feedback found with ID ${feedbackId}`);
    }

    if (feedback.user_id !== userId) {
      throw new ForbiddenException('Not authorized to update this feedback');
    }

    await this.prisma.feedbackcomplaints.update({
      where: { feedback_id: feedbackId },
      data: dto,
    });

    return { msg: 'Feedback updated successfully' };
  }

  // DELETE FEEDBACK
  async deleteFeedback(feedbackId: number, userId: number) {
    const feedback = await this.prisma.feedbackcomplaints.findUnique({
      where: { feedback_id: feedbackId },
    });

    if (!feedback) {
      throw new NotFoundException(`No feedback found with ID ${feedbackId}`);
    }

    if (feedback.user_id !== userId) {
      throw new ForbiddenException('Not authorized to delete this feedback');
    }

    await this.prisma.feedbackcomplaints.delete({
      where: { feedback_id: feedbackId },
    });

    return { msg: `Feedback with ID ${feedbackId} deleted successfully` };
  }

  // GET FEEDBACK FOR LOGGED-IN USER
  async getUserFeedback(userId: number, page = 1, limit = 5, sort?: string) {
    page = Number(page) || 1;
    limit = Number(limit) || 5;
    const skip = (page - 1) * limit;
    const orderBy: Prisma.feedbackcomplaintsOrderByWithRelationInput =
      sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };
    const feedback = await this.prisma.feedbackcomplaints.findMany({
      where: { user_id: userId },
      skip,
      take: limit,
      orderBy,
    });

    return { feedback };
  }

  // GET ALL FEEDBACK (ADMIN)
  async getAllFeedback(page = 1, limit = 5, sort?: string) {
    page = Number(page) || 1;
    limit = Number(limit) || 5;
    const skip = (page - 1) * limit;

    const totalFeedback = await this.prisma.feedbackcomplaints.count();

    const orderBy: Prisma.feedbackcomplaintsOrderByWithRelationInput =
      sort === 'oldest' ? { createdAt: 'asc' } : { createdAt: 'desc' };

    const feedback = await this.prisma.feedbackcomplaints.findMany({
      skip,
      take: limit,
      orderBy,
      include: {
        users: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
          },
        },
      },
    });

    return {
      feedback,
      totalFeedback,
      count: feedback.length,
      numOfPages: Math.ceil(totalFeedback / limit),
    };
  }
}
