import { relations } from 'drizzle-orm';
import {
	boolean,
	index,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core';

import { user } from './auth-schema';

// ---------------------------------------------------------------------------
// JSON document types (mirrors output/*.json)
// ---------------------------------------------------------------------------

export const parameterTypes = [
	'string',
	'integer',
	'number',
	'boolean',
	'array',
	'object',
	'unknown',
	'null',
	'$undefined',
] as const;

export type ParameterType = (typeof parameterTypes)[number];

export type ParameterEnumValue = string | number;

/** Recursive parameter schema used by operations and triggers. */
export type Parameter = {
	type: ParameterType;
	description?: string;
	required?: boolean;
	title?: string;
	enum?: ParameterEnumValue[];
	/** Field names or internal schema refs (e.g. "$17:props:..."). */
	requiredFields?: string[] | string;
	properties?: Record<string, Parameter>;
	items?: Parameter;
};

export type Parameters = Record<string, Parameter> | null;

export type AuthField = {
	name: string;
	displayName: string;
	type: string;
	description?: string;
	required: boolean;
	default?: unknown;
};

export const authModes = [
	'API_KEY',
	'OAUTH2',
	'OAUTH1',
	'BASIC',
	'BASIC_WITH_JWT',
	'BEARER_TOKEN',
	'DCR_OAUTH',
	'GOOGLE_SERVICE_ACCOUNT',
	'NO_AUTH',
	'S2S_OAUTH2',
	'SAML',
] as const;

export type AuthMode = (typeof authModes)[number];

export type AuthScheme = {
	mode: AuthMode;
	name: string;
	required_fields: AuthField[];
	optional_fields: AuthField[];
};

export type Operation = {
	slug: string;
	name: string;
	description: string;
	tags: string[];
	is_deprecated: boolean;
	input_parameters: Parameters;
	output_parameters: Parameters;
};

export const triggerTypes = ['poll', 'webhook'] as const;

export type TriggerType = (typeof triggerTypes)[number];

export type Trigger = {
	slug: string;
	name: string;
	description: string;
	type: TriggerType;
	configuration: Parameters;
	payload: Parameters;
};

/** Top-level integration document from output/*.json */
export type IntegrationDetail = {
	name: string;
	slug: string;
	description: string;
	auth_schemes: AuthScheme[];
	operations: Operation[];
	triggers: Trigger[];
};

export type IntegrationUrls = {
	issueUrl?: string | null;
	prUrl?: string | null;
	docsUrl?: string | null;
};

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const authModeEnum = pgEnum('auth_mode', authModes);
export const triggerTypeEnum = pgEnum('trigger_type', triggerTypes);

export const userIntegrationEventTypes = ['claimed', 'unclaimed'] as const;

export type UserIntegrationEventType =
	(typeof userIntegrationEventTypes)[number];

export const userIntegrationEventTypeEnum = pgEnum(
	'user_integration_event_type',
	userIntegrationEventTypes,
);

const timestamps = {
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => new Date()),
};

// ---------------------------------------------------------------------------
// Tables
// ---------------------------------------------------------------------------

export const integrations = pgTable(
	'integrations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		description: text('description').notNull(),
		show: boolean('show').notNull().default(true),
		urls: jsonb('urls').$type<IntegrationUrls>().notNull().default({}),
		...timestamps,
	},
	(table) => [uniqueIndex('integrations_slug_idx').on(table.slug)],
);

export const authSchemes = pgTable(
	'auth_schemes',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		integrationId: text('integration_id')
			.notNull()
			.references(() => integrations.id, { onDelete: 'cascade' }),
		mode: authModeEnum('mode').notNull(),
		name: text('name').notNull(),
		requiredFields: jsonb('required_fields')
			.$type<AuthField[]>()
			.notNull()
			.default([]),
		optionalFields: jsonb('optional_fields')
			.$type<AuthField[]>()
			.notNull()
			.default([]),
		...timestamps,
	},
	(table) => [
		index('auth_schemes_integration_id_idx').on(table.integrationId),
		uniqueIndex('auth_schemes_integration_name_idx').on(
			table.integrationId,
			table.name,
		),
	],
);

export const operations = pgTable(
	'operations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		integrationId: text('integration_id')
			.notNull()
			.references(() => integrations.id, { onDelete: 'cascade' }),
		slug: text('slug').notNull(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		tags: text('tags').array().notNull().default([]),
		isDeprecated: boolean('is_deprecated').notNull().default(false),
		inputParameters: jsonb('input_parameters').$type<Parameters>(),
		outputParameters: jsonb('output_parameters').$type<Parameters>(),
		...timestamps,
	},
	(table) => [
		index('operations_integration_id_idx').on(table.integrationId),
		uniqueIndex('operations_integration_slug_idx').on(
			table.integrationId,
			table.slug,
		),
	],
);

export const userIntegrations = pgTable(
	'user_integrations',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		integrationId: text('integration_id')
			.notNull()
			.references(() => integrations.id, { onDelete: 'cascade' }),
		...timestamps,
	},
	(table) => [
		uniqueIndex('user_integrations_integration_id_idx').on(table.integrationId),
		index('user_integrations_user_id_idx').on(table.userId),
	],
);

export const userIntegrationEvents = pgTable(
	'user_integration_events',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		integrationId: text('integration_id')
			.notNull()
			.references(() => integrations.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		type: userIntegrationEventTypeEnum('type').notNull(),
		createdAt: timestamp('created_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(table) => [
		index('user_integration_events_integration_id_idx').on(table.integrationId),
		index('user_integration_events_created_at_idx').on(table.createdAt),
	],
);

export const triggers = pgTable(
	'triggers',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		integrationId: text('integration_id')
			.notNull()
			.references(() => integrations.id, { onDelete: 'cascade' }),
		slug: text('slug').notNull(),
		name: text('name').notNull(),
		description: text('description').notNull(),
		type: triggerTypeEnum('type').notNull(),
		configuration: jsonb('configuration').$type<Parameters>(),
		payload: jsonb('payload').$type<Parameters>(),
		...timestamps,
	},
	(table) => [
		index('triggers_integration_id_idx').on(table.integrationId),
		uniqueIndex('triggers_integration_slug_idx').on(
			table.integrationId,
			table.slug,
		),
	],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const integrationsRelations = relations(integrations, ({ many }) => ({
	authSchemes: many(authSchemes),
	operations: many(operations),
	triggers: many(triggers),
	userIntegrations: many(userIntegrations),
	userIntegrationEvents: many(userIntegrationEvents),
}));

export const userIntegrationsRelations = relations(
	userIntegrations,
	({ one }) => ({
		integration: one(integrations, {
			fields: [userIntegrations.integrationId],
			references: [integrations.id],
		}),
		user: one(user, {
			fields: [userIntegrations.userId],
			references: [user.id],
		}),
	}),
);

export const userIntegrationEventsRelations = relations(
	userIntegrationEvents,
	({ one }) => ({
		integration: one(integrations, {
			fields: [userIntegrationEvents.integrationId],
			references: [integrations.id],
		}),
		user: one(user, {
			fields: [userIntegrationEvents.userId],
			references: [user.id],
		}),
	}),
);

export const authSchemesRelations = relations(authSchemes, ({ one }) => ({
	integration: one(integrations, {
		fields: [authSchemes.integrationId],
		references: [integrations.id],
	}),
}));

export const operationsRelations = relations(operations, ({ one }) => ({
	integration: one(integrations, {
		fields: [operations.integrationId],
		references: [integrations.id],
	}),
}));

export const triggersRelations = relations(triggers, ({ one }) => ({
	integration: one(integrations, {
		fields: [triggers.integrationId],
		references: [integrations.id],
	}),
}));

// ---------------------------------------------------------------------------
// Inferred row types
// ---------------------------------------------------------------------------

export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;

export type AuthSchemeRow = typeof authSchemes.$inferSelect;
export type NewAuthScheme = typeof authSchemes.$inferInsert;

export type OperationRow = typeof operations.$inferSelect;
export type NewOperation = typeof operations.$inferInsert;

export type TriggerRow = typeof triggers.$inferSelect;
export type NewTrigger = typeof triggers.$inferInsert;

export type UserIntegration = typeof userIntegrations.$inferSelect;
export type NewUserIntegration = typeof userIntegrations.$inferInsert;

export type UserIntegrationEvent = typeof userIntegrationEvents.$inferSelect;
export type NewUserIntegrationEvent = typeof userIntegrationEvents.$inferInsert;
