import {
  Controller,
  HttpCode,
  Post,
  Body,
  HttpStatus,
  Logger,
  HttpException,
} from '@nestjs/common';
import { InboundService } from './inbound.service';

@Controller('car-fines')
export class InboundController {
  constructor(private readonly inboundService: InboundService) {}

  @Post('create')
  @HttpCode(HttpStatus.OK)
  async createFinesByTelecomSoft(@Body() data: any) {
    try {
      await this.inboundService.processIncomingWebhookTelecomSoft(data);
      return { success: true };
    } catch (error) {
      Logger.error('Webhook TelecomSoft, RabbitMQ-ga yuborishda xato:', error);
      throw new HttpException(
        'Webhook not accepted',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  @Post('notification/synchronize')
  @HttpCode(HttpStatus.OK)
  async createFinesByASBT(@Body() data: any) {
    try {
      await this.inboundService.processIncomingWebhookASBT(data);
      return { success: true };
    } catch (error) {
      Logger.error('Webhook ASBT, RabbitMQ-ga yuborishda xato:', error);
      throw new HttpException(
        'Webhook not accepted',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
