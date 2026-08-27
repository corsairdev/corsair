import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

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

export const corsair_accounts = sqliteTable(
	'corsair_accounts',
	{
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
	},
	(table) => [
		index('corsair_accounts_tenant_integration_idx').on(
			table.tenant_id,
			table.integration_id,
		),
	],
);

export const corsair_entities = sqliteTable(
	'corsair_entities',
	{
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
	},
	(table) => [
		index('corsair_entities_account_type_entity_idx').on(
			table.account_id,
			table.entity_type,
			table.entity_id,
		),
	],
);

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
