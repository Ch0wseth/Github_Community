import { v4 as uuidv4 } from 'uuid';

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  correlationId: string;
  message: string;
  data?: Record<string, unknown>;
}

export function createLogger(correlationId?: string) {
  const id = correlationId || uuidv4();

  function log(level: LogEntry['level'], message: string, data?: Record<string, unknown>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      correlationId: id,
      message,
      ...(data && { data }),
    };
    console.log(JSON.stringify(entry));
  }

  return {
    info: (message: string, data?: Record<string, unknown>) => log('info', message, data),
    warn: (message: string, data?: Record<string, unknown>) => log('warn', message, data),
    error: (message: string, data?: Record<string, unknown>) => log('error', message, data),
    correlationId: id,
  };
}
