import express from 'express';
import notificationsRouter from './routes/notifications';
import { createLogger } from './middleware/logger';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/', notificationsRouter);

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    const logger = createLogger('server');
    logger.info(`Notification service started on port ${PORT}`);
  });
}

export default app;
