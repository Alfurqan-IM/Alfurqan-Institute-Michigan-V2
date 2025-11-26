
import { Controller, Get, Query, Req, Post } from '@nestjs/common';
import { DonationsService } from './donations.service';


@Controller('api/v2/donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  // ============================
  // GET Donations
  // ============================
  @Get()
  async getDonations(@Query() query: any) {
    return this.donationsService.getAllDonations(query);
  }

  // ============================
  // GET Donors
  // ============================
  @Get('donors')
  async getDonors(@Query() query: any) {
    return this.donationsService.getAllDonors(query);
  }

  // ============================
  // POST Webhook
  // ============================
  @Post('webhook')
  async donationWebhook(@Req() req: any) {
    return this.donationsService.verifyWebhook(req);
  }
}
