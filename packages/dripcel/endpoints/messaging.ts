import { logEventFromContext } from 'corsair/core';
import type { DripcelEndpoints } from '..';
import { makeDripcelRequest } from '../client';
import type { DripcelDelivery, DripcelReply } from '../schema';
import type { DripcelEndpointOutputs } from './types';

export const checkSend: DripcelEndpoints['checkCompliance'] = async (
	ctx,
	input,
) => {
	const { campaign_id, ...body } = input;
	const response = await makeDripcelRequest<
		DripcelEndpointOutputs['checkCompliance']
	>('/compliance/send', ctx.key, {
		method: 'POST',
		body,
		query: { campaign_id },
	});

	await logEventFromContext(
		ctx,
		'dripcel.compliance.checkSend',
		{ count: input.cells.length },
		'completed',
	);
	return response;
};

export const listDeliveries: DripcelEndpoints['listDeliveries'] = async (
	ctx,
	input,
) => {
	const deliveries = await makeDripcelRequest<DripcelDelivery[]>(
		'/deliveries',
		ctx.key,
		{
			method: 'GET',
			query: {
				cell: input.cell,
				customerId: input.customerId,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'dripcel.deliveries.list',
		{ cell: input.cell, customerId: input.customerId },
		'completed',
	);
	return { deliveries: deliveries ?? [] };
};

export const searchReplies: DripcelEndpoints['searchReplies'] = async (
	ctx,
	input,
) => {
	const replies = await makeDripcelRequest<DripcelReply[]>(
		'/replies/search',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(ctx, 'dripcel.replies.search', {}, 'completed');
	return { replies: replies ?? [] };
};

export const searchSendLogs: DripcelEndpoints['searchSendLogs'] = async (
	ctx,
	input,
) => {
	const response = await makeDripcelRequest<
		DripcelEndpointOutputs['searchSendLogs']
	>('/send-logs/search', ctx.key, {
		method: 'POST',
		body: {
			...input,
			find: input.find ?? {},
		},
	});

	await logEventFromContext(ctx, 'dripcel.sendLogs.search', {}, 'completed');
	return response;
};

export const sms: DripcelEndpoints['sendSms'] = async (ctx, input) => {
	const response = await makeDripcelRequest<DripcelEndpointOutputs['sendSms']>(
		'/send/sms',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'dripcel.send.sms',
		{ cell: input.cell },
		'completed',
	);
	return response;
};

export const bulkEmail: DripcelEndpoints['sendBulkEmail'] = async (
	ctx,
	input,
) => {
	const response = await makeDripcelRequest<
		DripcelEndpointOutputs['sendBulkEmail']
	>('/send/email/bulk', ctx.key, {
		method: 'POST',
		body: input,
	});

	await logEventFromContext(
		ctx,
		'dripcel.send.bulkEmail',
		{ count: input.destinations.length },
		'completed',
	);
	return response ?? {};
};
