import { randomUUID } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import {
	estimatePath,
	HiggsfieldAPIError,
	HiggsfieldError,
	isValidRequestId,
	makeHiggsfieldRequest,
	requestPath,
	submitPath,
} from '../client';
import type { HiggsfieldContext, HiggsfieldEndpoints } from '../index';
import type {
	GenerationsSubmitInput,
	GenerationsSubmitResponse,
	RequestsStatusResponse,
} from './types';
import {
	HiggsfieldEndpointInputSchemas,
	HiggsfieldEndpointOutputSchemas,
	RUN_DEFAULT_WAIT_S,
	TERMINAL_STATUSES,
} from './types';

const SUBMIT_TIMEOUT_MS = 15_000;
const READ_TIMEOUT_MS = 10_000;

// The docs' polling advice: start at two seconds and back off gently.
const FIRST_POLL_MS = 2_000;
const LONGEST_POLL_MS = 5_000;
// Time kept back so the last read fits inside the wait.
const READ_RESERVE_MS = 1_500;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Idle Idempotency-Keys by arguments object, for submits the caller gave no key
 * for. Core retries by calling the operation again with the same arguments
 * (core/endpoints/bind.ts), so a key made per call would make every retry a new
 * generation, and a second charge if the first attempt had in fact gone
 * through. A call takes an idle key or mints one, a failed attempt puts its key
 * back for its retry, and acceptance drops it. A key in flight isn't idle, so
 * concurrent calls with one object send different keys and stay two generations.
 *
 * This only reaches retries of a live call. A replayed workflow step or a new
 * script builds a new object and gets a new key, so such a caller must pass its
 * own idempotencyKey to be safe across attempts.
 */
const idleKeys = new WeakMap<object, string[]>();

function takeKey(holder: object): string {
	return idleKeys.get(holder)?.pop() ?? randomUUID();
}

function releaseKey(holder: object, key: string): void {
	const pool = idleKeys.get(holder);
	if (pool) pool.push(key);
	else idleKeys.set(holder, [key]);
}

/**
 * Tells the caller the key a failed submit used. Only the failures that leave
 * it unclear whether the request was accepted say so in the message: a 4xx was
 * rejected before acceptance and doesn't use the key up.
 */
// unknown: whatever the transport or the response check threw.
function withIdempotencyKey(error: unknown, idempotencyKey: string): unknown {
	const maybeAccepted =
		(error instanceof HiggsfieldAPIError && error.status >= 500) ||
		(error instanceof HiggsfieldError &&
			(error.code === 'network' ||
				error.code === 'timeout' ||
				error.code === 'bad_response'));
	if (error instanceof HiggsfieldAPIError || error instanceof HiggsfieldError) {
		error.idempotencyKey = idempotencyKey;
		if (maybeAccepted) {
			error.message += ` Higgsfield may have accepted the request: repeat the call with idempotencyKey ${idempotencyKey} and no second charge is made.`;
		}
	}
	return error;
}

/**
 * Sends one generation. Throws only while the request may not have been
 * accepted, and puts a generated key back for the retry of that attempt.
 */
async function submitGeneration(
	apiKey: string,
	// unknown: the caller's arguments object, used only for its identity.
	rawInput: unknown,
	input: GenerationsSubmitInput,
) {
	const holder = rawInput as object;
	const idempotencyKey = input.idempotencyKey ?? takeKey(holder);
	try {
		// unknown: checked by the schema just below.
		const raw = await makeHiggsfieldRequest<
			Record<string, unknown> | undefined
		>(apiKey, submitPath(input.modelPath), {
			method: 'POST',
			body: input.input,
			query: { hf_webhook: input.webhookUrl },
			headers: {
				'Idempotency-Key': idempotencyKey,
				'Hf-Expires-After':
					input.expiresAfter !== undefined
						? String(input.expiresAfter)
						: undefined,
			},
			timeoutMs: SUBMIT_TIMEOUT_MS,
		});
		// An id that requests.status would refuse is a receipt nobody can follow.
		if (
			typeof raw?.request_id !== 'string' ||
			!isValidRequestId(raw.request_id)
		) {
			throw new HiggsfieldError(
				'Higgsfield answered the submit without a usable request_id.',
				'bad_response',
			);
		}
		// With a request_id the generation exists, so a field the schema doesn't
		// expect must not turn that into an error.
		const minimal: GenerationsSubmitResponse = {
			status: typeof raw.status === 'string' ? raw.status : 'queued',
			request_id: raw.request_id,
			idempotency_key: idempotencyKey,
		};
		const parsed = HiggsfieldEndpointOutputSchemas.generationsSubmit.safeParse({
			...raw,
			...minimal,
		});
		return parsed.success ? parsed.data : minimal;
	} catch (error) {
		if (!input.idempotencyKey) releaseKey(holder, idempotencyKey);
		throw withIdempotencyKey(error, idempotencyKey);
	}
}

/**
 * A log write failing must not turn an accepted, paid request into an error
 * the caller answers by submitting again. It warns the way core's logger does,
 * so a missing KEK with encryptDataAtRest on still shows up.
 */
async function logQuietly(
	ctx: HiggsfieldContext,
	event: string,
	// unknown: the event's fields, stored as given.
	payload: Record<string, unknown>,
) {
	try {
		await logEventFromContext(ctx, event, payload, 'completed');
	} catch (error) {
		console.warn('Failed to log event:', error);
	}
}

export const submit: HiggsfieldEndpoints['generationsSubmit'] = async (
	ctx,
	rawInput,
) => {
	const input =
		HiggsfieldEndpointInputSchemas.generationsSubmit.parse(rawInput);
	const response = await submitGeneration(ctx.key, rawInput, input);
	await logQuietly(ctx, 'higgsfield.generations.submit', {
		modelPath: input.modelPath,
		requestId: response.request_id,
	});
	return response;
};

/** One status read that answers null instead of throwing. */
async function readStatus(
	apiKey: string,
	requestId: string,
	timeoutMs: number,
): Promise<RequestsStatusResponse | null> {
	try {
		const raw = await makeHiggsfieldRequest(
			apiKey,
			requestPath(requestId, 'status'),
			{ timeoutMs },
		);
		return HiggsfieldEndpointOutputSchemas.requestsStatus.parse(raw);
	} catch {
		return null;
	}
}

/**
 * Polls until the request ends or `deadline` passes, and answers the last
 * status it managed to read (null if none). Every read stays inside the
 * deadline, and a failed read only means the next one has to do.
 */
async function waitForEnd(
	apiKey: string,
	requestId: string,
	deadline: number,
): Promise<RequestsStatusResponse | null> {
	let latest: RequestsStatusResponse | null = null;
	let interval = FIRST_POLL_MS;
	let last = false;
	while (!last) {
		const left = deadline - Date.now();
		if (left <= 0) break;
		const pause = interval + Math.random() * 250;
		last = pause + READ_RESERVE_MS >= left;
		await sleep(last ? Math.max(0, left - READ_RESERVE_MS) : pause);

		const remaining = deadline - Date.now();
		if (remaining <= 0) break;
		latest =
			(await readStatus(
				apiKey,
				requestId,
				// AbortSignal.timeout refuses a fraction, and a fractional waitSeconds
				// makes one here.
				Math.floor(Math.min(remaining, READ_TIMEOUT_MS)),
			)) ?? latest;
		if (latest && TERMINAL_STATUSES.includes(latest.status)) break;
		interval = Math.min(interval * 1.5, LONGEST_POLL_MS);
	}
	return latest;
}

/**
 * Submits and waits a little for the end. Nothing after the submit throws: an
 * error here would read as a failed call, and a caller or retry handler would
 * pay for the generation again. A request that hasn't ended, or whose status
 * couldn't be read, comes back as the job it is.
 */
export const run: HiggsfieldEndpoints['generationsRun'] = async (
	ctx,
	rawInput,
) => {
	const startedAt = Date.now();
	const { waitSeconds = RUN_DEFAULT_WAIT_S, ...input } =
		HiggsfieldEndpointInputSchemas.generationsRun.parse(rawInput);
	const accepted = await submitGeneration(ctx.key, rawInput, input);

	const latest = await waitForEnd(
		ctx.key,
		accepted.request_id,
		startedAt + waitSeconds * 1000,
	);
	// `latest` already passed the status schema, so only what the receipt adds
	// can fail here. The latest status and outputs win either way: an odd field
	// must not lose a completed output.
	const fromReceipt = {
		request_id: accepted.request_id,
		idempotency_key: accepted.idempotency_key,
		expires_after: accepted.expires_after,
	};
	const merged = HiggsfieldEndpointOutputSchemas.generationsRun.safeParse({
		...accepted,
		...latest,
		...fromReceipt,
	});
	const response = merged.success
		? merged.data
		: { ...(latest ?? accepted), ...fromReceipt };
	await logQuietly(ctx, 'higgsfield.generations.run', {
		modelPath: input.modelPath,
		requestId: response.request_id,
		status: response.status,
	});
	return response;
};

export const estimate: HiggsfieldEndpoints['generationsEstimate'] = async (
	ctx,
	rawInput,
) => {
	const input =
		HiggsfieldEndpointInputSchemas.generationsEstimate.parse(rawInput);
	const response = HiggsfieldEndpointOutputSchemas.generationsEstimate.parse(
		await makeHiggsfieldRequest(ctx.key, estimatePath(input.modelPath), {
			method: 'POST',
			body: input.input,
		}),
	);
	await logEventFromContext(
		ctx,
		'higgsfield.generations.estimate',
		{ modelPath: input.modelPath, usd: response.usd },
		'completed',
	);
	return response;
};
