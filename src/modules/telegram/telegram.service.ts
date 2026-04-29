import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly bot: Telegraf;
  private readonly chatId: string;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('telegram.token');
    const chatId = this.configService.get<string>('telegram.chatId');

    if (!token || !chatId) throw new Error('Telegram config xato!');

    this.bot = new Telegraf(token);
    this.chatId = chatId;
  }

  // Faqat shu funksiya sizga kerak!
  async notify(message: string) {
    try {
      await this.bot.telegram.sendMessage(this.chatId, message, {
        parse_mode: 'Markdown',
      });
    } catch (error: any) {
      this.logger.error('Telegramga xabar yuborishda xato:', error.message);
    }
  }
}
