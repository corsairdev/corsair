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

export const corsair_permissions = pgTable('corsair_permissions', {
	id: uuid('id').primaryKey().defaultRandom(),
	created_at: timestamp('created_at').notNull().defaultNow(),
	updated_at: timestamp('updated_at').notNull().defaultNow(),
	/** 32-byte hex-encoded secure random token, single-use. Embedded in the review URL. */
	token: text('token').notNull(),
	/** Plugin identifier, e.g. 'github' */
	plugin: text('plugin').notNull(),
	/** Dot-notation endpoint path, e.g. 'repositories.delete' */
	endpoint: text('endpoint').notNull(),
	/** JSON-encoded args that will be forwarded to the endpoint upon approval */
	args: jsonb('args').notNull(),
	/** Agent session ID from the orchestrator (NanoClaw / OpenClaw) — used to resume the agent */
	session_id: text('session_id'),
	/** URL to POST to when the action is approved or denied, to resume the agent */
	callback_url: text('callback_url'),
	/** Full public review page URL (ngrok URL + path + token query param) */
	review_url: text('review_url'),
	/** Current state of the approval request */
	status: text('status'),
	/** ISO8601 timestamp — when this request becomes invalid */
	expires_at: timestamp('expires_at'),
});
