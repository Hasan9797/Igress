import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RabbitPatterns } from './infrastructure/rabbit/rabbit.constants';
import { RabbitService } from './infrastructure/rabbit/rabbit.service';

@Controller()
export class AppController {
  private buffer: any[] = [];
  private messagesToAck: any[] = []; // Ack qilish uchun xabarlarning o'zi
  private readonly BATCH_LIMIT = 100;
  private readonly FLUSH_INTERVAL = 10000; // 10 sekund
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly appService: AppService,
    private readonly rabbit: RabbitService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern(RabbitPatterns.FINES_RECEIVED)
  async handleFineCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.buffer.push(data);
    this.messagesToAck.push(originalMsg);

    if (!this.timer) {
      this.timer = setTimeout(async () => {
        try {
          await this.flush(channel);
        } catch (error: any) {
          console.error(
            'Timer orqali flush qilishda kutilmagan xato:',
            error.message,
          );
        }
      }, this.FLUSH_INTERVAL);
    }

    if (this.buffer.length >= this.BATCH_LIMIT) {
      try {
        await this.flush(channel);
      } catch (flushError: any) {
        console.error('Limit orqali flush qilishda xato:', flushError.message);
      }
    }
  }

  private async flush(channel: any) {
    if (this.buffer.length === 0) return;

    // clearing the timer since we're flushing now
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    try {
      const batchData = [...this.buffer];
      const batchMessages = [...this.messagesToAck];

      await this.rabbit.emitToCollected(batchData);

      console.log(`--- ${batchData.length} ta xabar Batch qilib yuborildi ---`);

      const lastMsg = batchMessages[batchMessages.length - 1];
      channel.ack(lastMsg, true); // true - hamma xabarlarni ack qilish

      // Xotirani tozalaymiz
      this.buffer = [];
      this.messagesToAck = [];
    } catch (error: any) {
      const lastMsg = this.messagesToAck[this.messagesToAck.length - 1];
      channel.nack(lastMsg, true, true);
      this.buffer = [];
      this.messagesToAck = [];
    }
  }
}
