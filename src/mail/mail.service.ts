import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { verifyEmailTemplate } from './templates/verify-email.teplate';
import { forgotPasswordTemplate } from './templates/forgot-password.template';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  //private resend = new Resend(process.env.RESEND_API_KEY);
  private resend: Resend;
  constructor(private config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
  }
  async sendEmail(options: {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
  }) {
    const { to, subject, html } = options;
    try {
      const response = await this.resend.emails.send({
        from: 'AlFurqan International <noreply@api.staging.alfurqaninternational.org>',
        to,
        subject,
        html,
      });
      return response;
    } catch (err) {
      console.error('Email send failed:', err);
      throw err;
    }
  }

  async sendVerificationEmail(data: {
    email: string;
    token: string | null;
    firstName: string;
    lastName: string;
    origin: string;
  }) {
    const html = verifyEmailTemplate(data);
    const options = { to: data.email, subject: 'Email Verification', html };
    return this.sendEmail(options);
  }

  async sendPasswordResetEmail(data: {
    email: string;
    token: string;
    firstName: string;
    lastName: string;
    origin: string;
  }) {
    const html = forgotPasswordTemplate(data);
    const options = { to: data.email, subject: 'Reset Your Password', html };
    return this.sendEmail(options);
  }
}
