interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

const baseTemplate = `
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
      background-color: #ffffff;
    }
    .header {
      text-align: center;
      padding: 20px 0;
      border-bottom: 2px solid #9333ea;
    }
    .content {
      padding: 20px 0;
      line-height: 1.6;
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
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>{{title}}</h2>
    </div>
    <div class="content">
      {{content}}
    </div>
    <div class="footer">
      <p>Best regards,<br>Blog Admin Team</p>
      <p><small>This is an automated message, please do not reply.</small></p>
    </div>
  </div>
</body>
</html>
`;

export function generateWelcomeEmail(options: { name: string; loginUrl: string }): EmailTemplate {
  const { name, loginUrl } = options;

  return {
    subject: 'Welcome to Our Blog',
    text: `
Hello ${name},

Welcome to our blog! We're excited to have you as a member of our community.

You can log in to your account here: ${loginUrl}

Best regards,
Blog Admin Team
    `,
    html: baseTemplate.replace('{{title}}', 'Welcome to Our Blog!').replace(
      '{{content}}',
      `
        <p>Hello ${name},</p>
        <p>Welcome to our blog! We're excited to have you as a member of our community.</p>
        <p>You can log in to your account here:</p>
        <p><a href="${loginUrl}" class="button">Log In</a></p>
        <p>If you have any questions, feel free to contact our support team.</p>
      `
    ),
  };
}

export function generatePasswordResetEmail(options: {
  name: string;
  resetUrl: string;
}): EmailTemplate {
  const { name, resetUrl } = options;

  return {
    subject: 'Password Reset Request',
    text: `
Hello ${name},

You have requested to reset your password. Please click the link below to reset your password:

${resetUrl}

This link will expire in 1 hour.

If you did not request this, please ignore this email and your password will remain unchanged.

Best regards,
Blog Admin Team
    `,
    html: baseTemplate.replace('{{title}}', 'Password Reset Request').replace(
      '{{content}}',
      `
        <p>Hello ${name},</p>
        <p>You have requested to reset your password. Please click the button below to reset your password:</p>
        <p><a href="${resetUrl}" class="button">Reset Password</a></p>
        <p>Or copy and paste this link in your browser:</p>
        <p><small>${resetUrl}</small></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `
    ),
  };
}

export function generateAdminNotificationEmail(options: {
  adminName: string;
  eventType: string;
  eventDetails: Record<string, any>;
  dashboardUrl: string;
}): EmailTemplate {
  const { adminName, eventType, eventDetails, dashboardUrl } = options;

  let eventDescription = '';
  switch (eventType) {
    case 'password_reset_request':
      eventDescription = `Password reset requested for user: ${eventDetails.userEmail}
Time: ${eventDetails.timestamp}
IP Address: ${eventDetails.ipAddress}`;
      break;
    case 'user_created':
      eventDescription = `New user registered:
Name: ${eventDetails.userName}
Email: ${eventDetails.userEmail}
Time: ${eventDetails.timestamp}`;
      break;
    case 'suspicious_activity':
      eventDescription = `Suspicious activity detected:
Type: ${eventDetails.activityType}
User: ${eventDetails.userEmail}
Time: ${eventDetails.timestamp}
IP Address: ${eventDetails.ipAddress}`;
      break;
    default:
      eventDescription = `Event Type: ${eventType}
Details: ${JSON.stringify(eventDetails, null, 2)}`;
  }

  return {
    subject: `Admin Alert: ${eventType}`,
    text: `
Hello ${adminName},

This is an automated notification about a recent event on the blog:

${eventDescription}

View more details in the admin dashboard: ${dashboardUrl}

Best regards,
Blog System
    `,
    html: baseTemplate.replace('{{title}}', `Admin Alert: ${eventType}`).replace(
      '{{content}}',
      `
        <p>Hello ${adminName},</p>
        <p>This is an automated notification about a recent event on the blog:</p>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${eventDescription}</pre>
        <p><a href="${dashboardUrl}" class="button">View in Dashboard</a></p>
      `
    ),
  };
}

export function generateLoginNotificationEmail(options: {
  name: string;
  loginTime: string;
  ipAddress: string;
  userAgent: string;
  location?: string;
}): EmailTemplate {
  const { name, loginTime, ipAddress, userAgent, location } = options;

  return {
    subject: 'New Login to Your Account',
    text: `
Hello ${name},

We detected a new login to your account:

Time: ${loginTime}
IP Address: ${ipAddress}
Browser: ${userAgent}
${location ? `Location: ${location}` : ''}

If this wasn't you, please change your password immediately.

Best regards,
Blog Admin Team
    `,
    html: baseTemplate.replace('{{title}}', 'New Login to Your Account').replace(
      '{{content}}',
      `
        <p>Hello ${name},</p>
        <p>We detected a new login to your account:</p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          <p><strong>Time:</strong> ${loginTime}</p>
          <p><strong>IP Address:</strong> ${ipAddress}</p>
          <p><strong>Browser:</strong> ${userAgent}</p>
          ${location ? `<p><strong>Location:</strong> ${location}</p>` : ''}
        </div>
        <p style="color: #d00;">If this wasn't you, please change your password immediately.</p>
      `
    ),
  };
}
