import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCampaignDto, UpdateCampaignDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import cloudinary from 'src/utils/cloudinary.config';
import * as fs from 'fs';
@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}
  //Get all campaign
  async getAllCampaign(page = 1, limit = 5) {
    const totalCampaign = await this.prisma.banner.count();
    const offset = (page - 1) * limit;

    const campaign = await this.prisma.campaigns_aim.findMany({
      skip: offset,
      take: limit,
    });

    return {
      campaign,
      currentCount: campaign.length,
      numOfPages: Math.ceil(totalCampaign / limit),
      totalCampaign,
    };
  }
  // create campaigns
  async createCampaign(data: CreateCampaignDto) {
    await this.prisma.campaigns_aim.create({
      data,
    });
    return { msg: 'Campaign created successfully' };
  }
  // update campaigns
  async updateCampaign(campaignId: number, data: UpdateCampaignDto) {
    const campaign = await this.prisma.campaigns_aim.findUnique({
      where: { campaign_id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException(`No campaign found with id ${campaignId}`);
    }

    await this.prisma.campaigns_aim.update({
      where: { campaign_id: campaignId },
      data,
    });

    return { msg: 'campaign updated successfully' };
  }

  async removeCampaign(campaignId: number) {
    const campaign = await this.prisma.campaigns_aim.findUnique({
      where: { campaign_id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException(`No campaign found with id ${campaignId}`);
    }

    await this.prisma.campaigns_aim.delete({
      where: { campaign_id: campaignId },
    });

    return {
      msg: `campaign with id ${campaignId} has been deleted successfully`,
    };
  }

  //upload campaign image
  async uploadCampaignImg(campaignId: number, file: Express.Multer.File) {
    //console.log(file);
    if (!file) throw new BadRequestException('Please upload an image');

    if (!file.mimetype.startsWith('image')) {
      throw new BadRequestException('Only images are allowed');
    }

    const maxSize = 2000 * 3000;
    if (file.size > maxSize) {
      throw new BadRequestException('Image should not exceed 18MB');
    }

    const campaign = await this.prisma.campaigns_aim.findUnique({
      where: { campaign_id: campaignId },
    });

    if (!campaign) {
      throw new NotFoundException(
        `campaign with id ${campaignId} does not exist, create campaign first!`,
      );
    }

    // Delete existing image from Cloudinary
    if (campaign.image_public_id) {
      await cloudinary.uploader.destroy(campaign.image_public_id);
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(file.path, {
      use_filename: true,
      folder: 'AIM campaign Images',
    });

    // 2. Update DB
    const updatedcampaign = await this.prisma.campaigns_aim.update({
      where: { campaign_id: campaignId },
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
      campaign: updatedcampaign,
    };
  }
}
