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
    } else if (template === 'storyApproved') {
      html = `
        <h1>🎉 Your Story Has Been Published!</h1>
        <p>Hello ${this.firstName},</p>
        <p>Great news! Your story <strong>"${this.storyTitle}"</strong> has been reviewed and approved by our moderation team.</p>
        <p>Your story is now live and available for readers to discover and enjoy.</p>
        <p><a href="${this.url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Your Published Story</a></p>
        <p>Thank you for contributing to our storytelling community!</p>
        <p>Happy writing!</p>
        <p>The Dhyey Production Team</p>
      `;
    } else if (template === 'storyRejected') {
      html = `
        <h1>Story Review Update</h1>
        <p>Hello ${this.firstName},</p>
        <p>Thank you for submitting your story <strong>"${this.storyTitle}"</strong> to Dhyey Production.</p>
        <p>After careful review, our moderation team has provided the following feedback:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ff9800; margin: 15px 0;">
          <p><strong>Feedback:</strong></p>
          <p>${this.feedback}</p>
        </div>
        <p>We encourage you to revise your story based on this feedback and resubmit it. We believe in your storytelling potential!</p>
        <p><a href="${this.url}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Edit Your Story</a></p>
        <p>Keep writing!</p>
        <p>The Dhyey Production Team</p>
      `;
    } else if (template === 'storyUnpublished') {
      html = `
        <h1>Story Status Update</h1>
        <p>Hello ${this.firstName},</p>
        <p>We're writing to inform you that your story <strong>"${this.storyTitle}"</strong> has been unpublished from our platform.</p>
        ${this.feedback ? `
        <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #ff9800; margin: 15px 0;">
          <p><strong>Reason:</strong></p>
          <p>${this.feedback}</p>
        </div>
        ` : ''}
        <p>If you have any questions about this decision, please don't hesitate to contact our support team.</p>
        <p><a href="${this.url}" style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Your Story</a></p>
        <p>Thank you for your understanding.</p>
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

  // Story moderation email templates
  async sendStoryApproved(storyTitle) {
    this.storyTitle = storyTitle;
    await this.send('storyApproved', `Great news! Your story "${storyTitle}" has been published`);
  }

  async sendStoryRejected(storyTitle, feedback) {
    this.storyTitle = storyTitle;
    this.feedback = feedback;
    await this.send('storyRejected', `Update needed for your story "${storyTitle}"`);
  }

  async sendStoryUnpublished(storyTitle, feedback) {
    this.storyTitle = storyTitle;
    this.feedback = feedback;
    await this.send('storyUnpublished', `Your story "${storyTitle}" has been unpublished`);
  }
};
