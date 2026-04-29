import { registerAs } from '@nestjs/config';

export default registerAs('telegram', () => ({
  token: process.env.TELEGRAM_BOT_TOKEN || 'SIZNING_BOT_TOKENINGIZ',
  chatId: process.env.TELEGRAM_CHAT_ID || 'SIZNING_CHAT_ID',
}));
