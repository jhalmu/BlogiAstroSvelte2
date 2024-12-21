import db from '../db';

export type ActivityAction =
  | 'login'
  | 'logout'
  | 'password_reset_request'
  | 'password_reset'
  | 'profile_update'
  | 'post_create'
  | 'post_update'
  | 'post_delete';

export async function logActivity(
  userId: string,
  action: ActivityAction,
  details?: string,
  ipAddress?: string
): Promise<void> {
  await db('user_activities').insert({
    user_id: userId,
    action,
    details,
    ip_address: ipAddress,
  });
}

export async function getUserActivities(userId: string, limit = 50): Promise<any[]> {
  return db('user_activities')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit);
}

export async function getRecentActivities(limit = 50): Promise<any[]> {
  return db('user_activities')
    .join('users', 'user_activities.user_id', 'users.id')
    .select('user_activities.*', 'users.name as user_name', 'users.email as user_email')
    .orderBy('user_activities.created_at', 'desc')
    .limit(limit);
}
