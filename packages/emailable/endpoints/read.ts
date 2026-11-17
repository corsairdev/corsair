import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, emailableGet, emailablePost } from '../client';
import type { EmailableContext } from '../context';
import {
	EmailableAccountEntity,
	EmailableBatchEntity,
	EmailableVerificationEntity,
} from '../schema/database';
import type {
	AccountResponse,
	AuthorizeInput,
	AuthorizeResponse,
	BatchCreateInput,
	BatchIdInput,
	BatchResponse,
	BatchStatusResponse,
	EmptyInput,
	VerificationResponse,
	VerifyInput,
} from './types';
import {
	AuthorizeInputSchema,
	BatchCreateInputSchema,
	BatchIdInputSchema,
	VerificationSchema,
	VerifyInputSchema,
} from './types';

/**
 * Local tables, or undefined when no database is configured. Core still hands
 * out stub tables then, whose writes throw, so `ctx.db` alone is not the signal.
 */
function store(ctx: EmailableContext) {
	return ctx.database ? ctx.db : undefined;
}

// Narrows one untyped JSON value.
function num(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

// value is a raw JSON object of counts.
function counts(value: unknown): Record<string, number> | undefined {
	const row = asRecord(value);
	if (!row) return undefined;
	const out: Record<string, number> = {};
	for (const [key, raw] of Object.entries(row)) {
		const n = num(raw);
		if (n !== undefined) out[key] = n;
	}
	return out;
}

// Narrows one untyped JSON value.
function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

async function save<T extends { id: string }>(
	table:
		| { upsertByEntityId: (id: string, row: T) => Promise<unknown> }
		| undefined,
	row: T,
	label: string,
) {
	if (!table) return;
	try {
		await table.upsertByEntityId(row.id, row);
	} catch {
		console.warn(`Failed to save Emailable ${label}`);
	}
}

// body is the raw JSON response.
function batchOf(body: unknown) {
	const row = asRecord(body);
	const batch = EmailableBatchEntity.safeParse({
		id: text(row?.id),
		message: text(row?.message),
	});
	if (!batch.success) throw new Error('Emailable batch response had no id');
	return batch.data;
}

export const getAccount: CorsairEndpoint<
	EmailableContext,
	EmptyInput,
	AccountResponse
> = async (ctx) => {
	const body = asRecord(await emailableGet<unknown>(ctx.key, '/v1/account'));
	const account = EmailableAccountEntity.parse({
		id: 'account',
		availableCredits:
			typeof body?.available_credits === 'number'
				? body.available_credits
				: undefined,
	});
	await save(store(ctx)?.accounts, account, 'account');
	await logEventFromContext(
		ctx,
		'emailable.account.get',
		{ count: 1 },
		'completed',
	);
	return { account };
};

export const verifyEmail: CorsairEndpoint<
	EmailableContext,
	VerifyInput,
	VerificationResponse
> = async (ctx, input) => {
	const parsed = VerifyInputSchema.parse(input);
	const body = asRecord(
		await emailableGet<unknown>(ctx.key, '/v1/verify', {
			email: parsed.email,
			smtp: parsed.smtp,
			accept_all: parsed.acceptAll,
			timeout: parsed.timeout,
		}),
	);
	// HTTP 249: still verifying. The body is only a message, with no state.
	if (!text(body?.state)) {
		await logEventFromContext(
			ctx,
			'emailable.verifications.verify',
			{ count: 0 },
			'completed',
		);
		return { pending: true, message: text(body?.message) };
	}
	const verification = VerificationSchema.parse({
		...body,
		email: text(body?.email) ?? parsed.email,
	});
	await save(
		store(ctx)?.verifications,
		EmailableVerificationEntity.parse({
			id: verification.email,
			state: text(verification.state),
			score: num(verification.score),
			reason: text(verification.reason),
		}),
		'verification',
	);
	// The address stays out of the event.
	await logEventFromContext(
		ctx,
		'emailable.verifications.verify',
		{ count: 1 },
		'completed',
	);
	return { verification, pending: false };
};

export const createBatch: CorsairEndpoint<
	EmailableContext,
	BatchCreateInput,
	BatchResponse
> = async (ctx, input) => {
	const parsed = BatchCreateInputSchema.parse(input);
	const body: Record<string, unknown> = { emails: parsed.emails };
	if (parsed.url) body.url = parsed.url;
	if (parsed.responseFields)
		body.response_fields = parsed.responseFields.join(',');
	if (parsed.retries !== undefined) body.retries = parsed.retries;
	const batch = batchOf(
		await emailablePost<unknown>(ctx.key, '/v1/batch', body),
	);
	await save(store(ctx)?.batches, batch, 'batch');
	await logEventFromContext(
		ctx,
		'emailable.batches.create',
		{ count: 1 },
		'completed',
	);
	return { batch };
};

export const getBatch: CorsairEndpoint<
	EmailableContext,
	BatchIdInput,
	BatchStatusResponse
> = async (ctx, input) => {
	const parsed = BatchIdInputSchema.parse(input);
	const body = asRecord(
		await emailableGet<unknown>(ctx.key, '/v1/batch', {
			id: parsed.id,
			partial: parsed.partial,
		}),
	);
	if (!body) throw new Error('Emailable batch response was not an object');
	// While a batch runs, the response has message, processed and total but no
	// id, so the requested id is used.
	const id = text(body.id) ?? parsed.id;
	const processed = num(body.processed);
	const total = num(body.total);
	const emails = Array.isArray(body.emails)
		? body.emails.flatMap((item) => {
				const row = VerificationSchema.safeParse(item);
				return row.success ? [row.data] : [];
			})
		: undefined;
	const totalCounts = counts(body.total_counts);
	const done =
		totalCounts !== undefined ||
		emails !== undefined ||
		text(body.download_file) !== undefined ||
		(processed !== undefined && total !== undefined && processed >= total);
	const batch = {
		id,
		message: text(body.message),
		processed: processed ?? totalCounts?.processed,
		total: total ?? totalCounts?.total,
		done,
		emails,
		downloadFile: text(body.download_file),
		totalCounts,
		reasonCounts: counts(body.reason_counts),
	};
	await save(
		store(ctx)?.batches,
		EmailableBatchEntity.parse({ id, message: batch.message }),
		'batch',
	);
	await logEventFromContext(
		ctx,
		'emailable.batches.get',
		{ count: 1 },
		'completed',
	);
	return { batch };
};

export const authorize: CorsairEndpoint<
	EmailableContext,
	AuthorizeInput,
	AuthorizeResponse
> = async (ctx, input) => {
	const parsed = AuthorizeInputSchema.parse(input);
	const url = new URL('https://app.emailable.com/oauth/authorize');
	url.searchParams.set('response_type', 'code');
	url.searchParams.set('client_id', parsed.clientId);
	url.searchParams.set('redirect_uri', parsed.redirectUri);
	if (parsed.state) url.searchParams.set('state', parsed.state);
	if (parsed.codeChallenge) {
		url.searchParams.set('code_challenge', parsed.codeChallenge);
		url.searchParams.set(
			'code_challenge_method',
			parsed.codeChallengeMethod ?? 'S256',
		);
	}
	await logEventFromContext(
		ctx,
		'emailable.oauth.authorize',
		{ count: 1 },
		'completed',
	);
	return { url: url.toString() };
};
