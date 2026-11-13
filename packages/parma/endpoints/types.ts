import { z } from 'zod';

// IDs are single path segments, not arbitrary URL fragments.
export const routeId = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"']/.test(value),
		'Expected a safe path segment',
	);
const id = z.object({ id: routeId });
const relationshipId = z.object({ relationship_id: routeId });
const empty = z.object({});
const page = z.object({ page: z.string().optional() });
const relationshipFields = {
	name: z.string().optional(),
	type: z.enum(['person', 'company']).optional(),
	company_id: z.number().int().optional(),
	group_ids: z.array(z.number().int()).optional(),
	about: z.string().optional(),
};
const noteFields = {
	body: z.string().optional(),
	datetime: z.string().optional(),
	relationship_ids: z.array(z.number().int()).optional(),
};

export const ParmaEndpointInputSchemas = {
	listDeals: page,
	getDeal: id,
	listGroups: z.object({ query: z.string().optional() }),
	listNotes: page,
	createNote: z.object({
		...noteFields,
		body: z.string(),
		relationship_ids: z.array(z.number().int()),
	}),
	updateNote: z.object({ id: routeId, ...noteFields }),
	listPipelines: empty,
	getPipeline: id,
	listRelationshipGroups: relationshipId,
	addRelationshipGroup: relationshipId.extend({ group_id: z.number().int() }),
	removeRelationshipGroup: relationshipId.extend({
		relationship_group_id: routeId,
	}),
	listRelationshipNotes: relationshipId.extend({ page: z.string().optional() }),
	listRelationships: z.object({
		name: z.string().optional(),
		type: z.string().optional(),
		page: z.string().optional(),
		schedulinglink: z.string().optional(),
		linkedin: z.string().optional(),
		instagram: z.string().optional(),
		twitter: z.string().optional(),
		telegram: z.string().optional(),
		sms: z.string().optional(),
		phone: z.string().optional(),
		whatsapp: z.string().optional(),
		email: z.string().optional(),
	}),
	createRelationship: z.object({
		...relationshipFields,
		name: z.string(),
		group_ids: z.array(z.number().int()),
	}),
	getRelationship: id,
	updateRelationship: z.object({
		id: routeId,
		...relationshipFields,
		properties: z
			.array(z.object({ id: z.number().int(), value: z.string() }))
			.optional(),
	}),
	deleteRelationship: id,
	listStages: empty,
	getStage: id,
	listUsers: empty,
	getUser: id,
	getCurrentUser: empty,
} as const;

const timestamps = { created_at: z.string(), updated_at: z.string() };
const user = z
	.object({ id: z.number(), name: z.string(), email: z.string() })
	.passthrough();
const deal = z
	.object({
		id: z.number(),
		name: z.string(),
		amount: z.union([z.number(), z.string()]).nullable(),
		status: z.string(),
		relationship_id: z.number().nullable(),
		pipeline_id: z.number().nullable(),
		stage_id: z.number().nullable(),
		owned_by_id: z.number().nullable(),
		...timestamps,
		closed_at: z.string().nullable(),
	})
	.passthrough();
const group = z
	.object({
		id: z.number(),
		name: z.string(),
		properties: z.array(
			z
				.object({ id: z.number(), name: z.string(), type: z.string() })
				.passthrough(),
		),
	})
	.passthrough();
const note = z
	.object({
		id: z.number(),
		body: z.string(),
		datetime: z.string(),
		relationship_ids: z.array(z.number()),
		...timestamps,
	})
	.passthrough();
const pipeline = z
	.object({
		id: z.number(),
		name: z.string(),
		position: z.number(),
		...timestamps,
	})
	.passthrough();
const stage = pipeline.extend({ pipeline_id: z.number() });
const membership = z
	.object({ id: z.number(), group_id: z.number(), ...timestamps })
	.passthrough();
const relationship = z
	.object({
		id: z.number(),
		name: z.string(),
		type: z.string(),
		about: z.string().nullable(),
		company_id: z.number().nullable(),
		group_ids: z.array(z.number()),
		contact_details: z.array(
			z.object({ type: z.string(), value: z.string() }).passthrough(),
		),
		properties: z.array(
			z
				.object({
					id: z.number(),
					name: z.string(),
					value: z.string().nullable(),
				})
				.passthrough(),
		),
		...timestamps,
	})
	.passthrough();
const one = <T extends z.ZodType>(schema: T) =>
	z.object({ data: schema }).passthrough();
const list = <T extends z.ZodType>(schema: T) =>
	z
		.object({
			data: z.array(schema),
			meta: z.object({ count: z.number() }).passthrough().optional(),
		})
		.passthrough();

export const ParmaEndpointOutputSchemas = {
	listDeals: list(deal),
	getDeal: one(deal),
	listGroups: list(group),
	listNotes: list(note),
	createNote: one(note),
	updateNote: one(note),
	listPipelines: list(pipeline),
	getPipeline: one(pipeline),
	listRelationshipGroups: list(membership),
	addRelationshipGroup: one(membership),
	removeRelationshipGroup: z.void(),
	listRelationshipNotes: list(note),
	listRelationships: list(relationship),
	createRelationship: one(relationship),
	getRelationship: one(relationship),
	updateRelationship: one(relationship),
	deleteRelationship: z.void(),
	listStages: list(stage),
	getStage: one(stage),
	listUsers: list(user),
	// Parma's OpenAPI gives no success body schema or example for get-user.
	getUser: z.unknown(),
	getCurrentUser: one(
		z
			.object({
				user,
				account: z.object({ id: z.number(), name: z.string() }).passthrough(),
			})
			.passthrough(),
	),
} as const;

export type ParmaEndpointInputs = {
	[K in keyof typeof ParmaEndpointInputSchemas]: z.infer<
		(typeof ParmaEndpointInputSchemas)[K]
	>;
};
export type ParmaEndpointOutputs = {
	[K in keyof typeof ParmaEndpointOutputSchemas]: z.infer<
		(typeof ParmaEndpointOutputSchemas)[K]
	>;
};
