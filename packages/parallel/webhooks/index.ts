import type {
	CorsairWebhook,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ParallelContext } from '..';
import type { ParallelWebhookEventType } from './types';
import {
	FindAllCandidateEnrichedEvent,
	FindAllCandidateGeneratedEvent,
	FindAllCandidateMatchedEvent,
	FindAllRunCancelledEvent,
	FindAllRunCompletedEvent,
	FindAllRunFailedEvent,
	MonitorEventDetectedEvent,
	MonitorExecutionCompletedEvent,
	MonitorExecutionFailedEvent,
	matchParallelEvent,
	TaskRunStatusEvent,
	verifyParallelWebhook,
} from './types';

/** The ids worth logging for an event: never its content, which can carry
 * research output or customer data. */
function eventIds(data: Record<string, unknown>): Record<string, unknown> {
	const ids: Record<string, unknown> = {};
	for (const key of [
		'run_id',
		'findall_id',
		'candidate_id',
		'monitor_id',
		'status',
		'match_status',
	]) {
		const value = data[key];
		if (typeof value === 'string') ids[key] = value;
	}
	if (
		data.status &&
		typeof data.status === 'object' &&
		'status' in data.status
	) {
		ids.status = data.status.status;
	}
	return ids;
}

function parallelWebhook<S extends z.ZodType<{ data: object }>>(
	type: ParallelWebhookEventType,
	schema: S,
): CorsairWebhook<ParallelContext, z.input<S>, z.output<S>> {
	return {
		match: matchParallelEvent(type),
		handler: async (ctx, request) => {
			const verified = verifyParallelWebhook(request, ctx.key);
			if (!verified.valid) {
				return { success: false, statusCode: 401, error: verified.error };
			}
			const parsed = schema.safeParse(request.payload);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: `Invalid Parallel ${type} payload`,
				};
			}
			await logEventFromContext(
				ctx,
				`parallel.webhook.${type}`,
				// The data object is the provider's; only its ids are read.
				eventIds(parsed.data.data as Record<string, unknown>),
				'completed',
			);
			return { success: true, data: parsed.data };
		},
	};
}

export const ParallelWebhooks = {
	taskRun: {
		status: parallelWebhook('task_run.status', TaskRunStatusEvent),
	},
	findall: {
		candidateGenerated: parallelWebhook(
			'findall.candidate.generated',
			FindAllCandidateGeneratedEvent,
		),
		candidateMatched: parallelWebhook(
			'findall.candidate.matched',
			FindAllCandidateMatchedEvent,
		),
		candidateEnriched: parallelWebhook(
			'findall.candidate.enriched',
			FindAllCandidateEnrichedEvent,
		),
		runCompleted: parallelWebhook(
			'findall.run.completed',
			FindAllRunCompletedEvent,
		),
		runCancelled: parallelWebhook(
			'findall.run.cancelled',
			FindAllRunCancelledEvent,
		),
		runFailed: parallelWebhook('findall.run.failed', FindAllRunFailedEvent),
	},
	monitor: {
		eventDetected: parallelWebhook(
			'monitor.event.detected',
			MonitorEventDetectedEvent,
		),
		executionCompleted: parallelWebhook(
			'monitor.execution.completed',
			MonitorExecutionCompletedEvent,
		),
		executionFailed: parallelWebhook(
			'monitor.execution.failed',
			MonitorExecutionFailedEvent,
		),
	},
} as const;

export const parallelWebhookSchemas = {
	'taskRun.status': {
		description: 'A task run finished, successfully or not',
		payload: TaskRunStatusEvent,
		response: TaskRunStatusEvent,
	},
	'findall.candidateGenerated': {
		description: 'A FindAll run found a candidate and queued it for checking',
		payload: FindAllCandidateGeneratedEvent,
		response: FindAllCandidateGeneratedEvent,
	},
	'findall.candidateMatched': {
		description: 'A FindAll candidate met every match condition',
		payload: FindAllCandidateMatchedEvent,
		response: FindAllCandidateMatchedEvent,
	},
	'findall.candidateEnriched': {
		description: 'Enrichment data was extracted for a FindAll candidate',
		payload: FindAllCandidateEnrichedEvent,
		response: FindAllCandidateEnrichedEvent,
	},
	'findall.runCompleted': {
		description: 'A FindAll run completed',
		payload: FindAllRunCompletedEvent,
		response: FindAllRunCompletedEvent,
	},
	'findall.runCancelled': {
		description: 'A FindAll run was cancelled',
		payload: FindAllRunCancelledEvent,
		response: FindAllRunCancelledEvent,
	},
	'findall.runFailed': {
		description: 'A FindAll run failed',
		payload: FindAllRunFailedEvent,
		response: FindAllRunFailedEvent,
	},
	'monitor.eventDetected': {
		description: 'A monitor run detected one or more events',
		payload: MonitorEventDetectedEvent,
		response: MonitorEventDetectedEvent,
	},
	'monitor.executionCompleted': {
		description: 'A monitor run completed without detecting events',
		payload: MonitorExecutionCompletedEvent,
		response: MonitorExecutionCompletedEvent,
	},
	'monitor.executionFailed': {
		description: 'A monitor run failed',
		payload: MonitorExecutionFailedEvent,
		response: MonitorExecutionFailedEvent,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof ParallelWebhooks>;

export * from './types';
