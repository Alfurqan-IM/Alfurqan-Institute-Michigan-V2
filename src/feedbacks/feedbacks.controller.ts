import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto, UpdateFeedbackDto } from './dto';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
// import { FeedbackService } from './feedback.service';

@Controller('api/v2/feedbacks')
@UseGuards(JwtAuthGuard)
export class FeedbacksController {
  constructor(private feedbackService: FeedbacksService) {}

  // CREATE
  @Post()
  async create(@Req() req, @Body() dto: CreateFeedbackDto) {
    return this.feedbackService.createFeedback(dto, req.user.user_id);
  }

  // GET ALL (ADMIN)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get()
  async getAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
  ) {
    return this.feedbackService.getAllFeedback(
      Number(page),
      Number(limit),
      sort,
    );
  }

  // GET AUTHENTICATED USER'S FEEDBACK
  @Get('my')
  async getUserFeedback(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
  ) {
    return this.feedbackService.getUserFeedback(
      req.user.user_id,
      Number(page),
      Number(limit),
      sort,
    );
  }

  // UPDATE FEEDBACK
  @Patch(':feedback_id')
  async update(
    @Req() req,
    @Param('feedback_id', ParseIntPipe) feedbackId: number,
    @Body() dto: UpdateFeedbackDto,
  ) {
    return this.feedbackService.updateFeedback(
      feedbackId,
      req.user.user_id,
      dto,
    );
  }

  // DELETE FEEDBACK
  @Delete(':feedback_id')
  async delete(
    @Req() req,
    @Param('feedback_id', ParseIntPipe) feedbackId: number,
  ) {
    return this.feedbackService.deleteFeedback(feedbackId, req.user.user_id);
  }
}
