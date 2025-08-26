const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.fullName.split(' ')[0];
    this.url = url;
    this.from = `Sindh Police Admin <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendPasswordReset() {
    const resetUrl = `${this.url}?token=${encodeURIComponent(this.url.split('/').pop())}`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2c3e50; color: white; padding: 20px; text-align: center;">
          <h2>Sindh Police Password Reset</h2>
        </div>
        <div style="padding: 30px;">
          <p>Dear ${this.firstName},</p>
          <p>You have requested to reset your password. Please click the button below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 12px 24px; 
                      background-color: #e74c3c; color: white; 
                      text-decoration: none; border-radius: 4px;
                      font-weight: bold;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <p style="color: #e74c3c; font-weight: bold;">Note: This link will expire in 10 minutes.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #777;">
            <p>© ${new Date().getFullYear()} Sindh Police. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Your Password Reset Token (Valid for 10 minutes)',
      html,
      text: htmlToText.fromString(html)
    };

    await this.newTransport().sendMail(mailOptions);
  }
};