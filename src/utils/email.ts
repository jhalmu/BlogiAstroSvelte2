import nodemailer from 'nodemailer';
import { isDevMode } from '../config/database';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// For development, log emails instead of sending
const devTransporter = {
  sendMail: async (mailOptions: any) => {
    console.log('Email would be sent in production:');
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);
    console.log('Text:', mailOptions.text);
    console.log('HTML:', mailOptions.html);
    return { messageId: 'dev-mode' };
  },
};

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  const emailTransporter = isDevMode() ? devTransporter : transporter;

  try {
    const info = await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || '"Blog Admin" <noreply@example.com>',
      ...options,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}

export function generatePasswordResetEmail(options: {
  to: string;
  resetToken: string;
  name: string;
}) {
  const resetUrl = `${process.env.SITE_URL || 'http://localhost:4321'}/reset-password?token=${options.resetToken}`;

  return {
    to: options.to,
    subject: 'Password Reset Request',
    text: `
Hello ${options.name},

You have requested to reset your password. Please click the link below to reset your password:

${resetUrl}

If you did not request this, please ignore this email and your password will remain unchanged.

This link will expire in 1 hour.

Best regards,
Blog Admin Team
    `,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    .container { 
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #9333ea;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Password Reset Request</h2>
    <p>Hello ${options.name},</p>
    <p>You have requested to reset your password. Please click the button below to reset your password:</p>
    <p>
      <a href="${resetUrl}" class="button">Reset Password</a>
    </p>
    <p>Or copy and paste this link in your browser:</p>
    <p><small>${resetUrl}</small></p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    <p>This link will expire in 1 hour.</p>
    <div class="footer">
      <p>Best regards,<br>Blog Admin Team</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}
