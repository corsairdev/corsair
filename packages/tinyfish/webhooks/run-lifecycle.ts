import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { TinyFishContext, TinyFishWebhooks } from '..';
import { makeTinyFishRequest } from '../client';
import { persistRun } from '../run-store';
import {
	createTinyFishMatch,
	parseTinyFishRunEvent,
	RunCancelledEventSchema,
	RunCompletedEventSchema,
	RunFailedEventSchema,
} from './types';

// Deliveries are unsigned JSON, so the payload alone proves nothing: read the
// run back from the API and require the live run to exist with the same status.
const ConfirmedRunSchema = z.object({ status: z.string() });

/**
 * Returns a drop reason, or null when the delivery was confirmed against the
 * live run. Any TinyFish API error is also a drop: an unreadable run must not
 * be trusted.
 */
async function confirmRunDelivery(
	ctx: TinyFishContext,
	runId: string,
	eventStatus: string,
): Promise<string | null> {
	const key = ctx.options.key || (await ctx.keys.get_api_key()) || '';
	if (!key) {
		return 'no TinyFish API key configured; unconfirmed delivery dropped';
	}

	let live: { status: string };
	try {
		live = ConfirmedRunSchema.parse(
			await makeTinyFishRequest(
				'agent',
				`/v1/runs/${encodeURIComponent(runId)}`,
				key,
				{ method: 'GET' },
			),
		);
	} catch (error) {
		return `run confirm request failed: ${(error as Error).message}`;
	}

	if (live.status !== eventStatus) {
		return `live run status is ${live.status}, not ${eventStatus}`;
	}
	return null;
}

function dropDelivery(reason: string) {
	return { success: false as const, statusCode: 409, error: reason };
}

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
		const dropReason = await confirmRunDelivery(
			ctx,
			event.run_id,
			event.status,
		);
		if (dropReason) {
			await logEventFromContext(
				ctx,
				'tinyfish.webhook.runCompleted',
				{ runId: event.run_id, reason: dropReason },
				'failed',
			);
			return dropDelivery(dropReason);
		}

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
		const dropReason = await confirmRunDelivery(
			ctx,
			event.run_id,
			event.status,
		);
		if (dropReason) {
			await logEventFromContext(
				ctx,
				'tinyfish.webhook.runFailed',
				{ runId: event.run_id, reason: dropReason },
				'failed',
			);
			return dropDelivery(dropReason);
		}

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
		const dropReason = await confirmRunDelivery(
			ctx,
			event.run_id,
			event.status,
		);
		if (dropReason) {
			await logEventFromContext(
				ctx,
				'tinyfish.webhook.runCancelled',
				{ runId: event.run_id, reason: dropReason },
				'failed',
			);
			return dropDelivery(dropReason);
		}

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
