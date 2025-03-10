import nodemailer, { Transporter } from 'nodemailer';
import { convert } from 'html-to-text';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import config from '../config';
import { IUser } from '../modules/user/user.interface';

class SendEmail {
  private to: string;
  private firstName: string;
  private url: string;
  private from: string;

  constructor(user: IUser, url: string) {
    this.to = user.email;
    this.firstName = user.username.split(' ')[0];
    this.url = url;
    this.from = `Raihan <raihan@gmail.com>`;
  }

  private newTransport(): Transporter {
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      // NOTE: secure true or false depending on port (587 need false and 465 need true)
      // secure: config.NODE_ENV === 'production',
      auth: {
        user: config.email_user,
        pass: config.email_pass,
      },
    });
  }

  private async send(template: string, subject: string): Promise<void> {
    try {
      const templatePath = path.join(
        process.cwd(),
        'public',
        `${template}.html`,
      );
      const templateFile = fs.readFileSync(templatePath, 'utf-8');
      const fileConverter = handlebars.compile(templateFile);

      const html = fileConverter({
        NAME: this.firstName,
        URL: this.url,
        SUBJECT: subject,
      });

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html),
      };

      await this.newTransport().sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  }

  async sendWelcome(): Promise<void> {
    await this.send(
      'welcomeTemplate',
      'Welcome to the GardenSage Family!',
    );
  }

  async sendPasswordReset(): Promise<void> {
    await this.send(
      'passwordResetTemplate',
      'Your password reset token (valid only for 10 minutes)!',
    );
  }
}

export default SendEmail;
