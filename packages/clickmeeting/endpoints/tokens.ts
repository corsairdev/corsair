import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';

export const createAccessTokens: ClickmeetingEndpoints['createAccessTokens'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/tokens`,
			ctx.key,
			{
				method: 'POST',
				body: { how_many: input.how_many ?? 1 },
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.tokens.createAccessTokens',
			{ roomId: input.roomId },
			'completed',
		);
		return res;
	};

export const listAccessTokens: ClickmeetingEndpoints['listAccessTokens'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/tokens`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.tokens.listAccessTokens',
			{ roomId: input.roomId },
			'completed',
		);
		return res;
	};

export const getTokenByEmail: ClickmeetingEndpoints['getTokenByEmail'] = async (
	ctx,
	input,
) => {
	const res = await makeClickmeetingRequest<any>(
		`/conferences/${encodeURIComponent(String(input.roomId))}/tokens`,
		ctx.key,
		{
			method: 'GET',
			query: { email: input.email },
		},
	);
	await logEventFromContext(
		ctx,
		'clickmeeting.tokens.getTokenByEmail',
		{ roomId: input.roomId, email: input.email },
		'completed',
	);
	return res;
};
