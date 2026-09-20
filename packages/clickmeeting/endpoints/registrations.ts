import { logEventFromContext } from 'corsair/core';
import { makeClickmeetingRequest } from '../client';
import type { ClickmeetingEndpoints } from '../index';
import { ClickmeetingEndpointOutputSchemas } from './types';

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
		const res = await makeClickmeetingRequest<unknown>(
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
		return ClickmeetingEndpointOutputSchemas.registerParticipant.parse(res);
	};

export const getRegistrations: ClickmeetingEndpoints['getRegistrations'] =
	async (ctx, input) => {
		const status = input.status ?? 'all';
		const res = await makeClickmeetingRequest<unknown>(
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
		return ClickmeetingEndpointOutputSchemas.getRegistrations.parse(res);
	};

export const listRegistrationsByStatus: ClickmeetingEndpoints['listRegistrationsByStatus'] =
	async (ctx, input) => {
		const status = input.status ?? 'all';
		const res = await makeClickmeetingRequest<unknown>(
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
		return ClickmeetingEndpointOutputSchemas.listRegistrationsByStatus.parse(
			res,
		);
	};

export const createContact: ClickmeetingEndpoints['createContact'] = async (
	ctx,
	input,
) => {
	const res = await makeClickmeetingRequest<unknown>('/contacts', ctx.key, {
		method: 'POST',
		body: input,
	});
	await logEventFromContext(
		ctx,
		'clickmeeting.registrations.createContact',
		{},
		'completed',
	);
	return ClickmeetingEndpointOutputSchemas.createContact.parse(res);
};
