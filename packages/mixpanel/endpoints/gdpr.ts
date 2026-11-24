import { z } from 'zod';
import { requireProjectToken, segment } from '../client';
import { op } from './call';
import { okEnvelope } from './common';

// The GDPR API takes the project token as `token` in the query and a GDPR
// OAuth token as a bearer token; a service account gets 401 "You do not have
// the required scope(s)" (live, 11-24).

const DistinctIds = z
	.array(z.string().min(1))
	.min(1)
	.describe('The users the request covers.');

const ComplianceType = z
	.enum(['GDPR', 'CCPA'])
	.optional()
	.describe('Defaults to GDPR.');

const JobStatus = z
	.string()
	.describe(
		'PENDING, STAGING, STARTED, SUCCESS, FAILURE, REVOKED, NOT_FOUND or UNKNOWN.',
	);

const JobCreated = okEnvelope(
	z.object({ task_id: z.string().nullish() }).loose(),
);

const TrackingId = z
	.string()
	.min(1)
	.describe('The task_id the create call returned.');

export const createRetrieval = op({
	name: 'gdpr.createRetrieval',
	input: z.object({
		distinct_ids: DistinctIds,
		compliance_type: ComplianceType,
		disclosure_type: z
			.enum(['Data', 'Categories', 'Sources'])
			.optional()
			.describe('CCPA only: what to disclose. Defaults to Data.'),
	}),
	output: JobCreated,
	meta: {
		riskLevel: 'write',
		description:
			'Start a GDPR/CCPA data retrieval job that exports everything stored about the given users',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'POST',
		path: '/data-retrievals/v3.0',
		auth: 'gdpr',
		query: { token: requireProjectToken(c) },
		body: input,
		mediaType: 'application/json',
	}),
	log: (input) => ({ users: input.distinct_ids.length }),
});

export const getRetrieval = op({
	name: 'gdpr.getRetrieval',
	input: z.object({ tracking_id: TrackingId }),
	output: okEnvelope(
		z
			.object({
				status: JobStatus.nullish(),
				results: z
					.string()
					.nullish()
					.describe('Link to the export once the job succeeded.'),
				distinct_ids: z.array(z.string()).nullish(),
			})
			.loose(),
	),
	meta: { riskLevel: 'read', description: 'Check a GDPR data retrieval job' },
	toRequest: (input, c) => ({
		service: 'app',
		method: 'GET',
		path: `/data-retrievals/v3.0/${segment(input.tracking_id)}`,
		auth: 'gdpr',
		query: { token: requireProjectToken(c) },
	}),
});

export const createDeletion = op({
	name: 'gdpr.createDeletion',
	input: z.object({
		distinct_ids: DistinctIds,
		compliance_type: ComplianceType,
	}),
	output: JobCreated,
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Start a GDPR/CCPA deletion job that permanently deletes all events and profile data of the given users',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'POST',
		path: '/data-deletions/v3.0',
		auth: 'gdpr',
		query: { token: requireProjectToken(c) },
		body: input,
		mediaType: 'application/json',
	}),
	log: (input) => ({ users: input.distinct_ids.length }),
});

export const getDeletion = op({
	name: 'gdpr.getDeletion',
	input: z.object({ tracking_id: TrackingId }),
	output: okEnvelope(
		z
			.object({
				tracking_id: z.string().nullish(),
				status: JobStatus.nullish(),
				requesting_user: z.string().nullish(),
				compliance_type: z.string().nullish(),
				project_id: z.number().nullish(),
				date_requested: z.string().nullish(),
				distinct_ids: z.array(z.string()).nullish(),
			})
			.loose(),
	),
	meta: { riskLevel: 'read', description: 'Check a GDPR deletion job' },
	toRequest: (input, c) => ({
		service: 'app',
		method: 'GET',
		path: `/data-deletions/v3.0/${segment(input.tracking_id)}`,
		auth: 'gdpr',
		query: { token: requireProjectToken(c) },
	}),
});

export const cancelDeletion = op({
	name: 'gdpr.cancelDeletion',
	input: z.object({ tracking_id: TrackingId }),
	output: z.object({ status: z.string().nullish() }).loose(),
	meta: {
		riskLevel: 'write',
		description: 'Cancel a GDPR deletion job that has not started yet',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'DELETE',
		path: `/data-deletions/v3.0/${segment(input.tracking_id)}`,
		auth: 'gdpr',
		query: { token: requireProjectToken(c) },
	}),
	shape: (raw) => raw ?? {},
});
