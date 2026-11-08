import { randomUUID } from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import {
	estimatePath,
	HiggsfieldAPIError,
	HiggsfieldError,
	makeHiggsfieldRequest,
	requestPath,
	submitPath,
} from '../client';
import type { HiggsfieldContext, HiggsfieldEndpoints } from '../index';
import type { GenerationsSubmitInput, RequestsStatusResponse } from './types';
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
 * The Idempotency-Key of a submit the caller gave no key for, by argument
 * object. Core retries by calling the operation again with the same arguments
 * (core/endpoints/bind.ts), so a key made per call would make every retry a new
 * generation, and a second charge if the first attempt had in fact gone
 * through. Held until Higgsfield accepts the request: the same object passed
 * again after that is a deliberate second generation and gets a new key.
 */
const unacceptedKeys = new WeakMap<object, string>();

function idempotencyKeyFor(
	// unknown: the caller's arguments object, used only for its identity.
	rawInput: unknown,
	input: GenerationsSubmitInput,
): string {
	if (input.idempotencyKey) return input.idempotencyKey;
	const holder = rawInput as object;
	const existing = unacceptedKeys.get(holder);
	if (existing) return existing;
	const key = randomUUID();
	unacceptedKeys.set(holder, key);
	return key;
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
 * accepted, and the key stays the same across every retry of that attempt.
 */
async function submitGeneration(
	apiKey: string,
	// unknown: the caller's arguments object, used only for its identity.
	rawInput: unknown,
	input: GenerationsSubmitInput,
) {
	const idempotencyKey = idempotencyKeyFor(rawInput, input);
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
		if (typeof raw?.request_id !== 'string') {
			throw new HiggsfieldError(
				'Higgsfield answered the submit without a request_id.',
				'bad_response',
			);
		}
		// With a request_id the generation exists, so a field the schema doesn't
		// expect must not turn that into an error.
		const minimal = {
			status: typeof raw.status === 'string' ? raw.status : 'queued',
			request_id: raw.request_id,
			idempotency_key: idempotencyKey,
		};
		const parsed = HiggsfieldEndpointOutputSchemas.generationsSubmit.safeParse({
			...raw,
			...minimal,
		});
		unacceptedKeys.delete(rawInput as object);
		return parsed.success ? parsed.data : minimal;
	} catch (error) {
		throw withIdempotencyKey(error, idempotencyKey);
	}
}

/**
 * A log write failing must not turn an accepted, paid request into an error
 * the caller answers by submitting again.
 */
async function logQuietly(
	ctx: HiggsfieldContext,
	event: string,
	// unknown: the event's fields, stored as given.
	payload: Record<string, unknown>,
) {
	try {
		await logEventFromContext(ctx, event, payload, 'completed');
	} catch {
		// Nothing depends on the log entry.
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
				Math.min(remaining, READ_TIMEOUT_MS),
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
	const merged = HiggsfieldEndpointOutputSchemas.generationsRun.safeParse({
		...accepted,
		...latest,
		request_id: accepted.request_id,
		idempotency_key: accepted.idempotency_key,
	});
	const response = merged.success ? merged.data : accepted;
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
