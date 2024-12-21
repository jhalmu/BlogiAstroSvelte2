import db from '../db';
import { sendEmail } from './email';
import { generateAdminNotificationEmail } from './emailTemplates';
import { getAdminUsers } from './auth';

interface SecurityEvent {
  userId: string;
  eventType: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

const SUSPICIOUS_PATTERNS = {
  // Multiple failed login attempts
  LOGIN_FAILURES: {
    threshold: 5,
    timeWindow: 15 * 60 * 1000, // 15 minutes
  },
  // Multiple password reset requests
  RESET_REQUESTS: {
    threshold: 3,
    timeWindow: 60 * 60 * 1000, // 1 hour
  },
  // Multiple countries in short time
  COUNTRY_CHANGES: {
    threshold: 2,
    timeWindow: 60 * 60 * 1000, // 1 hour
  },
  // Rapid-fire requests
  RAPID_REQUESTS: {
    threshold: 30,
    timeWindow: 60 * 1000, // 1 minute
  },
};

export async function trackSecurityEvent(event: SecurityEvent) {
  await db('security_events').insert({
    user_id: event.userId,
    event_type: event.eventType,
    ip_address: event.ipAddress,
    user_agent: event.userAgent,
    created_at: event.timestamp,
  });

  await detectSuspiciousActivity(event);
}

async function detectSuspiciousActivity(event: SecurityEvent) {
  const timeWindow = new Date(
    event.timestamp.getTime() - SUSPICIOUS_PATTERNS.LOGIN_FAILURES.timeWindow
  );

  // Check for multiple failed logins
  if (event.eventType === 'login_failed') {
    const failedLogins = await db('security_events')
      .where({
        user_id: event.userId,
        event_type: 'login_failed',
      })
      .where('created_at', '>', timeWindow)
      .count('* as count');

    if (failedLogins[0].count >= SUSPICIOUS_PATTERNS.LOGIN_FAILURES.threshold) {
      await reportSuspiciousActivity({
        type: 'multiple_failed_logins',
        userId: event.userId,
        details: {
          attempts: failedLogins[0].count,
          ipAddress: event.ipAddress,
          timeWindow: '15 minutes',
        },
      });
    }
  }

  // Check for multiple password reset requests
  if (event.eventType === 'password_reset_request') {
    const resetRequests = await db('security_events')
      .where({
        user_id: event.userId,
        event_type: 'password_reset_request',
      })
      .where('created_at', '>', timeWindow)
      .count('* as count');

    if (resetRequests[0].count >= SUSPICIOUS_PATTERNS.RESET_REQUESTS.threshold) {
      await reportSuspiciousActivity({
        type: 'multiple_reset_requests',
        userId: event.userId,
        details: {
          attempts: resetRequests[0].count,
          ipAddress: event.ipAddress,
          timeWindow: '1 hour',
        },
      });
    }
  }

  // Check for rapid-fire requests
  const rapidWindow = new Date(
    event.timestamp.getTime() - SUSPICIOUS_PATTERNS.RAPID_REQUESTS.timeWindow
  );
  const rapidRequests = await db('security_events')
    .where({
      user_id: event.userId,
    })
    .where('created_at', '>', rapidWindow)
    .count('* as count');

  if (rapidRequests[0].count >= SUSPICIOUS_PATTERNS.RAPID_REQUESTS.threshold) {
    await reportSuspiciousActivity({
      type: 'rapid_fire_requests',
      userId: event.userId,
      details: {
        requests: rapidRequests[0].count,
        timeWindow: '1 minute',
        ipAddress: event.ipAddress,
      },
    });
  }

  // Check for unusual activity patterns
  await detectUnusualPatterns(event);
}

async function detectUnusualPatterns(event: SecurityEvent) {
  // Get user's normal activity patterns
  const userPatterns = await db('security_events')
    .where('user_id', event.userId)
    .where('created_at', '>', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) // Last 30 days
    .select('ip_address', 'user_agent', 'created_at');

  // Check for new IP addresses
  const knownIPs = new Set(userPatterns.map((p) => p.ip_address));
  if (!knownIPs.has(event.ipAddress)) {
    await reportSuspiciousActivity({
      type: 'new_ip_address',
      userId: event.userId,
      details: {
        newIP: event.ipAddress,
        knownIPs: Array.from(knownIPs),
        userAgent: event.userAgent,
      },
    });
  }

  // Check for unusual time patterns
  const hour = event.timestamp.getHours();
  const userHours = userPatterns.map((p) => new Date(p.created_at).getHours());
  const unusualTime = !userHours.includes(hour);

  if (unusualTime) {
    await reportSuspiciousActivity({
      type: 'unusual_time',
      userId: event.userId,
      details: {
        activityHour: hour,
        usualHours: Array.from(new Set(userHours)),
        ipAddress: event.ipAddress,
      },
    });
  }
}

async function reportSuspiciousActivity(activity: {
  type: string;
  userId: string;
  details: Record<string, any>;
}) {
  // Log suspicious activity
  await db('suspicious_activities').insert({
    user_id: activity.userId,
    activity_type: activity.type,
    details: JSON.stringify(activity.details),
    created_at: new Date(),
  });

  // Get user details
  const user = await db('users').where('id', activity.userId).first();

  // Notify admins
  const adminUsers = await getAdminUsers();
  const dashboardUrl = `${process.env.SITE_URL}/admin/security`;

  for (const admin of adminUsers) {
    const notification = generateAdminNotificationEmail({
      adminName: admin.name,
      eventType: 'suspicious_activity',
      eventDetails: {
        activityType: activity.type,
        userEmail: user.email,
        timestamp: new Date().toISOString(),
        ...activity.details,
      },
      dashboardUrl,
    });

    await sendEmail({
      to: admin.email,
      subject: notification.subject,
      text: notification.text,
      html: notification.html,
    });
  }

  // If activity is severe, take immediate action
  if (activity.type === 'multiple_failed_logins' || activity.type === 'rapid_fire_requests') {
    await db('users').where('id', activity.userId).update({
      requires_verification: true,
      updated_at: new Date(),
    });
  }
}
