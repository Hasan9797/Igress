import {
  Controller,
  HttpCode,
  Post,
  HttpStatus,
  Get,
  UseGuards,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { FailedFinesService } from './failed-fines.service';
import { AuthGuard } from '@/common/guards/auth.guard';

@Controller('failed-fines')
@UseGuards(AuthGuard)
export class FailedFinesController {
  constructor(private readonly failedFinesService: FailedFinesService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  async getFailedFines(@Query() query: any) {
    const data = await this.failedFinesService.getFailedFines(query);
    return { success: true, data };
  }

  @Get('find/:id')
  @HttpCode(HttpStatus.OK)
  async getFailedFine(@Param('id', ParseIntPipe) id: number) {
    const data = await this.failedFinesService.getFailedFine(id);
    return { success: true, data };
  }

  @Post('retry')
  @HttpCode(HttpStatus.OK)
  saveFailedFines() {
    return { success: true, data: [] };
  }

  @Post('delete')
  @HttpCode(HttpStatus.OK)
  deleteFailedFines() {
    return { success: true, data: [] };
  }
}
