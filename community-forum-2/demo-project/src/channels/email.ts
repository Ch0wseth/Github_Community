import { createLogger } from '../middleware/logger';

export interface SendResult {
  success: boolean;
  error?: string;
}

export async function sendEmail(to: string, message: string, correlationId: string): Promise<SendResult> {
  const logger = createLogger(correlationId);

  // Simulate 30% failure rate
  if (Math.random() < 0.3) {
    logger.error('Email delivery failed', { to, reason: 'SMTP timeout' });
    return { success: false, error: 'SMTP timeout - delivery failed' };
  }

  logger.info('Email sent successfully', { to, messagePreview: message.substring(0, 50) });
  return { success: true };
}
