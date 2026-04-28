import { registerAs } from '@nestjs/config';

export default registerAs('rabbit', () => {
  const user = process.env.RABBITMQ_USER || 'guest';
  const pass = process.env.RABBITMQ_PASS || 'guest';
  const host = process.env.RABBITMQ_HOST || '127.0.0.1';
  const port = process.env.RABBITMQ_PORT || '5672';

  return {
    url: `amqp://${user}:${pass}@${host}:${port}`,
    queues: {
      // Kiruvchi navbat
      incoming: process.env.RMQ_INCOMING_QUEUE || 'fines_incoming',
      // Chiquvchi navbat
      collector: process.env.RMQ_COLLECTED_QUEUE || 'fines_collected',
    },

    prefetch: parseInt(process.env.RABBITMQ_PREFETCH || '10', 10),
    heartbeat: parseInt(process.env.RABBITMQ_HEARTBEAT || '60', 10),
  };
});
