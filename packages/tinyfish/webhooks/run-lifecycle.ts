import { logEventFromContext } from 'corsair/core';
import type { TinyFishWebhooks } from '..';
import { persistRun } from '../run-store';
import {
	createTinyFishMatch,
	parseTinyFishRunEvent,
	RunCancelledEventSchema,
	RunCompletedEventSchema,
	RunFailedEventSchema,
} from './types';

export const runCompleted: TinyFishWebhooks['runCompleted'] = {
	match: createTinyFishMatch('run.completed'),

	handler: async (ctx, request) => {
		const verification = parseTinyFishRunEvent(
			RunCompletedEventSchema,
			request.payload,
		);
		if (!verification.valid) {
			return { success: false, statusCode: 400, error: verification.error };
		}

		const event = verification.event;
		await persistRun(ctx, {
			run_id: event.run_id,
			status: event.status,
			goal: event.data?.goal,
			created_at: event.data?.created_at,
			started_at: event.data?.started_at,
			finished_at: event.data?.finished_at,
			num_of_steps: event.data?.num_of_steps,
			result: event.data?.result,
			error: event.data?.error,
		});

		await logEventFromContext(
			ctx,
			'tinyfish.webhook.runCompleted',
			{
				runId: event.run_id,
				goal: event.data?.goal,
				steps: event.data?.steps?.length ?? 0,
				resultKeys: event.data?.result
					? Object.keys(event.data.result).length
					: 0,
			},
			'completed',
		);

		return { success: true, data: event };
	},
};

export const runFailed: TinyFishWebhooks['runFailed'] = {
	match: createTinyFishMatch('run.failed'),

	handler: async (ctx, request) => {
		const verification = parseTinyFishRunEvent(
			RunFailedEventSchema,
			request.payload,
		);
		if (!verification.valid) {
			return { success: false, statusCode: 400, error: verification.error };
		}

		const event = verification.event;
		await persistRun(ctx, {
			run_id: event.run_id,
			status: event.status,
			goal: event.data?.goal,
			created_at: event.data?.created_at,
			started_at: event.data?.started_at,
			finished_at: event.data?.finished_at,
			num_of_steps: event.data?.num_of_steps,
			result: event.data?.result,
			error: event.data?.error,
		});

		await logEventFromContext(
			ctx,
			'tinyfish.webhook.runFailed',
			{
				runId: event.run_id,
				goal: event.data?.goal,
				errorCode: event.data?.error?.code,
				errorMessage: event.data?.error?.message,
			},
			'completed',
		);

		return { success: true, data: event };
	},
};

export const runCancelled: TinyFishWebhooks['runCancelled'] = {
	match: createTinyFishMatch('run.cancelled'),

	handler: async (ctx, request) => {
		const verification = parseTinyFishRunEvent(
			RunCancelledEventSchema,
			request.payload,
		);
		if (!verification.valid) {
			return { success: false, statusCode: 400, error: verification.error };
		}

		const event = verification.event;
		await persistRun(ctx, {
			run_id: event.run_id,
			status: event.status,
			goal: event.data?.goal,
			created_at: event.data?.created_at,
			started_at: event.data?.started_at,
			finished_at: event.data?.finished_at,
			num_of_steps: event.data?.num_of_steps,
			result: event.data?.result,
			error: event.data?.error,
		});

		await logEventFromContext(
			ctx,
			'tinyfish.webhook.runCancelled',
			{
				runId: event.run_id,
				goal: event.data?.goal,
			},
			'completed',
		);

		return { success: true, data: event };
	},
};
