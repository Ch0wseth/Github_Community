import request from 'supertest';
import app from '../src/index';
import { resetForTesting } from '../src/queue/notification-queue';

beforeEach(() => {
  resetForTesting();
});

describe('POST /notifications', () => {
  it('should create a notification and return 201', async () => {
    const res = await request(app)
      .post('/notifications')
      .send({ channel: 'slack', to: '#general', message: 'Hello team!' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('queued');
  });

  it('should return 400 if channel is missing', async () => {
    const res = await request(app)
      .post('/notifications')
      .send({ to: 'dev@orange.com', message: 'Hello' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing required fields');
  });

  it('should return 400 if channel is invalid', async () => {
    const res = await request(app)
      .post('/notifications')
      .send({ channel: 'sms', to: '+33612345678', message: 'Hello' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Invalid channel');
  });

  it('should return 400 if message is missing', async () => {
    const res = await request(app)
      .post('/notifications')
      .send({ channel: 'email', to: 'dev@orange.com' });

    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Missing required fields');
  });
});

describe('GET /notifications/:id', () => {
  it('should return notification status', async () => {
    const create = await request(app)
      .post('/notifications')
      .send({ channel: 'slack', to: '#alerts', message: 'Deploy OK' });

    const res = await request(app).get(`/notifications/${create.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(create.body.id);
    expect(res.body.channel).toBe('slack');
  });

  it('should return 404 for unknown id', async () => {
    const res = await request(app).get('/notifications/unknown-id');
    expect(res.status).toBe(404);
  });
});

describe('GET /health', () => {
  it('should return health status with stats', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('sent');
    expect(res.body).toHaveProperty('failed');
    expect(res.body).toHaveProperty('queueSize');
    expect(res.body).toHaveProperty('deadLetterSize');
  });
});

describe('GET /dead-letter', () => {
  it('should return empty dead letter queue initially', async () => {
    const res = await request(app).get('/dead-letter');

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(0);
    expect(res.body.items).toEqual([]);
  });
});
