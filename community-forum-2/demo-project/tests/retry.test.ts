import request from 'supertest';
import app from '../src/index';
import { resetForTesting, setBackoffDelays } from '../src/queue/notification-queue';
import * as emailChannel from '../src/channels/email';

beforeEach(() => {
  resetForTesting();
  setBackoffDelays([10, 20, 40]); // Fast backoff for tests
  jest.restoreAllMocks();
});

describe('Retry mechanism', () => {
  it('should succeed after 2 failures then 1 success', async () => {
    let callCount = 0;
    jest.spyOn(emailChannel, 'sendEmail').mockImplementation(async () => {
      callCount++;
      if (callCount <= 2) {
        return { success: false, error: 'SMTP timeout' };
      }
      return { success: true };
    });

    const create = await request(app)
      .post('/notifications')
      .send({ channel: 'email', to: 'dev@orange.com', message: 'Test retry' });

    // Wait for async processing (fast backoff: 10ms + 20ms + margin)
    await new Promise((resolve) => setTimeout(resolve, 200));

    const status = await request(app).get(`/notifications/${create.body.id}`);

    expect(status.body.status).toBe('sent');
    expect(status.body.attempts).toBe(3);
    expect(callCount).toBe(3);
  });

  it('should move to dead letter after 3 consecutive failures', async () => {
    jest.spyOn(emailChannel, 'sendEmail').mockImplementation(async () => {
      return { success: false, error: 'SMTP timeout' };
    });

    const create = await request(app)
      .post('/notifications')
      .send({ channel: 'email', to: 'dev@orange.com', message: 'Will fail' });

    // Wait for async processing (3 attempts with fast backoff)
    await new Promise((resolve) => setTimeout(resolve, 300));

    const status = await request(app).get(`/notifications/${create.body.id}`);
    expect(status.body.status).toBe('failed');
    expect(status.body.attempts).toBe(3);

    const dlq = await request(app).get('/dead-letter');
    expect(dlq.body.count).toBe(1);
    expect(dlq.body.items[0].id).toBe(create.body.id);
  });

  it('should succeed on first attempt when channel works', async () => {
    jest.spyOn(emailChannel, 'sendEmail').mockImplementation(async () => {
      return { success: true };
    });

    const create = await request(app)
      .post('/notifications')
      .send({ channel: 'email', to: 'dev@orange.com', message: 'Works first try' });

    await new Promise((resolve) => setTimeout(resolve, 200));

    const status = await request(app).get(`/notifications/${create.body.id}`);
    expect(status.body.status).toBe('sent');
    expect(status.body.attempts).toBe(1);
  });
});
