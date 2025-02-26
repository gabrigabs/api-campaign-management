import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
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
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  sendToQueue(message: any) {
    return this.channel.sendToQueue(
      this.queueName,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );
  }
}
