import { logEventFromContext } from 'corsair/core';
import type { SendGridEndpoints } from '..';
import { makeSendGridRequest } from '../client';
import type { SuppressionsGetBouncesOutput } from './types';

export const getBounces: SendGridEndpoints['suppressionsGetBounces'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.start_time) query.start_time = input.start_time;
	if (input.end_time) query.end_time = input.end_time;

	const response = await makeSendGridRequest<unknown>(
		'suppression/bounces',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const bounces = Array.isArray(response) ? response : [];

	await logEventFromContext(
		ctx,
		'sendgrid.suppressions.getBounces',
		{ ...input },
		'completed',
	);
	return { bounces } as SuppressionsGetBouncesOutput;
};
