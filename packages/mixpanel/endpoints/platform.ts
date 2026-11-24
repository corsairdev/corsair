import { z } from 'zod';
import type { MixpanelCredentials } from '../client';
import { segment } from '../client';
import { op } from './call';
import { IdSchema, LooseObject, OrganizationIdSchema } from './common';

// The Platform API (platform-us/-eu/-in.mixpanel.com/v1) manages Lexicon data
// definitions and tags, project- or workspace-scoped, and queries
// organization audit logs. On a free project the definition routes answer a
// structured 404 (live, 11-24): the API is not enabled for every plan yet.

const Workspace = IdSchema.optional().describe(
	'Use the workspace-scoped route for this workspace instead of the project.',
);

function scope(c: MixpanelCredentials, workspaceId: number | undefined) {
	return workspaceId === undefined
		? `/v1/projects/${c.projectId}`
		: `/v1/workspaces/${workspaceId}`;
}

const DefinitionType = z.enum([
	'event',
	'custom_event',
	'event_property',
	'custom_property',
	'metric',
	'behavior',
	'cohort',
]);

const DefinitionSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		description: z.string().nullish(),
		display_name: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		owners: z.array(LooseObject).nullish(),
		hidden: z.boolean().nullish(),
		blocked: z.boolean().nullish(),
		verified: z.boolean().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

const Pagination = z
	.object({
		previous_cursor: z.string().nullish(),
		next_cursor: z.string().nullish(),
	})
	.loose()
	.nullish();

const Page = {
	page_size: z.number().int().positive().max(1000).optional(),
	cursor: z.string().optional().describe('next_cursor from the previous page.'),
	order: z.enum(['asc', 'desc']).optional(),
};

const Owner = z.object({
	type: z.string().min(1).describe('user or team'),
	id: z.string().min(1),
});

const DefinitionId = z.string().min(1).describe('The data definition id.');
const TagId = z.string().min(1).describe('The tag id.');

const TagSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		entity_count: z.number().nullish(),
	})
	.loose();

// ── data definitions ──────────────────────────────────────────────────────

export const listDefinitions = op({
	name: 'dataDefinitions.list',
	input: z.object({
		workspace_id: Workspace,
		...Page,
		name: z.string().optional(),
		type: z.array(DefinitionType).optional(),
		event_name: z.string().optional(),
		hidden: z.boolean().optional(),
		blocked: z.boolean().optional(),
		verified: z.boolean().optional(),
		has_description: z.boolean().optional(),
		has_owner: z.boolean().optional(),
		tag: z.array(z.string()).optional(),
	}),
	output: z
		.object({ results: z.array(DefinitionSchema), pagination: Pagination })
		.loose(),
	meta: {
		riskLevel: 'read',
		description:
			'List Lexicon data definitions (events, properties, metrics, cohorts) with filters, paged by cursor',
	},
	toRequest: ({ workspace_id, type, tag, ...query }, c) => ({
		service: 'platform',
		method: 'GET',
		path: `${scope(c, workspace_id)}/data-definitions`,
		query: { ...query, type, tag },
	}),
});

export const getDefinition = op({
	name: 'dataDefinitions.get',
	input: z.object({ workspace_id: Workspace, definition_id: DefinitionId }),
	output: DefinitionSchema,
	meta: { riskLevel: 'read', description: 'Get one Lexicon data definition' },
	toRequest: (input, c) => ({
		service: 'platform',
		method: 'GET',
		path: `${scope(c, input.workspace_id)}/data-definitions/${segment(input.definition_id)}`,
	}),
});

export const createDefinition = op({
	name: 'dataDefinitions.create',
	input: z
		.object({
			workspace_id: Workspace,
			type: DefinitionType,
			name: z.string().min(1),
			description: z.string().nullable().optional(),
			display_name: z.string().nullable().optional(),
			tags: z.array(z.string()).optional(),
			owners: z.array(Owner).optional(),
			event_name: z
				.string()
				.nullable()
				.optional()
				.describe('For event properties.'),
			definition: LooseObject.optional().describe(
				'For custom events, custom properties, metrics, behaviors and cohorts.',
			),
		})
		.loose(),
	output: DefinitionSchema,
	meta: {
		riskLevel: 'write',
		description:
			'Create a Lexicon data definition (event, property, custom event, metric, behavior or cohort)',
	},
	toRequest: ({ workspace_id, ...body }, c) => ({
		service: 'platform',
		method: 'POST',
		path: `${scope(c, workspace_id)}/data-definitions`,
		body,
		mediaType: 'application/json',
	}),
});

const ListPatch = <T extends z.ZodType>(value: T) =>
	z.object({
		operation: z.enum(['add', 'set', 'remove']),
		values: z.array(value),
	});

export const updateDefinition = op({
	name: 'dataDefinitions.update',
	input: z.object({
		workspace_id: Workspace,
		definition_id: DefinitionId,
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		display_name: z.string().nullable().optional(),
		tags: ListPatch(z.string()).optional(),
		owners: ListPatch(Owner).optional(),
		hidden: z.boolean().optional(),
		blocked: z
			.boolean()
			.optional()
			.describe('True drops the data at ingestion.'),
		verified: z.boolean().optional(),
	}),
	output: DefinitionSchema,
	meta: {
		riskLevel: 'destructive',
		description:
			"Update a data definition's description, display name, tags, owners or hidden/blocked/verified flags; blocked: true drops its data at ingestion",
	},
	toRequest: ({ workspace_id, definition_id, ...body }, c) => ({
		service: 'platform',
		method: 'PATCH',
		path: `${scope(c, workspace_id)}/data-definitions/${segment(definition_id)}`,
		body,
		mediaType: 'application/json',
	}),
});

export const deleteDefinition = op({
	name: 'dataDefinitions.delete',
	input: z.object({ workspace_id: Workspace, definition_id: DefinitionId }),
	output: z
		.object({ entity: LooseObject.nullish(), deleted_at: z.string().nullish() })
		.loose(),
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a data definition',
	},
	toRequest: (input, c) => ({
		service: 'platform',
		method: 'DELETE',
		path: `${scope(c, input.workspace_id)}/data-definitions/${segment(input.definition_id)}`,
	}),
});

const MergeOutput = z
	.object({
		canonical: LooseObject.nullish(),
		sources: z.array(LooseObject).nullish(),
	})
	.loose();

export const mergeDefinitions = op({
	name: 'dataDefinitions.merge',
	input: z.object({
		workspace_id: Workspace,
		type: z.enum(['event', 'event_property']),
		canonical: z
			.string()
			.min(1)
			.describe('The definition the others merge into.'),
		sources: z.array(z.string().min(1)).min(1),
	}),
	output: MergeOutput,
	meta: {
		riskLevel: 'write',
		description:
			'Merge event or property definitions into one canonical definition',
	},
	toRequest: ({ workspace_id, ...body }, c) => ({
		service: 'platform',
		method: 'POST',
		path: `${scope(c, workspace_id)}/data-definitions/merge`,
		body,
		mediaType: 'application/json',
	}),
});

export const unmergeDefinitions = op({
	name: 'dataDefinitions.unmerge',
	input: z.object({
		workspace_id: Workspace,
		type: z.enum(['event', 'event_property']),
		canonical: z.string().min(1),
		sources: z
			.array(z.string().min(1))
			.optional()
			.describe('Omit to unmerge every source.'),
	}),
	output: MergeOutput,
	meta: { riskLevel: 'write', description: 'Undo a merge of data definitions' },
	toRequest: ({ workspace_id, ...body }, c) => ({
		service: 'platform',
		method: 'POST',
		path: `${scope(c, workspace_id)}/data-definitions/unmerge`,
		body,
		mediaType: 'application/json',
	}),
});

// ── data definition tags ──────────────────────────────────────────────────

export const listTags = op({
	name: 'dataDefinitionTags.list',
	input: z.object({
		workspace_id: Workspace,
		...Page,
		sort: z.enum(['name', 'entity_count']).optional(),
	}),
	output: z
		.object({ results: z.array(TagSchema), pagination: Pagination })
		.loose(),
	meta: {
		riskLevel: 'read',
		description: 'List data definition tags with their usage counts',
	},
	toRequest: ({ workspace_id, ...query }, c) => ({
		service: 'platform',
		method: 'GET',
		path: `${scope(c, workspace_id)}/data-definition-tags`,
		query,
	}),
});

export const getTag = op({
	name: 'dataDefinitionTags.get',
	input: z.object({ workspace_id: Workspace, tag_id: TagId }),
	output: TagSchema,
	meta: { riskLevel: 'read', description: 'Get one data definition tag' },
	toRequest: (input, c) => ({
		service: 'platform',
		method: 'GET',
		path: `${scope(c, input.workspace_id)}/data-definition-tags/${segment(input.tag_id)}`,
	}),
});

export const createTag = op({
	name: 'dataDefinitionTags.create',
	input: z.object({ workspace_id: Workspace, name: z.string().min(1) }),
	output: TagSchema,
	meta: { riskLevel: 'write', description: 'Create a data definition tag' },
	toRequest: ({ workspace_id, ...body }, c) => ({
		service: 'platform',
		method: 'POST',
		path: `${scope(c, workspace_id)}/data-definition-tags`,
		body,
		mediaType: 'application/json',
	}),
});

export const renameTag = op({
	name: 'dataDefinitionTags.rename',
	input: z.object({
		workspace_id: Workspace,
		tag_id: TagId,
		name: z.string().min(1),
	}),
	output: TagSchema,
	meta: { riskLevel: 'write', description: 'Rename a data definition tag' },
	toRequest: ({ workspace_id, tag_id, ...body }, c) => ({
		service: 'platform',
		method: 'PATCH',
		path: `${scope(c, workspace_id)}/data-definition-tags/${segment(tag_id)}`,
		body,
		mediaType: 'application/json',
	}),
});

export const deleteTag = op({
	name: 'dataDefinitionTags.delete',
	input: z.object({ workspace_id: Workspace, tag_id: TagId }),
	output: LooseObject,
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a data definition tag (it is removed from every definition)',
	},
	toRequest: (input, c) => ({
		service: 'platform',
		method: 'DELETE',
		path: `${scope(c, input.workspace_id)}/data-definition-tags/${segment(input.tag_id)}`,
	}),
	shape: (raw) => raw ?? {},
});

// ── audit logs ────────────────────────────────────────────────────────────

export const queryAuditLogs = op({
	name: 'auditLogs.query',
	input: z.object({
		organization_id: OrganizationIdSchema,
		...Page,
		user_ids: z.array(z.string()).optional(),
		user_emails: z.array(z.string()).optional(),
		exclude_user_ids: z.array(z.string()).optional(),
		exclude_user_emails: z.array(z.string()).optional(),
		types: z.array(z.string()).optional().describe('Audit event types.'),
		services: z.array(z.string()).optional(),
		project_ids: z.array(z.string()).optional(),
		created_after: z.string().optional().describe('ISO 8601.'),
		created_before: z.string().optional().describe('ISO 8601.'),
		user_email_search: z.string().optional(),
	}),
	output: z
		.object({ results: z.array(LooseObject), pagination: Pagination })
		.loose(),
	meta: {
		riskLevel: 'read',
		description:
			"Query the organization's audit log (who changed what, when), filtered by user, type, service and date",
	},
	toRequest: ({ organization_id, page_size, cursor, order, ...body }) => ({
		service: 'platform',
		method: 'POST',
		path: `/v1/organizations/${organization_id}/audit-logs/query`,
		query: { page_size, cursor, order },
		body,
		mediaType: 'application/json',
	}),
	// Audit entries name the people who acted; only counts are logged.
	log: (_input, result) => ({ entries: result.results.length }),
});
