import { performance } from 'perf_hooks';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
  component?: string;
  metrics?: PerformanceMetrics;
}

interface PerformanceMetrics {
  duration?: number;
  memory?: {
    heapUsed: number;
    heapTotal: number;
  };
  custom?: Record<string, number>;
}

interface AggregatedMetrics {
  count: number;
  averageDuration: number;
  maxDuration: number;
  minDuration: number;
  totalMemoryUsed: number;
  averageMemoryUsed: number;
  errorCount: number;
  customMetrics: Record<
    string,
    {
      total: number;
      average: number;
      max: number;
      min: number;
    }
  >;
}

class Logger {
  private static instance: Logger;
  private logBuffer: LogEntry[] = [];
  private readonly maxBufferSize = 1000;
  private readonly logLevels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };
  private performanceMarks: Map<string, number> = new Map();
  private isServer: boolean;

  private constructor() {
    this.isServer = typeof window === 'undefined';
    this.initializeLogger();
  }

  private async initializeLogger() {
    if (this.isServer) {
      try {
        const fs = await import('fs/promises');
        const path = await import('path');

        // Create logs directory if it doesn't exist
        const logDir = 'logs';
        await fs.mkdir(logDir, { recursive: true }).catch(() => {});

        // Set up periodic tasks
        setInterval(() => this.cleanupOldLogs(), 1000 * 60 * 60); // Clean every hour
        setInterval(() => this.aggregateAndSaveMetrics(), 1000 * 60 * 5); // Save metrics every 5 minutes
      } catch (error) {
        console.warn('Failed to initialize server-side logging:', error);
      }
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Performance monitoring
  public startPerformanceTimer(markerId: string) {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.performanceMarks.set(markerId, startTime);
  }

  public endPerformanceTimer(markerId: string): number {
    const startTime = this.performanceMarks.get(markerId);
    if (!startTime) return 0;

    const currentTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = currentTime - startTime;
    this.performanceMarks.delete(markerId);
    return duration;
  }

  private getMemoryUsage(): { heapUsed: number; heapTotal: number } | undefined {
    if (this.isServer && typeof process !== 'undefined') {
      const memoryUsage = process.memoryUsage();
      return {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
      };
    }
    return undefined;
  }

  private async writeToLogFile(entry: LogEntry) {
    if (!this.isServer) return;

    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const logDir = 'logs';
      const date = new Date().toISOString().split('T')[0];
      const logFile = path.join(logDir, `app-${date}.log`);

      const logLine =
        JSON.stringify({
          ...entry,
          error: entry.error
            ? {
                name: entry.error.name,
                message: entry.error.message,
                stack: entry.error.stack,
              }
            : undefined,
        }) + '\n';

      await fs.appendFile(logFile, logLine);
    } catch (error) {
      console.warn('Failed to write to log file:', error);
    }
  }

  private async cleanupOldLogs() {
    if (!this.isServer) return;

    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const logDir = 'logs';
      const files = await fs.readdir(logDir);
      const now = Date.now();
      const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

      for (const file of files) {
        if (file.startsWith('app-') && file.endsWith('.log')) {
          const filePath = path.join(logDir, file);
          const stats = await fs.stat(filePath);
          if (stats.birthtimeMs < sevenDaysAgo) {
            await fs.unlink(filePath);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to cleanup old logs:', error);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const configuredLevel = process.env.LOG_LEVEL || 'info';
    return this.logLevels[level] >= this.logLevels[configuredLevel as LogLevel];
  }

  private formatError(error: Error): Record<string, any> {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
    component?: string,
    metrics?: PerformanceMetrics
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? this.formatError(error) : undefined,
      component,
      metrics,
    };
  }

  public log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error,
    component?: string
  ) {
    if (!this.shouldLog(level)) return;

    const metrics: PerformanceMetrics = {};
    const memoryUsage = this.getMemoryUsage();
    if (memoryUsage) {
      metrics.memory = memoryUsage;
    }

    const entry = this.createLogEntry(level, message, context, error, component, metrics);

    // Add to in-memory buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Write to console
    this.logToConsole(entry);

    // Write to file if on server
    if (this.isServer) {
      this.writeToLogFile(entry).catch(console.warn);
    }
  }

  private logToConsole(entry: LogEntry) {
    const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}${
      entry.component ? ` [${entry.component}]` : ''
    }:`;

    switch (entry.level) {
      case 'error':
        console.error(prefix, entry.message, entry.context || '');
        if (entry.error) console.error(entry.error);
        break;
      case 'warn':
        console.warn(prefix, entry.message, entry.context || '');
        break;
      case 'info':
        console.info(prefix, entry.message, entry.context || '');
        break;
      case 'debug':
        console.debug(prefix, entry.message, entry.context || '');
        break;
    }
  }

  public debug(message: string, context?: Record<string, any>, component?: string) {
    this.log('debug', message, context, undefined, component);
  }

  public info(message: string, context?: Record<string, any>, component?: string) {
    this.log('info', message, context, undefined, component);
  }

  public warn(message: string, context?: Record<string, any>, component?: string) {
    this.log('warn', message, context, undefined, component);
  }

  public error(message: string, error?: Error, context?: Record<string, any>, component?: string) {
    this.log('error', message, context, error, component);
  }
}

export default Logger;
