import { jsonb, pgTable, text } from 'drizzle-orm/pg-core';

export const corsair_resources = pgTable('corsair_resources', {
	id: text('id').primaryKey(),
	tenant_id: text('tenant_id').notNull(),
	resource_id: text('resource_id').notNull(),
	resource: text('resource').notNull(),
	service: text('service').notNull(),
	version: text('version').notNull(),
	data: jsonb('data').notNull(),
});

export const corsair_credentials = pgTable('corsair_credentials', {
	id: text('id').primaryKey(),
	tenant_id: text('tenant_id').notNull(),
	resource: text('resource').notNull(),
	permissions: text('permissions').array().notNull(),
	credentials: jsonb('credentials').notNull(),
});
