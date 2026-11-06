import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	endpointPath,
	falErrorMessage,
	makeFalRequest,
	requestBasePath,
} from '../client';
import type { FalEndpoints } from '../index';
import type { QueueStatusResponse } from './types';
import {
	FalEndpointInputSchemas,
	FalEndpointOutputSchemas,
	QUEUE_CANCEL_STATUSES,
} from './types';

export const submit: FalEndpoints['queueSubmit'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.queueSubmit.parse(rawInput);
	const response = FalEndpointOutputSchemas.queueSubmit.parse(
		await makeFalRequest('queue', endpointPath(input.endpointId), ctx.key, {
			method: 'POST',
			body: input.input,
			query: {
				fal_webhook: input.webhookUrl,
				fal_max_queue_length: input.maxQueueLength,
			},
			headers: {
				'X-Fal-Queue-Priority': input.priority,
				'X-Fal-Request-Start-Timeout':
					input.startTimeout !== undefined
						? String(input.startTimeout)
						: undefined,
				'X-Fal-Runner-Hint': input.hint,
				'X-Fal-No-Retry': input.noRetry ? '1' : undefined,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'fal.queue.submit',
		{ endpointId: input.endpointId, requestId: response.request_id },
		'completed',
	);
	return response;
};

/**
 * Whether a failed result read is the request's own outcome (bad input, a
 * model error fal recorded) rather than a passing fault worth asking again.
 */
function isRequestFailure(error: unknown): error is ApiError {
	if (!(error instanceof ApiError) || error.status === 429) return false;
	if (error.status >= 400 && error.status < 500) return true;
	const body = error.body as Record<string, unknown> | undefined;
	return Boolean(
		body &&
			typeof body === 'object' &&
			('error_type' in body || 'detail' in body),
	);
}

/**
 * fal reports a failed request as COMPLETED, and only the result read says
 * whether it worked (a 422 for bad input, for example). So once fal says
 * COMPLETED this reads the result too and answers SUCCEEDED with the output
 * or FAILED with the error.
 */
export const status: FalEndpoints['queueStatus'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.queueStatus.parse(rawInput);
	const { basePath, requestId } = requestBasePath(input);

	const raw = await makeFalRequest<Record<string, unknown>>(
		'queue',
		`${basePath}/status`,
		ctx.key,
		{ method: 'GET', query: { logs: input.logs ? '1' : undefined } },
	);

	let extra: Pick<QueueStatusResponse, 'state' | 'output' | 'error'>;
	if (raw.status === 'IN_QUEUE') {
		extra = { state: 'IN_QUEUE' };
	} else if (raw.status !== 'COMPLETED') {
		extra = { state: 'IN_PROGRESS' };
	} else if (typeof raw.error === 'string' && raw.error) {
		extra = { state: 'FAILED', error: raw.error };
	} else {
		try {
			const output = FalEndpointOutputSchemas.queueResult.parse(
				await makeFalRequest('queue', basePath, ctx.key, { method: 'GET' }),
			);
			extra = { state: 'SUCCEEDED', output };
		} catch (error) {
			if (!isRequestFailure(error)) throw error;
			extra = { state: 'FAILED', error: falErrorMessage(error) };
		}
	}

	const response = FalEndpointOutputSchemas.queueStatus.parse({
		...raw,
		...extra,
	});
	await logEventFromContext(
		ctx,
		'fal.queue.status',
		{ requestId, state: response.state },
		'completed',
	);
	return response;
};

export const result: FalEndpoints['queueResult'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.queueResult.parse(rawInput);
	const { basePath, requestId } = requestBasePath(input);
	const response = FalEndpointOutputSchemas.queueResult.parse(
		await makeFalRequest('queue', basePath, ctx.key, { method: 'GET' }),
	);
	await logEventFromContext(
		ctx,
		'fal.queue.result',
		{ requestId },
		'completed',
	);
	return response;
};

const isCancelStatus = (
	value: unknown,
): value is (typeof QUEUE_CANCEL_STATUSES)[number] =>
	typeof value === 'string' &&
	(QUEUE_CANCEL_STATUSES as readonly string[]).includes(value);

/** fal answers "nothing to cancel" with 400/404 and a status body; both are answers, not errors. */
export const cancel: FalEndpoints['queueCancel'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.queueCancel.parse(rawInput);
	const { basePath, requestId } = requestBasePath(input);

	let raw: unknown;
	try {
		raw = await makeFalRequest('queue', `${basePath}/cancel`, ctx.key, {
			method: 'PUT',
		});
	} catch (error) {
		const body = error instanceof ApiError ? error.body : undefined;
		const bodyStatus =
			body && typeof body === 'object'
				? (body as { status?: unknown }).status
				: undefined;
		if (
			error instanceof ApiError &&
			(error.status === 400 || error.status === 404) &&
			isCancelStatus(bodyStatus)
		) {
			raw = { status: bodyStatus };
		} else {
			throw error;
		}
	}

	const response = FalEndpointOutputSchemas.queueCancel.parse(raw);
	await logEventFromContext(
		ctx,
		'fal.queue.cancel',
		{ requestId, status: response.status },
		'completed',
	);
	return response;
};
