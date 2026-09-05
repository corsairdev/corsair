import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';

export const registerParticipant: ClickmeetingEndpoints['registerParticipant'] =
	async (ctx, input) => {
		const params = new URLSearchParams();
		if (input.registration && typeof input.registration === 'object') {
			for (const [key, value] of Object.entries(input.registration)) {
				if (value !== undefined && value !== null) {
					params.append(`registration[${key}]`, String(value));
				}
			}
		}
		const res = await makeClickmeetingRequest<any>(
			`/conferences/${encodeURIComponent(String(input.roomId))}/registration`,
			ctx.key,
			{
				method: 'POST',
				body: params.toString(),
				mediaType: 'application/x-www-form-urlencoded',
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
