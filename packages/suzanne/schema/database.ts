import { z } from 'zod';

export const JobStatus = z.enum([
	'queued',
	'running',
	'done',
	'failed',
	'cancelled',
]);

export const Job = z.object({
	jobId: z.string(),
	status: JobStatus.optional(),
	model: z.string().nullable().optional(),
	providerCreatedAt: z.string().nullable().optional(),
	updatedAt: z.string().nullable().optional(),
	completedAt: z.string().nullable().optional(),
	billableAmountCents: z.number().nullable().optional(),
	outputs: z
		.array(z.object({ format: z.string(), downloadUrl: z.string() }))
		.optional(),
	errorCode: z.string().nullable().optional(),
	errorMessage: z.string().nullable().optional(),
});

export type Job = z.infer<typeof Job>;

const TERMINAL = new Set(['done', 'failed', 'cancelled']);

export function knownStatus(status: string): Job['status'] | undefined {
	if (
		status === 'queued' ||
		status === 'running' ||
		status === 'done' ||
		status === 'failed' ||
		status === 'cancelled'
	) {
		return status;
	}
	return undefined;
}

export type JobWrite = Partial<Job> & { jobId: string };

export function mergeJob(existing: Job | null, incoming: JobWrite): Job {
	const base: Job = existing ?? { jobId: incoming.jobId };
	const next: Job = { ...base, jobId: incoming.jobId };
	const incomingStatus = incoming.status;
	const keepStatus =
		base.status !== undefined &&
		TERMINAL.has(base.status) &&
		incomingStatus !== undefined &&
		!TERMINAL.has(incomingStatus);

	// A late queued or running poll must not replace a finished job's links,
	// timestamps, or errors. Status alone is not enough: outputs: [] is non-null.
	// A replay can still fill a charge the finished poll never stored.
	if (keepStatus) {
		if (
			next.billableAmountCents == null &&
			incoming.billableAmountCents != null
		) {
			next.billableAmountCents = incoming.billableAmountCents;
		}
		return next;
	}
	if (incomingStatus !== undefined) next.status = incomingStatus;
	if (incoming.model != null) next.model = incoming.model;
	if (incoming.providerCreatedAt != null) {
		next.providerCreatedAt = incoming.providerCreatedAt;
	}
	if (incoming.updatedAt != null) next.updatedAt = incoming.updatedAt;
	if (incoming.completedAt != null) next.completedAt = incoming.completedAt;
	if (incoming.billableAmountCents != null) {
		next.billableAmountCents = incoming.billableAmountCents;
	}
	if (incoming.outputs != null) next.outputs = incoming.outputs;
	if (incomingStatus === 'done' || incomingStatus === 'cancelled') {
		next.errorCode = incoming.errorCode ?? null;
		next.errorMessage = incoming.errorMessage ?? null;
	} else {
		if (incoming.errorCode != null) next.errorCode = incoming.errorCode;
		if (incoming.errorMessage != null)
			next.errorMessage = incoming.errorMessage;
	}
	return next;
}
