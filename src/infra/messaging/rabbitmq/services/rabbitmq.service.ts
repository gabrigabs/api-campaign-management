import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: Connection;
  private channel: Channel;
  private readonly queueName: string;
  private readonly mqUrl: string;

  constructor(private configService: ConfigService) {
    this.queueName = this.configService.getOrThrow<string>('RABBITMQ_QUEUE');
    this.mqUrl = this.configService.getOrThrow<string>('RABBITMQ_URL');
  }
  async onModuleInit() {
    try {
      this.connection = await connect(this.mqUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.queueName, {
        durable: true,
      });
      this.logger.log('RabbitMQ connected');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ');
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  sendToQueue<T>(message: T) {
    return this.channel.sendToQueue(
      this.queueName,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }

  async sendToQueueBatch<T>(messages: T[]) {
    for (const message of messages) {
      const result = this.sendToQueue(message);
      if (!result) {
        await new Promise<void>((resolve) => {
          this.channel.once('drain', () => resolve());
        });
      }
    }
  }
}
