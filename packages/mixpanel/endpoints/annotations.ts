import { z } from 'zod';
import { op } from './call';
import { DateSchema, IdSchema, okEnvelope } from './common';

const AnnotationSchema = z
	.object({
		id: z.number().nullish(),
		date: z.string().nullish(),
		description: z.string().nullish(),
		user: z
			.object({
				id: z.number().nullish(),
				first_name: z.string().nullish(),
				last_name: z.string().nullish(),
			})
			.loose()
			.nullish(),
		tags: z
			.array(
				z
					.object({ id: z.number().nullish(), name: z.string().nullish() })
					.loose(),
			)
			.nullish(),
	})
	.loose();

const TagSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		project_id: z.number().nullish(),
		has_annotations: z.boolean().nullish(),
	})
	.loose();

const AnnotationId = IdSchema.describe('The annotation id.');

const base = (projectId: number) => `/projects/${projectId}/annotations`;

export const list = op({
	name: 'annotations.list',
	input: z.object({
		fromDate: DateSchema.optional().describe(
			'Only annotations on or after this date.',
		),
		toDate: DateSchema.optional().describe(
			'Only annotations on or before this date.',
		),
	}),
	output: okEnvelope(z.array(AnnotationSchema)),
	meta: {
		riskLevel: 'read',
		description:
			'List the chart annotations in the project, optionally by date range',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'GET',
		path: base(c.projectId),
		query: { fromDate: input.fromDate, toDate: input.toDate },
	}),
});

export const get = op({
	name: 'annotations.get',
	input: z.object({ annotation_id: AnnotationId }),
	output: okEnvelope(AnnotationSchema),
	meta: { riskLevel: 'read', description: 'Get one annotation by id' },
	toRequest: (input, c) => ({
		service: 'app',
		method: 'GET',
		path: `${base(c.projectId)}/${input.annotation_id}`,
	}),
});

export const create = op({
	name: 'annotations.create',
	input: z.object({
		date: z
			.string()
			.min(1)
			.describe('When, as "YYYY-MM-DD HH:mm:ss" in the project timezone.'),
		description: z.string().min(1),
		tags: z.array(IdSchema).optional().describe('Annotation tag ids.'),
	}),
	output: okEnvelope(AnnotationSchema),
	meta: {
		riskLevel: 'write',
		description: 'Create a chart annotation marking an event on a date',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'POST',
		path: base(c.projectId),
		body: input,
		mediaType: 'application/json',
	}),
});

export const update = op({
	name: 'annotations.update',
	input: z.object({
		annotation_id: AnnotationId,
		description: z.string().min(1).optional(),
		tags: z.array(IdSchema).optional(),
	}),
	output: okEnvelope(AnnotationSchema),
	meta: {
		riskLevel: 'write',
		description: "Change an annotation's description or tags",
	},
	toRequest: ({ annotation_id, ...body }, c) => ({
		service: 'app',
		method: 'PATCH',
		path: `${base(c.projectId)}/${annotation_id}`,
		body,
		mediaType: 'application/json',
	}),
});

export const remove = op({
	name: 'annotations.delete',
	input: z.object({ annotation_id: AnnotationId }),
	output: okEnvelope(z.object({ id: z.number().nullish() }).loose()),
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an annotation',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'DELETE',
		path: `${base(c.projectId)}/${input.annotation_id}`,
	}),
});

export const listTags = op({
	name: 'annotations.listTags',
	input: z.object({}),
	output: z.object({ tags: z.array(TagSchema) }),
	meta: {
		riskLevel: 'read',
		description: 'List the annotation tags in the project',
	},
	toRequest: (_input, c) => ({
		service: 'app',
		method: 'GET',
		path: `${base(c.projectId)}/tags`,
	}),
	// The spec shows a bare array; the usual envelope is accepted too. Any
	// other shape fails the output schema rather than reading as no tags.
	// unknown: the raw body before the output schema parses it.
	shape: (raw: unknown) => ({
		tags: Array.isArray(raw)
			? raw
			: (raw as { results?: unknown } | null)?.results,
	}),
});

export const createTag = op({
	name: 'annotations.createTag',
	input: z.object({ name: z.string().min(1) }),
	output: TagSchema,
	meta: { riskLevel: 'write', description: 'Create an annotation tag' },
	toRequest: (input, c) => ({
		service: 'app',
		method: 'POST',
		path: `${base(c.projectId)}/tags`,
		body: input,
		mediaType: 'application/json',
	}),
	// Accept `{ status, results: tag }` as well as the bare tag.
	// unknown: the raw body before the output schema parses it.
	shape: (raw: unknown) => {
		const results = (raw as { results?: unknown } | null)?.results;
		return results && typeof results === 'object' ? results : raw;
	},
});
