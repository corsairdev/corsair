import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const corsair_providers = pgTable('corsair_providers', {
	id: text('id').primaryKey(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
	name: text('name').notNull(),
	config: jsonb('config').notNull(),
});

export const corsair_connections = pgTable('corsair_connections', {
	id: text('id').primaryKey(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
	tenant_id: text('tenant_id').notNull(),
	connection_id: text('connection_id').notNull(),
	config: jsonb('config').notNull(),
});

export const corsair_resources = pgTable('corsair_resources', {
	id: text('id').primaryKey(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
	tenant_id: text('tenant_id').notNull(),
	resource_id: text('resource_id').notNull(),
	resource: text('resource').notNull(),
	service: text('service').notNull(),
	version: text('version').notNull(),
	data: jsonb('data').notNull(),
});

export const corsair_events = pgTable('corsair_events', {
	id: text('id').primaryKey(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
	tenant_id: text('tenant_id').notNull(),
	event_type: text('event_type').notNull(),
	payload: jsonb('payload').notNull(),
	status: text('status'),
});
