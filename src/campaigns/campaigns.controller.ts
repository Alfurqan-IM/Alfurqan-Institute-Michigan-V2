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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { CreateCampaignDto, UpdateCampaignDto } from './dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadConfig } from 'src/utils/cloudinary.config';

@Controller('api/v2/campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}
  //create campaigns
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  createCampaign(@Body() data: CreateCampaignDto) {
    return this.campaignsService.createCampaign(data);
  }
  //update campaigns
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':campaign_id')
  updateCampaign(
    @Param('campaign_id', ParseIntPipe) campaignId: number,
    @Body() data: UpdateCampaignDto,
  ) {
    return this.campaignsService.updateCampaign(campaignId, data);
  }

  //Remove campaign
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':campaign_id')
  removecampaign(@Param('campaign_id', ParseIntPipe) campaignId: number) {
    return this.campaignsService.removeCampaign(campaignId);
  }
  //Get all campaigns
  @Get()
  getAll(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.campaignsService.getAllCampaign(
      Number(page) || 1,
      Number(limit) || 5,
    );
  }
  // upload campaign image
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Patch(':campaign_id/upload')
  @UseInterceptors(FileInterceptor('image', UploadConfig))
  uploadImage(
    @Param('campaign_id', ParseIntPipe) campaignId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.campaignsService.uploadCampaignImg(campaignId, file);
  }

  // GET donorbox campaigns
  @Get('donorCampaigns')
  async getAllCampaignsDonor(@Query() query: any) {
    return this.campaignsService.getAllCampaignsDonor(query);
  }
}
