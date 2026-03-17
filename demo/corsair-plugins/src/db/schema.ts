import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const corsair_integrations = sqliteTable('corsair_integrations', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	name: text('name').notNull(),
	config: text('config', { mode: 'json' }),
	dek: text('dek'),
});

export const corsair_accounts = sqliteTable('corsair_accounts', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	tenant_id: text('tenant_id').notNull(),
	integration_id: text('integration_id')
		.notNull()
		.references(() => corsair_integrations.id),
	config: text('config', { mode: 'json' }),
	dek: text('dek'),
});

export const corsair_entities = sqliteTable('corsair_entities', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	account_id: text('account_id').notNull(),
	entity_id: text('entity_id').notNull(),
	entity_type: text('entity_type').notNull(),
	version: text('version').notNull(),
	data: text('data', { mode: 'json' }).notNull(),
});

export const corsair_events = sqliteTable('corsair_events', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	account_id: text('account_id').notNull(),
	event_type: text('event_type').notNull(),
	payload: text('payload', { mode: 'json' }).notNull(),
	status: text('status'),
});

export const corsair_permissions = sqliteTable('corsair_permissions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.$defaultFn(() => new Date()),
	/** 32-byte hex-encoded secure random token, single-use. Embedded in the review URL. */
	token: text('token').notNull(),
	/** Plugin identifier, e.g. 'github' */
	plugin: text('plugin').notNull(),
	/** Dot-notation endpoint path, e.g. 'repositories.delete' */
	endpoint: text('endpoint').notNull(),
	/** JSON-encoded args that will be forwarded to the endpoint upon approval */
	args: text('args', { mode: 'json' }).notNull(),
	/** Agent session ID from the orchestrator (NanoClaw / OpenClaw) — used to resume the agent */
	session_id: text('session_id'),
	/** URL to POST to when the action is approved or denied, to resume the agent */
	callback_url: text('callback_url'),
	/** Full public review page URL (ngrok URL + path + token query param) */
	review_url: text('review_url'),
	/** Current state of the approval request */
	status: text('status'),
	/** ISO8601 timestamp — when this request becomes invalid */
	expires_at: integer('expires_at', { mode: 'timestamp' }),
	tenant_id: text('tenant_id'),
});
