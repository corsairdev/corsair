import { logEventFromContext } from 'corsair/core';
import type { SendGridEndpoints } from '..';
import { makeSendGridRequest } from '../client';
import { SendGridBounce } from '../schema/database';

export const getBounces: SendGridEndpoints['suppressionsGetBounces'] = async (
	ctx,
	input,
) => {
	const query: Record<string, string | number | boolean | undefined> = {};
	if (input.start_time) query.start_time = input.start_time;
	if (input.end_time) query.end_time = input.end_time;
	if (input.limit) query.limit = input.limit;
	if (input.offset !== undefined) query.offset = input.offset;

	const response = await makeSendGridRequest<unknown>(
		'suppression/bounces',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	const bounces = Array.isArray(response)
		? response.map((item) => SendGridBounce.parse(item))
		: [];

	await logEventFromContext(
		ctx,
		'sendgrid.suppressions.getBounces',
		{ bounce_count: bounces.length },
		'completed',
	);
	return { bounces };
};
