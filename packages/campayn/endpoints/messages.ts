import { logEventFromContext } from 'corsair/core';
import type { CampaynEndpoints } from '..';
import { makeCampaynRequest } from '../client';
import {
	GetMessageStatisticsInputSchema,
	GetMessageStatisticsResponseSchema,
	GetMessagesInputSchema,
	GetMessagesResponseSchema,
} from './types';

export const getMessages: CampaynEndpoints['getMessages'] = async (
	ctx,
	rawInput,
) => {
	const input = GetMessagesInputSchema.parse(rawInput);
	const raw = await makeCampaynRequest('emails.json', ctx.key, {
		method: 'GET',
	});
	const response = GetMessagesResponseSchema.parse(raw);

	await logEventFromContext(
		ctx,
		'campayn.messages.getMessages',
		input,
		'completed',
	);
	return response;
};

export const getMessageStatistics: CampaynEndpoints['getMessageStatistics'] =
	async (ctx, rawInput) => {
		const input = GetMessageStatisticsInputSchema.parse(rawInput);
		const raw = await makeCampaynRequest(
			`emails/${input.messageId}.json`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const response = GetMessageStatisticsResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'campayn.messages.getMessageStatistics',
			{ messageId: input.messageId },
			'completed',
		);
		return response;
	};
