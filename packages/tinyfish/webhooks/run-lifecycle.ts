import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { TinyFishContext, TinyFishWebhooks } from '..';
import { makeTinyFishRequest } from '../client';
import { AgentRunSchema } from '../endpoints/types';
import type { StoredRun } from '../run-store';
import { persistRun } from '../run-store';
import {
	createTinyFishMatch,
	parseTinyFishRunEvent,
	RunCancelledEventSchema,
	RunCompletedEventSchema,
	RunFailedEventSchema,
} from './types';

// Deliveries are unsigned JSON, so the payload alone proves nothing: read the
// run back from the API and persist only the API's own snapshot. The delivery
// body may name the event and the run, never supply the stored fields, so a
// forged body cannot plant results for a run that genuinely finished. Picking
// from AgentRunSchema reuses the shape `agent.getRun` already validates the
// same endpoint's response against. Any API error is also a drop: an
// unreadable run must not be trusted.
const ConfirmedRunSchema = AgentRunSchema.pick({
	run_id: true,
	status: true,
	goal: true,
	created_at: true,
	started_at: true,
	finished_at: true,
	num_of_steps: true,
	result: true,
	error: true,
	profile_id: true,
	steps: true,
});

type ConfirmedRun = z.infer<typeof ConfirmedRunSchema>;

type Confirmation =
	| { ok: true; run: ConfirmedRun }
	| { ok: false; reason: string };

async function confirmRunDelivery(
	ctx: TinyFishContext,
	runId: string,
	eventStatus: string,
): Promise<Confirmation> {
	const key = ctx.options.key || (await ctx.keys.get_api_key()) || '';
	if (!key) {
		return {
			ok: false,
			reason: 'no TinyFish API key configured; unconfirmed delivery dropped',
		};
	}

	let live: ConfirmedRun;
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
		return {
			ok: false,
			reason: `run confirm request failed: ${
				error instanceof Error ? error.message : String(error)
			}`,
		};
	}

	if (live.status !== eventStatus) {
		return {
			ok: false,
			reason: `live run status is ${live.status}, not ${eventStatus}`,
		};
	}
	return { ok: true, run: live };
}

function confirmedSnapshot(live: ConfirmedRun): StoredRun {
	return {
		run_id: live.run_id,
		status: live.status,
		goal: live.goal,
		created_at: live.created_at,
		started_at: live.started_at,
		finished_at: live.finished_at,
		num_of_steps: live.num_of_steps,
		result: live.result,
		error: live.error,
		profile_id: live.profile_id,
	};
}

function dropDelivery(reason: string) {
	return { success: false, statusCode: 409, error: reason };
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
		const confirmation = await confirmRunDelivery(
			ctx,
			event.run_id,
			event.status,
		);
		if (!confirmation.ok) {
			await logEventFromContext(
				ctx,
				'tinyfish.webhook.runCompleted',
				{ runId: event.run_id, reason: confirmation.reason },
				'failed',
			);
			return dropDelivery(confirmation.reason);
		}

		const live = confirmation.run;
		await persistRun(ctx, confirmedSnapshot(live));

		await logEventFromContext(
			ctx,
			'tinyfish.webhook.runCompleted',
			{
				runId: live.run_id,
				goal: live.goal,
				steps: live.steps.length,
				resultKeys: live.result ? Object.keys(live.result).length : 0,
			},
			'completed',
		);

		return {
			success: true,
			data: {
				event: 'run.completed',
				run_id: live.run_id,
				status: live.status,
				data: live,
			},
		};
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
		const confirmation = await confirmRunDelivery(
			ctx,
			event.run_id,
			event.status,
		);
		if (!confirmation.ok) {
			await logEventFromContext(
				ctx,
				'tinyfish.webhook.runFailed',
				{ runId: event.run_id, reason: confirmation.reason },
				'failed',
			);
			return dropDelivery(confirmation.reason);
		}

		const live = confirmation.run;
		await persistRun(ctx, confirmedSnapshot(live));

		await logEventFromContext(
			ctx,
			'tinyfish.webhook.runFailed',
			{
				runId: live.run_id,
				goal: live.goal,
				errorCode: live.error?.code,
				errorMessage: live.error?.message,
			},
			'completed',
		);

		return {
			success: true,
			data: {
				event: 'run.failed',
				run_id: live.run_id,
				status: live.status,
				data: live,
			},
		};
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
		const confirmation = await confirmRunDelivery(
			ctx,
			event.run_id,
			event.status,
		);
		if (!confirmation.ok) {
			await logEventFromContext(
				ctx,
				'tinyfish.webhook.runCancelled',
				{ runId: event.run_id, reason: confirmation.reason },
				'failed',
			);
			return dropDelivery(confirmation.reason);
		}

		const live = confirmation.run;
		await persistRun(ctx, confirmedSnapshot(live));

		await logEventFromContext(
			ctx,
			'tinyfish.webhook.runCancelled',
			{
				runId: live.run_id,
				goal: live.goal,
			},
			'completed',
		);

		return {
			success: true,
			data: {
				event: 'run.cancelled',
				run_id: live.run_id,
				status: live.status,
				data: live,
			},
		};
	},
};
