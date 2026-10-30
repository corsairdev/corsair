import { logEventFromContext } from 'corsair/core';
import {
	compactQuery,
	encodeAmaraPathSegment,
	makeAmaraRequest,
} from '../client';
import type { AmaraEndpoints } from '../index';
import { ActivityListResponseSchema, UserSchema } from './types';

export const getData: AmaraEndpoints['usersGetData'] = async (ctx, input) => {
	const raw = await makeAmaraRequest(
		`users/${encodeAmaraPathSegment(input.identifier)}/`,
		ctx.key,
	);
	const response = UserSchema.parse(raw);
	await logEventFromContext(ctx, 'amara.users.getData', {}, 'completed');
	return response;
};

export const getActivity: AmaraEndpoints['usersGetActivity'] = async (
	ctx,
	input,
) => {
	const raw = await makeAmaraRequest(
		`users/${encodeAmaraPathSegment(input.identifier)}/activity/`,
		ctx.key,
		{
			query: compactQuery({
				limit: input.limit,
				offset: input.offset,
			}),
		},
	);
	const response = ActivityListResponseSchema.parse(raw);
	await logEventFromContext(ctx, 'amara.users.getActivity', {}, 'completed');
	return response;
};
