import {
  Controller,
  HttpCode,
  Post,
  Body,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { IntegrationService } from './inbound.service';

@Controller('integrations')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('fines-webhook')
  @HttpCode(HttpStatus.OK)
  finesWebhook(@Body() data: any) {
    this.integrationService.processIncomingWebhook(data).catch((err) => {
      Logger.error('Background process error:', err);
    });

    return { success: true };
  }
}
