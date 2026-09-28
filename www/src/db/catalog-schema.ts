import { relations } from 'drizzle-orm';
import {
	integer,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import type { IntegrationRiskLevel } from '@/lib/integration-page.types';
import type { IntegrationAuthType } from '@/lib/integrations-catalog.types';

export const comboPickerItemTypes = ['trigger', 'action'] as const;
export type ComboPickerItemType = (typeof comboPickerItemTypes)[number];

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

/** Synced integration combo pages — populated by hub/explorer `db:sync-integration-combos`. */
export const catalogIntegrationCombos = pgTable('_integration_combos', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description').notNull().default(''),
	kbQuery: text('kb_query').notNull().default(''),
	kbAnswer: text('kb_answer').notNull().default(''),
	syncedAt: timestamp('synced_at', { withTimezone: true })
		.notNull()
		.defaultNow(),
	...timestamps,
});

export const catalogIntegrationComboMembers = pgTable(
	'_integration_combo_members',
	{
		comboId: text('combo_id')
			.notNull()
			.references(() => catalogIntegrationCombos.id, { onDelete: 'cascade' }),
		integrationId: text('integration_id')
			.notNull()
			.references(() => catalogIntegrations.id, { onDelete: 'cascade' }),
		sortOrder: integer('sort_order').notNull().default(0),
		worksWithBlurb: text('works_with_blurb').notNull().default(''),
		...timestamps,
	},
	(table) => [primaryKey({ columns: [table.comboId, table.integrationId] })],
);

export const catalogIntegrationComboPickerItems = pgTable(
	'_integration_combo_picker_items',
	{
		id: text('id').primaryKey(),
		comboId: text('combo_id')
			.notNull()
			.references(() => catalogIntegrationCombos.id, { onDelete: 'cascade' }),
		integrationId: text('integration_id')
			.notNull()
			.references(() => catalogIntegrations.id, { onDelete: 'cascade' }),
		itemType: text('item_type').$type<ComboPickerItemType>().notNull(),
		shortPath: text('short_path').notNull(),
		label: text('label').notNull(),
		description: text('description').notNull().default(''),
		sortOrder: integer('sort_order').notNull().default(0),
		...timestamps,
	},
	(table) => [
		uniqueIndex('catalog_combo_picker_combo_type_path_idx').on(
			table.comboId,
			table.itemType,
			table.integrationId,
			table.shortPath,
		),
	],
);

export const catalogIntegrationComboWorkflows = pgTable(
	'_integration_combo_workflows',
	{
		id: text('id').primaryKey(),
		comboId: text('combo_id')
			.notNull()
			.references(() => catalogIntegrationCombos.id, { onDelete: 'cascade' }),
		title: text('title').notNull(),
		description: text('description').notNull().default(''),
		triggerPickerItemId: text('trigger_picker_item_id')
			.notNull()
			.references(() => catalogIntegrationComboPickerItems.id, {
				onDelete: 'cascade',
			}),
		actionPickerItemId: text('action_picker_item_id')
			.notNull()
			.references(() => catalogIntegrationComboPickerItems.id, {
				onDelete: 'cascade',
			}),
		sortOrder: integer('sort_order').notNull().default(0),
		...timestamps,
	},
);

export const catalogIntegrationComboFaqs = pgTable(
	'_integration_combo_faqs',
	{
		id: text('id').primaryKey(),
		comboId: text('combo_id')
			.notNull()
			.references(() => catalogIntegrationCombos.id, { onDelete: 'cascade' }),
		faqId: text('faq_id').notNull(),
		question: text('question').notNull(),
		answer: text('answer').notNull(),
		sortOrder: integer('sort_order').notNull().default(0),
		...timestamps,
	},
	(table) => [
		uniqueIndex('catalog_combo_faqs_combo_faq_id_idx').on(
			table.comboId,
			table.faqId,
		),
	],
);

export const catalogIntegrationComboKbTools = pgTable(
	'_integration_combo_kb_tools',
	{
		id: text('id').primaryKey(),
		comboId: text('combo_id')
			.notNull()
			.references(() => catalogIntegrationCombos.id, { onDelete: 'cascade' }),
		op: text('op').notNull(),
		label: text('label').notNull(),
		result: text('result').notNull().default(''),
		sortOrder: integer('sort_order').notNull().default(0),
		...timestamps,
	},
);

export const catalogIntegrationComboKbToolApps = pgTable(
	'_integration_combo_kb_tool_apps',
	{
		toolId: text('tool_id')
			.notNull()
			.references(() => catalogIntegrationComboKbTools.id, {
				onDelete: 'cascade',
			}),
		integrationId: text('integration_id')
			.notNull()
			.references(() => catalogIntegrations.id, { onDelete: 'cascade' }),
		appLabel: text('app_label'),
		...timestamps,
	},
	(table) => [primaryKey({ columns: [table.toolId, table.integrationId] })],
);

export const catalogIntegrationComboKbSources = pgTable(
	'_integration_combo_kb_sources',
	{
		id: text('id').primaryKey(),
		comboId: text('combo_id')
			.notNull()
			.references(() => catalogIntegrationCombos.id, { onDelete: 'cascade' }),
		label: text('label').notNull(),
		href: text('href').notNull(),
		integrationId: text('integration_id')
			.notNull()
			.references(() => catalogIntegrations.id, { onDelete: 'cascade' }),
		sortOrder: integer('sort_order').notNull().default(0),
		...timestamps,
	},
);

export const catalogIntegrationCombosRelations = relations(
	catalogIntegrationCombos,
	({ many }) => ({
		members: many(catalogIntegrationComboMembers),
		pickerItems: many(catalogIntegrationComboPickerItems),
		workflows: many(catalogIntegrationComboWorkflows),
		faqs: many(catalogIntegrationComboFaqs),
		kbTools: many(catalogIntegrationComboKbTools),
		kbSources: many(catalogIntegrationComboKbSources),
	}),
);

export const catalogIntegrationComboMembersRelations = relations(
	catalogIntegrationComboMembers,
	({ one }) => ({
		combo: one(catalogIntegrationCombos, {
			fields: [catalogIntegrationComboMembers.comboId],
			references: [catalogIntegrationCombos.id],
		}),
		integration: one(catalogIntegrations, {
			fields: [catalogIntegrationComboMembers.integrationId],
			references: [catalogIntegrations.id],
		}),
	}),
);

export const catalogIntegrationComboPickerItemsRelations = relations(
	catalogIntegrationComboPickerItems,
	({ one, many }) => ({
		combo: one(catalogIntegrationCombos, {
			fields: [catalogIntegrationComboPickerItems.comboId],
			references: [catalogIntegrationCombos.id],
		}),
		integration: one(catalogIntegrations, {
			fields: [catalogIntegrationComboPickerItems.integrationId],
			references: [catalogIntegrations.id],
		}),
		workflowsAsTrigger: many(catalogIntegrationComboWorkflows, {
			relationName: 'workflowTrigger',
		}),
		workflowsAsAction: many(catalogIntegrationComboWorkflows, {
			relationName: 'workflowAction',
		}),
	}),
);

export const catalogIntegrationComboWorkflowsRelations = relations(
	catalogIntegrationComboWorkflows,
	({ one }) => ({
		combo: one(catalogIntegrationCombos, {
			fields: [catalogIntegrationComboWorkflows.comboId],
			references: [catalogIntegrationCombos.id],
		}),
		triggerPickerItem: one(catalogIntegrationComboPickerItems, {
			fields: [catalogIntegrationComboWorkflows.triggerPickerItemId],
			references: [catalogIntegrationComboPickerItems.id],
			relationName: 'workflowTrigger',
		}),
		actionPickerItem: one(catalogIntegrationComboPickerItems, {
			fields: [catalogIntegrationComboWorkflows.actionPickerItemId],
			references: [catalogIntegrationComboPickerItems.id],
			relationName: 'workflowAction',
		}),
	}),
);

export const catalogIntegrationComboFaqsRelations = relations(
	catalogIntegrationComboFaqs,
	({ one }) => ({
		combo: one(catalogIntegrationCombos, {
			fields: [catalogIntegrationComboFaqs.comboId],
			references: [catalogIntegrationCombos.id],
		}),
	}),
);

export const catalogIntegrationComboKbToolsRelations = relations(
	catalogIntegrationComboKbTools,
	({ one, many }) => ({
		combo: one(catalogIntegrationCombos, {
			fields: [catalogIntegrationComboKbTools.comboId],
			references: [catalogIntegrationCombos.id],
		}),
		apps: many(catalogIntegrationComboKbToolApps),
	}),
);

export const catalogIntegrationComboKbToolAppsRelations = relations(
	catalogIntegrationComboKbToolApps,
	({ one }) => ({
		tool: one(catalogIntegrationComboKbTools, {
			fields: [catalogIntegrationComboKbToolApps.toolId],
			references: [catalogIntegrationComboKbTools.id],
		}),
		integration: one(catalogIntegrations, {
			fields: [catalogIntegrationComboKbToolApps.integrationId],
			references: [catalogIntegrations.id],
		}),
	}),
);

export const catalogIntegrationComboKbSourcesRelations = relations(
	catalogIntegrationComboKbSources,
	({ one }) => ({
		combo: one(catalogIntegrationCombos, {
			fields: [catalogIntegrationComboKbSources.comboId],
			references: [catalogIntegrationCombos.id],
		}),
		integration: one(catalogIntegrations, {
			fields: [catalogIntegrationComboKbSources.integrationId],
			references: [catalogIntegrations.id],
		}),
	}),
);

export const catalogIntegrationsRelations = relations(
	catalogIntegrations,
	({ many }) => ({
		operations: many(catalogIntegrationOperations),
		triggers: many(catalogIntegrationTriggers),
		faqs: many(catalogIntegrationFaqs),
		comboMemberships: many(catalogIntegrationComboMembers),
	}),
);

export type CatalogIntegrationCombo =
	typeof catalogIntegrationCombos.$inferSelect;
export type CatalogIntegrationComboMember =
	typeof catalogIntegrationComboMembers.$inferSelect;
export type CatalogIntegrationComboPickerItem =
	typeof catalogIntegrationComboPickerItems.$inferSelect;
export type CatalogIntegrationComboWorkflow =
	typeof catalogIntegrationComboWorkflows.$inferSelect;
export type CatalogIntegrationComboFaq =
	typeof catalogIntegrationComboFaqs.$inferSelect;
export type CatalogIntegrationComboKbTool =
	typeof catalogIntegrationComboKbTools.$inferSelect;
export type CatalogIntegrationComboKbToolApp =
	typeof catalogIntegrationComboKbToolApps.$inferSelect;
export type CatalogIntegrationComboKbSource =
	typeof catalogIntegrationComboKbSources.$inferSelect;
