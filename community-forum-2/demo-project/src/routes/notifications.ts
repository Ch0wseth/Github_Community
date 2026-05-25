import { Router, Request, Response } from 'express';
import { enqueue, getNotification, getDeadLetterQueue, getStats, NotificationChannel } from '../queue/notification-queue';

const router = Router();

// POST /notifications — Submit a notification
router.post('/notifications', (req: Request, res: Response) => {
  const { channel, to, message } = req.body;

  // Validation
  if (!channel || !to || !message) {
    return res.status(400).json({
      error: 'Missing required fields: channel, to, message',
    });
  }

  if (!['email', 'slack'].includes(channel)) {
    return res.status(400).json({
      error: 'Invalid channel. Must be "email" or "slack"',
    });
  }

  const notification = enqueue(channel as NotificationChannel, to, message);

  return res.status(201).json({
    id: notification.id,
    status: notification.status,
  });
});

// GET /notifications/:id — Get notification status
router.get('/notifications/:id', (req: Request, res: Response) => {
  const notification = getNotification(req.params.id);

  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  return res.json({
    id: notification.id,
    channel: notification.channel,
    to: notification.to,
    status: notification.status,
    attempts: notification.attempts,
    createdAt: notification.createdAt,
    lastAttemptAt: notification.lastAttemptAt,
    error: notification.error,
  });
});

// GET /dead-letter — View failed notifications
router.get('/dead-letter', (_req: Request, res: Response) => {
  const deadLetters = getDeadLetterQueue();
  return res.json({
    count: deadLetters.length,
    items: deadLetters.map((n) => ({
      id: n.id,
      channel: n.channel,
      to: n.to,
      message: n.message,
      attempts: n.attempts,
      error: n.error,
      createdAt: n.createdAt,
      lastAttemptAt: n.lastAttemptAt,
    })),
  });
});

// GET /health — Health check with stats
router.get('/health', (_req: Request, res: Response) => {
  const stats = getStats();
  return res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    ...stats,
  });
});

export default router;
