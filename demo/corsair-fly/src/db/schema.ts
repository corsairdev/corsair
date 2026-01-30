import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const corsair_integrations = pgTable('corsair_integrations', {
	id: uuid('id').primaryKey().defaultRandom(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
	name: text('name').notNull(),
	config: jsonb('config'),
	dek: text('dek'),
});

export const corsair_accounts = pgTable('corsair_accounts', {
	id: uuid('id').primaryKey().defaultRandom(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
	tenant_id: text('tenant_id').notNull(),
	integration_id: uuid('integration_id')
		.notNull()
		.references(() => corsair_integrations.id),
	config: jsonb('config'),
	dek: text('dek'),
});

export const corsair_entities = pgTable('corsair_entities', {
	id: uuid('id').primaryKey().defaultRandom(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
	account_id: uuid('account_id').notNull(),
	entity_id: text('entity_id').notNull(),
	entity_type: text('entity_type').notNull(),
	version: text('version').notNull(),
	data: jsonb('data').notNull(),
});

export const corsair_events = pgTable('corsair_events', {
	id: uuid('id').primaryKey().defaultRandom(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
	account_id: uuid('account_id').notNull(),
	event_type: text('event_type').notNull(),
	payload: jsonb('payload').notNull(),
	status: text('status'),
});
