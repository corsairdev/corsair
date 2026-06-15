import { relations } from 'drizzle-orm';
import {
	boolean,
	index,
	integer,
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

export const integrationUrlTypes = ['issue', 'pr', 'docs'] as const;

export type IntegrationUrlType = (typeof integrationUrlTypes)[number];

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const integrationUrlTypeEnum = pgEnum(
	'integration_url_type',
	integrationUrlTypes,
);

export const authModeEnum = pgEnum('auth_mode', authModes);
export const triggerTypeEnum = pgEnum('trigger_type', triggerTypes);

export const integrationPhases = [
	'awaiting_issue',
	'awaiting_pr',
	'building',
	'ready_to_review',
	'finished',
	'released',
] as const;

export type IntegrationPhase = (typeof integrationPhases)[number];

export const integrationPhaseEnum = pgEnum(
	'integration_phase',
	integrationPhases,
);

export const integrationReleaseReasons = [
	'issue_timeout',
	'pr_timeout',
	'manual',
	'abuse',
] as const;

export type IntegrationReleaseReason =
	(typeof integrationReleaseReasons)[number];

export const integrationReleaseReasonEnum = pgEnum(
	'integration_release_reason',
	integrationReleaseReasons,
);

/** @deprecated Use IntegrationPhase */
export type UserIntegrationStatus = 'in_progress' | 'finished';

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
		points: integer('points').notNull().default(0),
		...timestamps,
	},
	(table) => [uniqueIndex('integrations_slug_idx').on(table.slug)],
);

export const integrationUrls = pgTable(
	'integration_urls',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		integrationId: text('integration_id')
			.notNull()
			.references(() => integrations.id, { onDelete: 'cascade' }),
		type: integrationUrlTypeEnum('type').notNull(),
		url: text('url').notNull(),
		...timestamps,
	},
	(table) => [
		index('integration_urls_integration_id_idx').on(table.integrationId),
		uniqueIndex('integration_urls_integration_type_idx').on(
			table.integrationId,
			table.type,
		),
	],
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

export const integrationStatus = pgTable(
	'integration_status',
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
		phase: integrationPhaseEnum('phase').notNull(),
		occurredAt: timestamp('occurred_at', { withTimezone: true })
			.notNull()
			.defaultNow(),
		issueDeadlineAt: timestamp('issue_deadline_at', { withTimezone: true }),
		prDeadlineAt: timestamp('pr_deadline_at', { withTimezone: true }),
		greptileScore: integer('greptile_score'),
		releaseReason: integrationReleaseReasonEnum('release_reason'),
		metadata: jsonb('metadata').$type<Record<string, unknown>>(),
	},
	(table) => [
		index('integration_status_integration_id_idx').on(table.integrationId),
		index('integration_status_user_id_idx').on(table.userId),
		index('integration_status_occurred_at_idx').on(table.occurredAt),
		index('integration_status_integration_occurred_idx').on(
			table.integrationId,
			table.occurredAt,
		),
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

export const tags = pgTable(
	'tags',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text('name').notNull(),
		slug: text('slug').notNull(),
		color: text('color').notNull().default('#e8f0fe'),
		...timestamps,
	},
	(table) => [uniqueIndex('tags_slug_idx').on(table.slug)],
);

export const integrationTags = pgTable(
	'integration_tags',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		integrationId: text('integration_id')
			.notNull()
			.references(() => integrations.id, { onDelete: 'cascade' }),
		tagId: text('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' }),
		...timestamps,
	},
	(table) => [
		index('integration_tags_integration_id_idx').on(table.integrationId),
		index('integration_tags_tag_id_idx').on(table.tagId),
		uniqueIndex('integration_tags_integration_tag_idx').on(
			table.integrationId,
			table.tagId,
		),
	],
);

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const integrationsRelations = relations(integrations, ({ many }) => ({
	authSchemes: many(authSchemes),
	integrationUrls: many(integrationUrls),
	integrationTags: many(integrationTags),
	operations: many(operations),
	triggers: many(triggers),
	statuses: many(integrationStatus),
}));

export const integrationUrlsRelations = relations(
	integrationUrls,
	({ one }) => ({
		integration: one(integrations, {
			fields: [integrationUrls.integrationId],
			references: [integrations.id],
		}),
	}),
);

export const integrationStatusRelations = relations(
	integrationStatus,
	({ one }) => ({
		integration: one(integrations, {
			fields: [integrationStatus.integrationId],
			references: [integrations.id],
		}),
		user: one(user, {
			fields: [integrationStatus.userId],
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

export const tagsRelations = relations(tags, ({ many }) => ({
	integrationTags: many(integrationTags),
}));

export const integrationTagsRelations = relations(
	integrationTags,
	({ one }) => ({
		integration: one(integrations, {
			fields: [integrationTags.integrationId],
			references: [integrations.id],
		}),
		tag: one(tags, {
			fields: [integrationTags.tagId],
			references: [tags.id],
		}),
	}),
);

// ---------------------------------------------------------------------------
// Inferred row types
// ---------------------------------------------------------------------------

export type Integration = typeof integrations.$inferSelect;
export type NewIntegration = typeof integrations.$inferInsert;

export type IntegrationUrlRow = typeof integrationUrls.$inferSelect;
export type NewIntegrationUrl = typeof integrationUrls.$inferInsert;

export type AuthSchemeRow = typeof authSchemes.$inferSelect;
export type NewAuthScheme = typeof authSchemes.$inferInsert;

export type OperationRow = typeof operations.$inferSelect;
export type NewOperation = typeof operations.$inferInsert;

export type TriggerRow = typeof triggers.$inferSelect;
export type NewTrigger = typeof triggers.$inferInsert;

export type IntegrationStatusRow = typeof integrationStatus.$inferSelect;
export type NewIntegrationStatusRow = typeof integrationStatus.$inferInsert;

export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;

export type IntegrationTag = typeof integrationTags.$inferSelect;
export type NewIntegrationTag = typeof integrationTags.$inferInsert;
