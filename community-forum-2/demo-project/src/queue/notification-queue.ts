import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '../middleware/logger';
import { sendEmail } from '../channels/email';
import { sendSlack } from '../channels/slack';

export type NotificationChannel = 'email' | 'slack';
export type NotificationStatus = 'queued' | 'processing' | 'sent' | 'failed';

export interface Notification {
  id: string;
  channel: NotificationChannel;
  to: string;
  message: string;
  status: NotificationStatus;
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  lastAttemptAt?: string;
  error?: string;
}

const queue: Notification[] = [];
const deadLetterQueue: Notification[] = [];
const notifications: Map<string, Notification> = new Map();

let stats = { sent: 0, failed: 0 };
let backoffDelays = [1000, 2000, 4000];

export function setBackoffDelays(delays: number[]) {
  backoffDelays = delays;
}

export function enqueue(channel: NotificationChannel, to: string, message: string): Notification {
  const notification: Notification = {
    id: uuidv4(),
    channel,
    to,
    message,
    status: 'queued',
    attempts: 0,
    maxAttempts: 3,
    createdAt: new Date().toISOString(),
  };

  queue.push(notification);
  notifications.set(notification.id, notification);

  // Process async
  setImmediate(() => processQueue());

  return notification;
}

export function getNotification(id: string): Notification | undefined {
  return notifications.get(id);
}

export function getDeadLetterQueue(): Notification[] {
  return [...deadLetterQueue];
}

export function getStats() {
  return {
    sent: stats.sent,
    failed: stats.failed,
    queueSize: queue.length,
    deadLetterSize: deadLetterQueue.length,
  };
}

export function resetForTesting() {
  queue.length = 0;
  deadLetterQueue.length = 0;
  notifications.clear();
  stats = { sent: 0, failed: 0 };
}

async function processQueue() {
  while (queue.length > 0) {
    const notification = queue.shift()!;
    notification.status = 'processing';
    await processNotification(notification);
  }
}

async function processNotification(notification: Notification) {
  const logger = createLogger(notification.id);

  while (notification.attempts < notification.maxAttempts) {
    notification.attempts++;
    notification.lastAttemptAt = new Date().toISOString();

    logger.info(`Attempt ${notification.attempts}/${notification.maxAttempts}`, {
      channel: notification.channel,
      to: notification.to,
    });

    const result = await send(notification);

    if (result.success) {
      notification.status = 'sent';
      stats.sent++;
      logger.info('Notification delivered successfully');
      return;
    }

    notification.error = result.error;

    if (notification.attempts < notification.maxAttempts) {
      const delay = backoffDelays[notification.attempts - 1] || 4000;
      logger.warn(`Attempt failed, retrying in ${delay}ms`, {
        attempt: notification.attempts,
        error: result.error,
      });
      await sleep(delay);
    }
  }

  // All attempts exhausted → dead letter
  notification.status = 'failed';
  stats.failed++;
  deadLetterQueue.push(notification);
  logger.error('All attempts exhausted, moved to dead letter queue', {
    attempts: notification.attempts,
    lastError: notification.error,
  });
}

async function send(notification: Notification): Promise<{ success: boolean; error?: string }> {
  switch (notification.channel) {
    case 'email':
      return sendEmail(notification.to, notification.message, notification.id);
    case 'slack':
      return sendSlack(notification.to, notification.message, notification.id);
    default:
      return { success: false, error: `Unknown channel: ${notification.channel}` };
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
