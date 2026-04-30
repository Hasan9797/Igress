import { pgTable, serial, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const failedFines = pgTable('failed_fines', {
  id: serial('id').primaryKey(),
  payload: jsonb('payload').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
