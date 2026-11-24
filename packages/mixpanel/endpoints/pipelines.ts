import { z } from 'zod';
import type { MixpanelCredentials, MixpanelRequest } from '../client';
import { op } from './call';
import { DateSchema, FORM, form, LooseObject } from './common';

// Data Pipelines (/nessie) export raw or schematized data to a warehouse or
// bucket. It is a paid add-on: a free project answers 401 "authorization
// failed" (live, 11-24). Bodies are form-encoded.

const PipelineName = z
	.string()
	.min(1)
	.describe('The pipeline name, from pipelines.list.');

const RESERVED_SETTINGS = [
	'project_id',
	'name',
	'type',
	'trial',
	'from_date',
	'to_date',
];

/**
 * Destination fields only; the reserved ones have their own inputs. List
 * settings (bq_share_with_group) are sent JSON-encoded, like `events`.
 */
const Settings = z
	.record(
		z.string(),
		z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
	)
	.refine((value) => RESERVED_SETTINGS.every((key) => !(key in value)), {
		message: `settings cannot set ${RESERVED_SETTINGS.join(', ')}`,
	});

function post(
	path: string,
	c: MixpanelCredentials,
	// unknown: validated form fields.
	fields: Record<string, unknown>,
): MixpanelRequest {
	return {
		service: 'data',
		method: 'POST',
		path,
		// The connected project comes last so no field can redirect the call.
		body: form({ ...fields, project_id: c.projectId }),
		mediaType: FORM,
	};
}

// unknown: Data Pipelines answers are not specified beyond "JSON object".
const PipelineAnswer = z.union([LooseObject, z.array(z.unknown())]);

export const list = op({
	name: 'pipelines.list',
	input: z.object({}),
	output: z.object({ pipelines: PipelineAnswer }),
	meta: {
		riskLevel: 'read',
		description: 'List the data pipelines of the project',
	},
	toRequest: (_input, c) => ({
		service: 'data',
		method: 'GET',
		path: '/nessie/pipeline/jobs',
		query: { project_id: c.projectId },
	}),
	shape: (raw) => ({ pipelines: raw }),
});

export const create = op({
	name: 'pipelines.create',
	input: z.object({
		type: z
			.enum([
				'gcs-raw',
				's3-raw',
				'azure-raw',
				'bigquery',
				'snowflake',
				'aws',
				'azure-blob',
				'gcs-schema',
			])
			.describe(
				'Where to export: raw to a bucket, or schematized to a warehouse.',
			),
		from_date: DateSchema.optional().describe(
			'Start of the export window (at most six months back); required unless trial is true.',
		),
		to_date: DateSchema.optional().describe(
			'End of the window; omit to keep exporting.',
		),
		trial: z.boolean().optional().describe('A free 30-day trial pipeline.'),
		data_source: z.enum(['events', 'people']).optional(),
		frequency: z.enum(['daily', 'hourly']).optional(),
		events: z.array(z.string()).optional().describe('Only these events.'),
		where: z.string().optional(),
		data_format: z.string().optional(),
		settings: Settings.optional().describe(
			'Destination fields for this type, e.g. gcs_bucket and gcs_region, s3_bucket, s3_region and s3_role, bq_region, snowflake_*, azure_*.',
		),
	}),
	output: PipelineAnswer,
	meta: {
		riskLevel: 'destructive',
		description:
			'Create a data pipeline that exports project data to a bucket or warehouse (a paid add-on that bills while it runs)',
	},
	toRequest: ({ settings, events, ...fields }, c) =>
		post('/nessie/pipeline/create', c, { ...settings, ...fields, events }),
});

export const edit = op({
	name: 'pipelines.edit',
	input: z.object({
		name: PipelineName,
		events: z.array(z.string()).optional(),
		where: z.string().optional(),
		settings: Settings.optional().describe(
			'Other fields the pipeline type allows editing.',
		),
	}),
	output: PipelineAnswer,
	meta: {
		riskLevel: 'write',
		description: "Change a pipeline's event filter or settings",
	},
	toRequest: ({ settings, ...fields }, c) =>
		post('/nessie/pipeline/edit', c, { ...settings, ...fields }),
	shape: (raw) => raw ?? {},
});

function byName(
	name: string,
	action: 'cancel' | 'pause' | 'resume',
	riskLevel: 'write' | 'destructive',
	description: string,
) {
	return op({
		name,
		input: z.object({ name: PipelineName }),
		output: PipelineAnswer,
		meta: {
			riskLevel,
			description,
			...(action === 'cancel' ? { irreversible: true } : {}),
		},
		toRequest: (input, c) => post(`/nessie/pipeline/${action}`, c, input),
		shape: (raw) => raw ?? {},
	});
}

export const cancel = byName(
	'pipelines.delete',
	'cancel',
	'destructive',
	'Delete (cancel) a data pipeline',
);
export const pause = byName(
	'pipelines.pause',
	'pause',
	'write',
	'Pause a data pipeline',
);
export const resume = byName(
	'pipelines.resume',
	'resume',
	'write',
	'Resume a paused data pipeline',
);

export const status = op({
	name: 'pipelines.status',
	input: z.object({
		name: PipelineName,
		summary: z.boolean().optional().describe('True for counts only.'),
		status: z
			.array(
				z.enum([
					'pending',
					'running',
					'retried',
					'failed',
					'canceled',
					'timed_out',
					'succeeded',
				]),
			)
			.optional(),
	}),
	output: z
		.object({
			canceled: z.array(LooseObject).nullish(),
			retried: z.array(LooseObject).nullish(),
			succeeded: z.array(LooseObject).nullish(),
		})
		.loose(),
	meta: {
		riskLevel: 'read',
		description: "Get a pipeline's export jobs by status",
	},
	toRequest: (input, c) => ({
		service: 'data',
		method: 'GET',
		path: '/nessie/pipeline/status',
		query: {
			project_id: c.projectId,
			name: input.name,
			summary: input.summary === undefined ? undefined : String(input.summary),
			status: input.status,
		},
	}),
});

export const timeline = op({
	name: 'pipelines.timeline',
	input: z.object({ name: PipelineName.optional() }),
	output: z.object({ timeline: PipelineAnswer }),
	meta: {
		riskLevel: 'read',
		description: 'List the dates a pipeline has synced',
	},
	toRequest: (input, c) => ({
		service: 'data',
		method: 'GET',
		path: '/nessie/pipeline/timeline',
		query: { project_id: c.projectId, name: input.name },
	}),
	shape: (raw) => ({ timeline: raw }),
});
