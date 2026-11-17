import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { isProoflyFailure, prooflyFailure, prooflyGet } from '../client';
import type { ProoflyContext } from '../context';
import { ProoflyUserEntity } from '../schema/database';
import type { GetUserInput, GetUserResponse } from './types';
import { GetUserInputSchema, GetUserResponseSchema } from './types';

export const getUser: CorsairEndpoint<
	ProoflyContext,
	GetUserInput,
	GetUserResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('proofly', 'api_key');
	}
	GetUserInputSchema.parse(input);
	// unknown: checked for `ok: false`, then parsed by the response schema.
	const body = await prooflyGet<unknown>(ctx.key, '/user');
	if (isProoflyFailure(body)) throw prooflyFailure('/user', body);
	const parsed = GetUserResponseSchema.parse(body);
	const data = {
		email: parsed.data.email,
		name: parsed.data.name,
		meta: parsed.data.meta,
		impressions: parsed.data.impressions,
	};
	const result = { ...parsed, data };
	await storeUser(ctx, result.data);
	await logEventFromContext(ctx, 'proofly.user.get', {}, 'completed');
	return result;
};

async function storeUser(
	ctx: ProoflyContext,
	user: GetUserResponse['data'],
): Promise<void> {
	if (!ctx.db?.users) return;
	const row = ProoflyUserEntity.safeParse({
		email: user.email,
		name: user.name,
		logins: user.meta?.logins,
		registered: user.meta?.registered,
		impressionsPeriod: user.impressions?.period,
		impressionsTotal: user.impressions?.total,
	});
	if (!row.success) return;
	try {
		await ctx.db.users.upsertByEntityId(row.data.email, row.data);
	} catch {
		console.warn('Failed to save Proofly user');
	}
}
