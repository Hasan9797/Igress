import {
  Controller,
  HttpCode,
  Post,
  Body,
  HttpStatus,
  Logger,
  Get,
} from '@nestjs/common';
import { FailedFinesService } from './failed-fines.service';

@Controller('failed-fines')
export class FailedFinesController {
  constructor(private readonly failedFinesService: FailedFinesService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getFailedFines() {
    // Bu yerda xatolik bilan ishlangan jarayonlar ro'yxatini qaytarish mumkin
    return { success: true, data: [] };
  }

  @Get('/get')
  @HttpCode(HttpStatus.OK)
  processFailedFines() {
    // Bu yerda xatolik bilan ishlangan jarayonlar ro'yxatini qaytarish mumkin
    return { success: true, data: [] };
  }

  @Post('retry')
  @HttpCode(HttpStatus.OK)
  saveFailedFines() {
    // Bu yerda xatolik bilan ishlangan jarayonlar ro'yxatini qaytarish mumkin
    return { success: true, data: [] };
  }

  @Post('update')
  @HttpCode(HttpStatus.OK)
  updateFailedFines() {
    // Bu yerda xatolik bilan ishlangan jarayonlar ro'yxatini qaytarish mumkin
    return { success: true, data: [] };
  }

  @Post('delete')
  @HttpCode(HttpStatus.OK)
  deleteFailedFines() {
    // Bu yerda xatolik bilan ishlangan jarayonlar ro'yxatini qaytarish mumkin
    return { success: true, data: [] };
  }
}
