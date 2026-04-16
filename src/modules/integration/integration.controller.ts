import {
  Controller,
  HttpCode,
  Post,
  Body,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';

@Controller('integrations')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('fines-webhook')
  @HttpCode(HttpStatus.OK)
  finesWebhook(@Body() data: any) {
    // Biznes mantiqni fonda boshladik
    this.integrationService.processIncomingWebhook(data).catch((err) => {
      // Agar processIncomingWebhook ichida biron bir kutilmagan
      // "portlash" bo'lsa, u mana shu yerga keladi.
      // Server o'chib qolmaydi, shunchaki xatoni konsolga yozadi.
      Logger.error('Background process error:', err);
    });

    return { success: true };
  }
}
