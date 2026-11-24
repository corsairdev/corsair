import { z } from 'zod';
import { segment } from '../client';
import { op } from './call';
import { LooseObject, okEnvelope, PropertiesSchema } from './common';

// Lexicon schemas: JSON Schema (draft 7) descriptions of events and profile
// properties, used for data governance in the Mixpanel UI.

const EntityType = z
	.enum(['event', 'profile'])
	.describe('event for event schemas, profile for user profile schemas.');

const SchemaEntrySchema = z
	.object({
		entityType: z.string().nullish(),
		name: z.string().nullish(),
		schemaJson: PropertiesSchema.nullish(),
	})
	.loose();

const DeleteCount = okEnvelope(
	z.object({ delete_count: z.number().nullish() }).loose(),
);

// unknown: a draft-7 JSON Schema object, passed through as given.
const SchemaJson = z
	.object({
		description: z.string().optional(),
		properties: PropertiesSchema.optional(),
		metadata: PropertiesSchema.optional().describe(
			'Mixpanel metadata under "com.mixpanel": displayName, tags, hidden, dropped, contacts.',
		),
	})
	.loose();

const base = (projectId: number) => `/projects/${projectId}/schemas`;

export const list = op({
	name: 'lexicon.list',
	input: z.object({}),
	output: okEnvelope(z.array(SchemaEntrySchema)),
	meta: {
		riskLevel: 'read',
		description: 'List every Lexicon schema in the project',
	},
	toRequest: (_input, c) => ({
		service: 'app',
		method: 'GET',
		path: base(c.projectId),
	}),
});

export const listForEntity = op({
	name: 'lexicon.listForEntity',
	input: z.object({
		entity_type: EntityType,
		entity_name: z
			.string()
			.optional()
			.describe('Only the schema of this event or profile.'),
	}),
	// Live: with entity_name the results are that one JSON Schema object,
	// without it a list of entries.
	output: okEnvelope(z.union([z.array(SchemaEntrySchema), LooseObject])),
	meta: {
		riskLevel: 'read',
		description: 'List the Lexicon schemas for events or for profiles',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'GET',
		path: `${base(c.projectId)}/${input.entity_type}`,
		query: { entity_name: input.entity_name },
	}),
});

export const get = op({
	name: 'lexicon.get',
	input: z.object({
		entity_type: EntityType,
		name: z
			.string()
			.min(1)
			.describe('The event name, or $user for user profiles.'),
	}),
	output: LooseObject,
	meta: {
		riskLevel: 'read',
		description: 'Get the Lexicon schema of one event or profile type',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'GET',
		path: `${base(c.projectId)}/${input.entity_type}/${segment(input.name)}`,
	}),
});

export const upsert = op({
	name: 'lexicon.upsert',
	input: z.object({
		entity_type: EntityType,
		name: z.string().min(1),
		schema: SchemaJson.describe(
			'The JSON Schema to store, replacing any existing one.',
		),
	}),
	output: okEnvelope(LooseObject),
	meta: {
		riskLevel: 'destructive',
		description:
			'Create or replace the Lexicon schema of one event or profile type; metadata dropped: true makes Mixpanel drop that event at ingestion',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'POST',
		path: `${base(c.projectId)}/${input.entity_type}/${segment(input.name)}`,
		body: input.schema,
		mediaType: 'application/json',
	}),
});

export const upsertMany = op({
	name: 'lexicon.upsertMany',
	input: z.object({
		entries: z
			.array(
				z.object({
					entityType: EntityType,
					name: z.string().min(1),
					schemaJson: SchemaJson,
				}),
			)
			.min(1)
			.max(3000),
		truncate: z
			.boolean()
			.optional()
			.describe(
				'True deletes every schema not in this upload. Defaults to false.',
			),
	}),
	output: okEnvelope(
		z
			.object({ added: z.number().nullish(), deleted: z.number().nullish() })
			.loose(),
	),
	meta: {
		riskLevel: 'destructive',
		description:
			'Create or replace many Lexicon schemas at once; truncate deletes every schema not uploaded',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'POST',
		path: base(c.projectId),
		body: input,
		mediaType: 'application/json',
	}),
	log: (input) => ({ entries: input.entries.length, truncate: input.truncate }),
});

export const remove = op({
	name: 'lexicon.delete',
	input: z.object({ entity_type: EntityType, name: z.string().min(1) }),
	output: DeleteCount,
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the Lexicon schema of one event or profile type',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'DELETE',
		path: `${base(c.projectId)}/${input.entity_type}/${segment(input.name)}`,
	}),
});

export const removeForEntity = op({
	name: 'lexicon.deleteForEntity',
	input: z.object({
		entity_type: EntityType,
		entity_name: z.string().optional(),
	}),
	output: DeleteCount,
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete every Lexicon schema for events or for profiles',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'DELETE',
		path: `${base(c.projectId)}/${input.entity_type}`,
		query: { entity_name: input.entity_name },
	}),
});

export const removeAll = op({
	name: 'lexicon.deleteAll',
	input: z.object({}),
	output: DeleteCount,
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete every Lexicon schema in the project',
	},
	toRequest: (_input, c) => ({
		service: 'app',
		method: 'DELETE',
		path: base(c.projectId),
	}),
});
