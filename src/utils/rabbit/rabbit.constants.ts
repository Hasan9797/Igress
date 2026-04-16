export const RABBIT_SERVICE_NAME = 'RABBIT_MQ_CLIENT';

// 2. Navbatlar ro'yxati (Enum ko'rinishida)
export enum RabbitQueues {
  FINES_QUEUE = 'fines_queue',
  DRIVERS_QUEUE = 'drivers_queue',
}

export enum RabbitPatterns {
  FINE_CREATED = 'fine_created_event', // Webhookdan kelgan jarima
  FINE_UPDATED = 'fine_updated_event', // Jarima o'zgarganda
  FINE_ERROR = 'fine_error_event', // Xatolik xabari uchun
}
