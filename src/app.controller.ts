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
  private readonly FLUSH_INTERVAL = 20000; // 20 sekund
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly appService: AppService,
    private readonly rabbit: RabbitService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern(RabbitPatterns.PREPARE_FINES)
  async handleFineCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    // 1. Xabarni va uning ack-ma'lumotini xotiraga qo'shamiz
    this.buffer.push(data);
    this.messagesToAck.push(originalMsg);

    // 2. Agar taymer hali ishga tushmagan bo'lsa, vaqt bo'yicha yuborishni yoqamiz
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(channel), this.FLUSH_INTERVAL);
    }

    // 3. Agar limitga yetsak, vaqtni kutmasdan yuboramiz
    if (this.buffer.length >= this.BATCH_LIMIT) {
      await this.flush(channel);
    }
  }

  private async flush(channel: any) {
    // Agar massiv bo'sh bo'lsa, hech narsa qilmaymiz
    if (this.buffer.length === 0) return;

    // Taymerni tozalaymiz
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    try {
      const batchData = [...this.buffer];
      const batchMessages = [...this.messagesToAck];

      await this.rabbit.emitToWorker(batchData);

      console.log(`--- ${batchData.length} ta xabar Batch qilib yuborildi ---`);

      const lastMsg = batchMessages[batchMessages.length - 1];
      channel.ack(lastMsg, true); // true - barcha oldingi xabarlarni ham ack qiladi

      // Xotirani tozalaymiz
      this.buffer = [];
      this.messagesToAck = [];
    } catch (error) {
      console.error('Batch yuborishda xato:', error);
      const lastMsg = this.messagesToAck[this.messagesToAck.length - 1];
      channel.nack(lastMsg, true, true);

      this.buffer = [];
      this.messagesToAck = [];
    }
  }
}
