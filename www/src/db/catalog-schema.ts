import { relations } from 'drizzle-orm';
import {
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import type { IntegrationRiskLevel } from '@/lib/integration-page.types';
import type { IntegrationAuthType } from '@/lib/integrations-catalog.types';

const timestamps = {
	createdAt: timestamp('created_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
};

/** Synced Corsair plugin catalog — populated by hub/explorer `db:sync-integrations`. */
export const catalogIntegrations = pgTable('_integrations', {
	id: text('id').primaryKey(),
	displayName: text('display_name').notNull(),
	description: text('description').notNull().default(''),
	npmPackageName: text('npm_package_name').notNull(),
	authTypes: jsonb('auth_types')
		.$type<IntegrationAuthType[]>()
		.notNull()
		.default([]),
	defaultAuthType: text('default_auth_type'),
	apiCount: integer('api_count').notNull().default(0),
	webhooksCount: integer('webhooks_count').notNull().default(0),
	dbCount: integer('db_count').notNull().default(0),
	corsairVersion: text('corsair_version'),
	catalogGeneratedAt: timestamp('catalog_generated_at', { withTimezone: true }),
	syncedAt: timestamp('synced_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	...timestamps,
});

export const catalogIntegrationOperations = pgTable(
	'_integration_operations',
	{
		id: text('id').primaryKey(),
		integrationId: text('integration_id')
			.notNull()
			.references(() => catalogIntegrations.id, { onDelete: 'cascade' }),
		shortPath: text('short_path').notNull(),
		resource: text('resource').notNull(),
		name: text('name').notNull(),
		description: text('description'),
		riskLevel: text('risk_level').$type<IntegrationRiskLevel>(),
		path: text('path').notNull(),
		inputSchema: jsonb('input_schema'),
		outputSchema: jsonb('output_schema'),
		...timestamps,
	},
	(table) => [
		uniqueIndex('catalog_ops_integration_short_path_idx').on(
			table.integrationId,
			table.shortPath,
		),
	],
);

export const catalogIntegrationTriggers = pgTable(
	'_integration_triggers',
	{
		id: text('id').primaryKey(),
		integrationId: text('integration_id')
			.notNull()
			.references(() => catalogIntegrations.id, { onDelete: 'cascade' }),
		shortPath: text('short_path').notNull(),
		resource: text('resource').notNull(),
		name: text('name').notNull(),
		description: text('description'),
		path: text('path').notNull(),
		payloadSchema: jsonb('payload_schema'),
		...timestamps,
	},
	(table) => [
		uniqueIndex('catalog_triggers_integration_short_path_idx').on(
			table.integrationId,
			table.shortPath,
		),
	],
);

export const catalogIntegrationFaqs = pgTable(
	'_integration_faqs',
	{
		id: text('id').primaryKey(),
		integrationId: text('integration_id')
			.notNull()
			.references(() => catalogIntegrations.id, { onDelete: 'cascade' }),
		faqId: text('faq_id').notNull(),
		question: text('question').notNull(),
		answer: text('answer').notNull(),
		sortOrder: integer('sort_order').notNull().default(0),
		...timestamps,
	},
	(table) => [
		uniqueIndex('catalog_faqs_integration_faq_id_idx').on(
			table.integrationId,
			table.faqId,
		),
	],
);

export const catalogIntegrationsRelations = relations(
	catalogIntegrations,
	({ many }) => ({
		operations: many(catalogIntegrationOperations),
		triggers: many(catalogIntegrationTriggers),
		faqs: many(catalogIntegrationFaqs),
	}),
);

export const catalogIntegrationOperationsRelations = relations(
	catalogIntegrationOperations,
	({ one }) => ({
		integration: one(catalogIntegrations, {
			fields: [catalogIntegrationOperations.integrationId],
			references: [catalogIntegrations.id],
		}),
	}),
);

export const catalogIntegrationTriggersRelations = relations(
	catalogIntegrationTriggers,
	({ one }) => ({
		integration: one(catalogIntegrations, {
			fields: [catalogIntegrationTriggers.integrationId],
			references: [catalogIntegrations.id],
		}),
	}),
);

export const catalogIntegrationFaqsRelations = relations(
	catalogIntegrationFaqs,
	({ one }) => ({
		integration: one(catalogIntegrations, {
			fields: [catalogIntegrationFaqs.integrationId],
			references: [catalogIntegrations.id],
		}),
	}),
);

export type CatalogIntegration = typeof catalogIntegrations.$inferSelect;
export type CatalogIntegrationOperation =
	typeof catalogIntegrationOperations.$inferSelect;
export type CatalogIntegrationTrigger =
	typeof catalogIntegrationTriggers.$inferSelect;
export type CatalogIntegrationFaq = typeof catalogIntegrationFaqs.$inferSelect;
