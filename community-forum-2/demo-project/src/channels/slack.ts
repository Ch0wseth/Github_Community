import { createLogger } from '../middleware/logger';

export interface SendResult {
  success: boolean;
  error?: string;
}

export async function sendSlack(to: string, message: string, correlationId: string): Promise<SendResult> {
  const logger = createLogger(correlationId);

  // Slack always succeeds (simulated)
  logger.info('Slack message sent successfully', { channel: to, messagePreview: message.substring(0, 50) });
  return { success: true };
}
