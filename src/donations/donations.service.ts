import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class DonationsService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  // ============================================================
  //  Get Donations
  // ============================================================
  async getAllDonations(query: any) {
    const donorEmail = this.config.get<string>('EMAIL') ?? '';
    const apiKey = this.config.get<string>('DONOR_API_KEY') ?? '';

    if (!apiKey) {
      throw new InternalServerErrorException(
        'API key is missing or incorrect. Check environment variables.',
      );
    }

    const {
      page = 1,
      limit = 5,
      email,
      date_from,
      date_to,
      campaign_name,
      campaign_id,
      id,
      first_name,
      last_name,
      donor_id,
      amount_min,
      amount_max,
    } = query;

    let url = `https://donorbox.org/api/v1/donations?page=${Number(
      page,
    )}&per_page=${Number(limit)}`;

    const queryParams = {
      email,
      date_from,
      date_to,
      campaign_name,
      campaign_id,
      id,
      first_name,
      last_name,
      donor_id,
    };

    for (const [key, value] of Object.entries(queryParams)) {
      if (!value) continue;

      switch (key) {
        case 'email':
        case 'date_from':
        case 'date_to':
        case 'campaign_name':
        case 'first_name':
        case 'last_name':
          url += `&${key}=${encodeURIComponent(value as string)}`;
          break;

        case 'campaign_id':
        case 'id':
        case 'donor_id':
          url += `&${key}=${Number(value)}`;
          break;
      }
    }

    // Amount filter
    if (amount_min || amount_max) {
      url += '&amount[usd]=';
      if (amount_min) url += `[min]=${Number(amount_min)}`;
      if (amount_max)
        url += `${amount_min ? '&' : ''}[max]=${Number(amount_max)}`;
    }

    try {
      const response = await firstValueFrom(
        this.http.get(url, {
          auth: { username: donorEmail, password: apiKey },
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      return { donations: response.data };
    } catch (error) {
      throw new InternalServerErrorException(
        error.response?.data || 'Failed to fetch donations',
      );
    }
  }

  // ============================================================
  //  Get Donors
  // ============================================================
  async getAllDonors(query: any) {
    const donorEmail = this.config.get<string>('EMAIL') ?? '';
    const apiKey = this.config.get<string>('DONOR_API_KEY') ?? '';

    if (!apiKey) {
      throw new InternalServerErrorException(
        'API key is missing or incorrect. Check environment variables.',
      );
    }

    const { page = 1, limit = 5, first_name, last_name, id, email } = query;

    let url = `https://donorbox.org/api/v1/donors?page=${Number(
      page,
    )}&per_page=${Number(limit)}`;

    const params = { id, email, first_name, last_name };

    for (const [key, value] of Object.entries(params)) {
      if (!value) continue;

      if (key === 'id') url += `&id=${Number(value)}`;
      else url += `&${key}=${encodeURIComponent(value as string)}`;
    }

    try {
      const response = await firstValueFrom(
        this.http.get(url, {
          auth: { username: donorEmail, password: apiKey },
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      return { donors: response.data };
    } catch (error) {
      throw new InternalServerErrorException(
        error.response?.data || 'Failed to fetch donors',
      );
    }
  }

  // ============================================================
  //  Webhook Verification
  // ============================================================
  async verifyWebhook(req: any) {
    const donorboxSignature = req.headers['donorbox-signature'];
    if (!donorboxSignature) {
      throw new BadRequestException(
        'Unauthorized request: Missing Donorbox-Signature header',
      );
    }

    const [timestamp, receivedSignature] = donorboxSignature.split(',');
    if (!timestamp || !receivedSignature) {
      throw new BadRequestException(
        'Unauthorized request: Invalid Donorbox-Signature format',
      );
    }

    const verificationString = `${timestamp}.${req.rawBody}`;
    const secret = this.config.get<string>('SIGNATURE_SECRET') ?? '';

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(verificationString)
      .digest('hex');

    if (expectedSignature !== receivedSignature) {
      throw new BadRequestException('Unauthorized request: Invalid signature');
    }

    const receivedTime = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);

    if (Math.abs(now - receivedTime) > 60) {
      throw new BadRequestException(
        'Unauthorized request: Timestamp out of bounds',
      );
    }

    const [data] = req.body;

    // Emit to socket.io (attached in main.ts)
    req.io.emit('newDonation', data);

    return { msg: 'Webhook received successfully' };
  }
}
