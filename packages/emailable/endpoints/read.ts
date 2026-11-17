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
	EmptyInput,
	VerificationResponse,
	VerifyInput,
} from './types';
import {
	AuthorizeInputSchema,
	BatchCreateInputSchema,
	BatchIdInputSchema,
	VerifyInputSchema,
} from './types';

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
	await save(ctx.db?.accounts, account, 'account');
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
	const { email } = VerifyInputSchema.parse(input);
	const body = asRecord(
		await emailableGet<unknown>(ctx.key, '/v1/verify', { email }),
	);
	const verification = EmailableVerificationEntity.parse({
		id: text(body?.email) ?? email,
		state: text(body?.state),
		score: typeof body?.score === 'number' ? body.score : undefined,
		reason: text(body?.reason),
	});
	await save(ctx.db?.verifications, verification, 'verification');
	await logEventFromContext(
		ctx,
		'emailable.verifications.verify',
		{ count: 1 },
		'completed',
	);
	return { verification };
};

export const createBatch: CorsairEndpoint<
	EmailableContext,
	BatchCreateInput,
	BatchResponse
> = async (ctx, input) => {
	const { emails } = BatchCreateInputSchema.parse(input);
	const batch = batchOf(
		await emailablePost<unknown>(ctx.key, '/v1/batch', { emails }),
	);
	await save(ctx.db?.batches, batch, 'batch');
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
	BatchResponse
> = async (ctx, input) => {
	const { id } = BatchIdInputSchema.parse(input);
	const batch = batchOf(
		await emailableGet<unknown>(ctx.key, '/v1/batch', { id }),
	);
	await save(ctx.db?.batches, batch, 'batch');
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
