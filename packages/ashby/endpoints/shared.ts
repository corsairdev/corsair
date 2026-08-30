import { AuthMissingError } from 'corsair/core';
import { makeAshbyRequest } from '../client';
import type { AshbyContext } from '../index';
import { AshbyEndpointInputSchemas, AshbyEndpointOutputSchemas } from './types';

const ENDPOINT_KEY_MAP: Record<string, keyof typeof AshbyEndpointInputSchemas> =
	{
		'interviewSchedule.list': 'interview.scheduleList',
		'interviewStage.list': 'interview.stageList',
	};

const PERSIST_READ_KEYS = new Set<string>([
	'candidate.info',
	'candidate.list',
	'candidate.search',
	'application.info',
	'application.list',
	'job.info',
	'job.list',
	'job.search',
	'jobPosting.info',
	'jobPosting.list',
	'offer.info',
	'offer.list',
	'department.info',
	'department.list',
	'location.info',
	'location.list',
	'user.info',
	'user.list',
	'user.search',
]);

function asRecord(value: unknown): Record<string, unknown> | null {
	if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
		return value as Record<string, unknown>;
	}
	return null;
}

function collectResults(parsed: unknown): Record<string, unknown>[] {
	const envelope = asRecord(parsed);
	if (!envelope) return [];
	const results = envelope.results;
	if (Array.isArray(results)) {
		return results
			.map((item) => asRecord(item))
			.filter((item): item is Record<string, unknown> => item !== null);
	}
	const single = asRecord(results);
	return single ? [single] : [];
}

function contactValue(value: unknown): string | null | undefined {
	if (value === null || value === undefined) return value;
	if (typeof value === 'string') return value;
	const record = asRecord(value);
	if (record && typeof record.value === 'string') return record.value;
	return undefined;
}

function requireString(value: unknown): string | undefined {
	return typeof value === 'string' ? value : undefined;
}

function storeFor(ctx: AshbyContext, schemaKey: string) {
	if (schemaKey.startsWith('candidate.')) return ctx.db.candidates;
	if (schemaKey.startsWith('application.')) return ctx.db.applications;
	if (schemaKey.startsWith('jobPosting.')) return ctx.db.jobPostings;
	if (schemaKey.startsWith('job.')) return ctx.db.jobs;
	if (schemaKey.startsWith('offer.')) return ctx.db.offers;
	if (schemaKey.startsWith('department.')) return ctx.db.departments;
	if (schemaKey.startsWith('location.')) return ctx.db.locations;
	if (schemaKey.startsWith('user.')) return ctx.db.users;
	return undefined;
}

function toEntity(
	schemaKey: string,
	row: Record<string, unknown>,
): Record<string, unknown> | null {
	const id = requireString(row.id);
	if (!id) return null;

	if (schemaKey.startsWith('candidate.')) {
		const name = requireString(row.name);
		if (!name) return null;
		return {
			id,
			name,
			primary_email_address: contactValue(row.primaryEmailAddress),
			primary_phone_number: contactValue(row.primaryPhoneNumber),
			created_at: row.createdAt,
			updated_at: row.updatedAt,
			tags: row.tags,
			application_ids: row.applicationIds,
		};
	}

	if (schemaKey.startsWith('application.')) {
		const candidate_id = requireString(row.candidateId);
		const job_id = requireString(row.jobId);
		if (!candidate_id || !job_id) return null;
		return {
			id,
			candidate_id,
			job_id,
			status: row.status,
			current_interview_stage_id: row.currentInterviewStageId,
			archive_reason_id: row.archiveReasonId,
			created_at: row.createdAt,
			updated_at: row.updatedAt,
		};
	}

	if (schemaKey.startsWith('jobPosting.')) {
		const title = requireString(row.title);
		const job_id = requireString(row.jobId);
		if (!title || !job_id) return null;
		return {
			id,
			title,
			job_id,
			department_id: row.departmentId,
			location_id: row.locationId,
			is_listed: row.isListed,
			published_date: row.publishedDate,
		};
	}

	if (schemaKey.startsWith('job.')) {
		const title = requireString(row.title);
		if (!title) return null;
		return {
			id,
			title,
			status: row.status,
			department_id: row.departmentId,
			location_id: row.locationId,
			created_at: row.createdAt,
			updated_at: row.updatedAt,
		};
	}

	if (schemaKey.startsWith('offer.')) {
		const application_id = requireString(row.applicationId);
		if (!application_id) return null;
		return {
			id,
			application_id,
			status: row.status,
			salary: row.salary,
			currency: row.currency,
			start_date: row.startDate,
			created_at: row.createdAt,
			updated_at: row.updatedAt,
		};
	}

	if (schemaKey.startsWith('department.')) {
		const name = requireString(row.name);
		if (!name) return null;
		return {
			id,
			name,
			parent_id: row.parentId,
			is_archived: row.isArchived,
		};
	}

	if (schemaKey.startsWith('location.')) {
		const name = requireString(row.name);
		if (!name) return null;
		return {
			id,
			name,
			parent_id: row.parentId,
			is_archived: row.isArchived,
		};
	}

	if (schemaKey.startsWith('user.')) {
		const name = requireString(row.name);
		const email = requireString(row.email);
		if (!name || !email) return null;
		return {
			id,
			name,
			email,
			global_role: row.globalRole,
			is_enabled: row.isEnabled,
		};
	}

	return null;
}

async function persistParsedOutput(
	ctx: AshbyContext,
	schemaKey: string,
	parsed: unknown,
): Promise<void> {
	if (!PERSIST_READ_KEYS.has(schemaKey)) return;
	const store = storeFor(ctx, schemaKey);
	if (!store?.upsertByEntityId) return;

	for (const row of collectResults(parsed)) {
		const entity = toEntity(schemaKey, row);
		const entityId = entity ? requireString(entity.id) : undefined;
		if (!entity || !entityId) continue;
		try {
			await store.upsertByEntityId(entityId, entity as never);
		} catch (error) {
			console.warn('Failed to persist Ashby entity:', error);
		}
	}
}

export async function getAshbyApiKey(ctx: AshbyContext): Promise<string> {
	if (ctx.options.key !== undefined) {
		if (!ctx.options.key.trim()) {
			throw new AuthMissingError('ashby', 'api_key');
		}
		return ctx.options.key;
	}

	const key = await ctx.keys.get_api_key();
	if (!key?.trim()) {
		throw new AuthMissingError('ashby', 'api_key');
	}
	return key;
}

export async function ashbyCall<T>(
	ctx: AshbyContext,
	endpoint: string,
	body: Record<string, unknown> = {},
): Promise<T> {
	const apiKey = await getAshbyApiKey(ctx);
	const schemaKey =
		ENDPOINT_KEY_MAP[endpoint] ??
		(endpoint as keyof typeof AshbyEndpointInputSchemas);

	const inputSchema = AshbyEndpointInputSchemas[schemaKey];
	const outputSchema = AshbyEndpointOutputSchemas[schemaKey];

	const parsedInput = inputSchema
		? (inputSchema.parse(body) as Record<string, unknown>)
		: body;

	const raw = await makeAshbyRequest<unknown>(endpoint, apiKey, {
		body: parsedInput,
	});

	const parsedOutput = outputSchema ? outputSchema.parse(raw) : raw;
	await persistParsedOutput(ctx, schemaKey, parsedOutput);
	return parsedOutput as T;
}
