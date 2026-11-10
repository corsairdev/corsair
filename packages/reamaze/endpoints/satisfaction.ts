import type { ReamazeEndpoints } from '..';
import { call, queryOf, unwrapList, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

export const list: ReamazeEndpoints['satisfactionRatingsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'satisfaction_ratings.list',
			input: Inputs.satisfactionRatingsList,
			output: Outputs.satisfactionRatingsList,
		},
		input,
		({
			brand,
			rating,
			assignee_id,
			created_after,
			created_before,
			updated_after,
			updated_before,
			page,
		}) => ({
			method: 'GET',
			path: '/satisfaction_ratings',
			query: queryOf({
				brand,
				rating,
				assignee_id,
				created_after,
				created_before,
				updated_after,
				updated_before,
				page,
			}),
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'satisfaction rating list'),
				satisfaction_ratings: unwrapList(
					raw,
					'satisfaction_ratings',
					'satisfaction rating list',
				),
			}),
			log: (_, result) => ({
				count: result.satisfaction_ratings.length,
			}),
		},
	);
