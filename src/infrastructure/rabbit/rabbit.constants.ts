export const RABBIT_PREPARE_CLIENT = 'PREPARE_CLIENT';
export const RABBIT_WORKER_CLIENT = 'WORKER_CLIENT';

// 2. Navbatlar ro'yxati (Enum ko'rinishida)
export enum RabbitQueues {
  PREPARE_FINES_QUEUE = 'prepare_fines_queue',
  WORKER_FINES_QUEUE = 'worker_fines_queue',
}

export enum RabbitPatterns {
  PREPARE_FINES = 'prepare_fines_event', // Webhookdan kelgan jarima
  WORKER_FINES = 'worker_fines_event', // Workerga yuboriladigan jarima
  FINE_ERROR = 'fine_error_event', // Xatolik xabari uchun
}
