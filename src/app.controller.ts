import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @EventPattern('fine_created_event') // SIZ TOPGAN PATTERN
  handleFineCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('--- YANGI XABAR KELDI ---');
    console.log('Ma’lumot:', data);

    // RabbitMQ-dagi texnik ma'lumotlarni ko'rish uchun (ixtiyoriy)
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    console.log('Queue:', context.getPattern());
  }
}
