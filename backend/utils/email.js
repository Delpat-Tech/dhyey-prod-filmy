const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Dhyey Production <noreply@dhyeyproduction.com>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid or other production email service
      return nodemailer.createTransporter({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    // Development - use console logging instead of actual email
    return nodemailer.createTransporter({
      streamTransport: true,
      newline: 'unix',
      buffer: true
    });
  }

  // Send the actual email
  async send(template, subject) {
    let html = '';
    
    // Simple HTML templates without pug
    if (template === 'welcome') {
      html = `
        <h1>Welcome to Dhyey Production!</h1>
        <p>Hello ${this.firstName},</p>
        <p>Welcome to our storytelling platform! We're excited to have you join our community of writers and readers.</p>
        <p>Start your journey by exploring stories or creating your own.</p>
        <p>Happy storytelling!</p>
        <p>The Dhyey Production Team</p>
      `;
    } else if (template === 'passwordReset') {
      html = `
        <h1>Password Reset Request</h1>
        <p>Hello ${this.firstName},</p>
        <p>You requested a password reset for your Dhyey Production account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${this.url}">Reset Password</a></p>
        <p>This link is valid for only 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>The Dhyey Production Team</p>
      `;
    }

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html.replace(/<[^>]*>/g, '') // Simple HTML to text conversion
    };

    // 3) Create a transport and send email
    if (process.env.NODE_ENV === 'development') {
      console.log('Email would be sent:');
      console.log(`To: ${this.to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${mailOptions.text}`);
    } else {
      await this.newTransport().sendMail(mailOptions);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Dhyey Production!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
