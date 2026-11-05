import { logEventFromContext } from 'corsair/core';
import { compactQuery, makeAmaraRequest } from '../client';
import type { AmaraEndpoints } from '../index';
import { ActivityListResponseSchema, ActivitySchema } from './types';

export const list: AmaraEndpoints['activityList'] = async (ctx, input) => {
	const raw = await makeAmaraRequest('activity/', ctx.key, {
		query: compactQuery({
			team: input.team,
			type: input.type,
			after: input.after,
			limit: input.limit,
			video: input.video,
			before: input.before,
			offset: input.offset,
			language: input.language,
			team_activity: input.team_activity,
		}),
	});
	const response = ActivityListResponseSchema.parse(raw);
	await logEventFromContext(ctx, 'amara.activity.list', {}, 'completed');
	return response;
};

export const get: AmaraEndpoints['activityGet'] = async (ctx, input) => {
	const raw = await makeAmaraRequest(
		`activity/${encodeURIComponent(String(input.activity_id))}/`,
		ctx.key,
	);
	const response = ActivitySchema.parse(raw);
	await logEventFromContext(
		ctx,
		'amara.activity.get',
		{ activity_id: input.activity_id },
		'completed',
	);
	return response;
};
