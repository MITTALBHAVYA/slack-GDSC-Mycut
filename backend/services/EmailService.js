//EmailServie.js

import nodemailer from "nodemailer";

class EmailService {
  constructor({ recipientEmail, emailSubject, emailMessage }) {
    this.recipientEmail = recipientEmail;
    this.emailSubject = emailSubject;
    this.emailMessage = emailMessage;

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // SMTP host (like smtp.gmail.com)
      service: process.env.SMTP_SERVICE, // Email service (like Gmail, SendGrid)
      port: process.env.SMTP_PORT || 587, // Port 587 for secure connections
      auth: {
        user: process.env.SMTP_MAIL, // SMTP email
        pass: process.env.SMTP_PASSWORD, // SMTP password or app-specific password
      },
    });
  }

  async sendEmail() {
    const mailOptions = {
      from: `"Your App" <${process.env.SMTP_MAIL}>`, // Sender email
      to: this.recipientEmail, // Recipient email
      subject: this.emailSubject, // Subject of the email
      text: this.emailMessage, // Plain text body
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId); // Log the success
      return info;
    } catch (error) {
      console.error('Error sending email:', error); // Log the error
      throw new Error('Email could not be sent');
    }
  }
}

export default EmailService;
