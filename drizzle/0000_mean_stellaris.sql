CREATE TABLE "failed_fines" (
	"id" serial PRIMARY KEY NOT NULL,
	"payload" jsonb,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
