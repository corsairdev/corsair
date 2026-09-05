import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';

export const registerParticipant: ClickmeetingEndpoints['registerParticipant'] =
	async (ctx, input) => {
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/registration`,
			ctx.key,
			{
				method: 'POST',
				body: { registration: input.registration },
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.registrations.registerParticipant',
			{ roomId: input.roomId },
			'completed',
		);
		return res;
	};

export const getRegistrations: ClickmeetingEndpoints['getRegistrations'] =
	async (ctx, input) => {
		const status = input.status ?? 'all';
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/registrations/${status}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.registrations.getRegistrations',
			{ roomId: input.roomId, status },
			'completed',
		);
		return res;
	};

export const listRegistrationsByStatus: ClickmeetingEndpoints['listRegistrationsByStatus'] =
	async (ctx, input) => {
		const status = input.status ?? 'all';
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/registrations/${status}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		await logEventFromContext(
			ctx,
			'clickmeeting.registrations.listRegistrationsByStatus',
			{ roomId: input.roomId, status },
			'completed',
		);
		return res;
	};

export const createContact: ClickmeetingEndpoints['createContact'] = async (
	ctx,
	input,
) => {
	const res = await makeClickmeetingRequest<any>('/contacts', ctx.key, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'clickmeeting.registrations.createContact',
		{},
		'completed',
	);
	return res;
};
