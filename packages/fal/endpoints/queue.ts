import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	endpointPath,
	falErrorMessage,
	makeFalRequest,
	requestBasePath,
} from '../client';
import type { FalEndpoints } from '../index';
import type {
	QueueStatusResponse,
	QueueSubmitInput,
	QueueSubmitResponse,
} from './types';
import {
	FalEndpointInputSchemas,
	FalEndpointOutputSchemas,
	QUEUE_CANCEL_STATUSES,
} from './types';

/** Puts a model run on fal's queue; shared by queue.submit and models.run. */
export async function submitToQueue(
	key: string,
	input: QueueSubmitInput,
): Promise<QueueSubmitResponse> {
	return FalEndpointOutputSchemas.queueSubmit.parse(
		await makeFalRequest('queue', endpointPath(input.endpointId), key, {
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
}

export const submit: FalEndpoints['queueSubmit'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.queueSubmit.parse(rawInput);
	const response = await submitToQueue(ctx.key, input);
	await logEventFromContext(
		ctx,
		'fal.queue.submit',
		{ endpointId: input.endpointId, requestId: response.request_id },
		'completed',
	);
	return response;
};

// Answers from the result read that say nothing about how the run went: the
// key lost access, the result expired, or fal was busy. They are raised, so
// the caller asks again or sees the real problem, instead of a FAILED run.
const NOT_THE_REQUESTS_OUTCOME = new Set([401, 403, 404, 408, 429]);

/**
 * Whether a failed result read is the request's own outcome (bad input, a
 * model error fal recorded) rather than an access problem or a passing fault.
 */
// unknown: called with whatever a catch block caught.
function isRequestFailure(error: unknown): error is ApiError {
	if (!(error instanceof ApiError)) return false;
	if (NOT_THE_REQUESTS_OUTCOME.has(error.status)) return false;
	if (error.status >= 400 && error.status < 500) return true;
	// unknown: the provider's error body, shaped by the model that failed.
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
export async function readQueueStatus(
	key: string,
	basePath: string,
	logs = false,
): Promise<QueueStatusResponse> {
	// unknown: the raw status before the schema parses it; only status and error are read here.
	const raw = await makeFalRequest<Record<string, unknown>>(
		'queue',
		`${basePath}/status`,
		key,
		{ method: 'GET', query: { logs: logs ? '1' : undefined } },
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
				await makeFalRequest('queue', basePath, key, { method: 'GET' }),
			);
			extra = { state: 'SUCCEEDED', output };
		} catch (error) {
			if (!isRequestFailure(error)) throw error;
			extra = { state: 'FAILED', error: falErrorMessage(error) };
		}
	}

	return FalEndpointOutputSchemas.queueStatus.parse({ ...raw, ...extra });
}

export const status: FalEndpoints['queueStatus'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.queueStatus.parse(rawInput);
	const { basePath, requestId } = requestBasePath(input);
	const response = await readQueueStatus(ctx.key, basePath, input.logs);
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
	// unknown: a type guard over the status field of an error body.
	value: unknown,
): value is (typeof QUEUE_CANCEL_STATUSES)[number] =>
	typeof value === 'string' &&
	(QUEUE_CANCEL_STATUSES as readonly string[]).includes(value);

/** fal answers "nothing to cancel" with 400/404 and a status body; both are answers, not errors. */
export const cancel: FalEndpoints['queueCancel'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.queueCancel.parse(rawInput);
	const { basePath, requestId } = requestBasePath(input);

	// unknown: the response or the error body, before the schema parses it.
	let raw: unknown;
	try {
		raw = await makeFalRequest('queue', `${basePath}/cancel`, ctx.key, {
			method: 'PUT',
		});
	} catch (error) {
		const body = error instanceof ApiError ? error.body : undefined;
		const bodyStatus =
			body && typeof body === 'object'
				? // unknown: the error body's status, narrowed by isCancelStatus.
					(body as { status?: unknown }).status
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
