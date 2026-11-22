import type { PiggyEndpoints } from '..';
import { call } from './call';
import {
	PiggyEndpointInputSchemas as Inputs,
	PiggyEndpointOutputSchemas as Outputs,
} from './types';

const CLIENT = '/api/v3/oauth/clients';

export const create: PiggyEndpoints['pointsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'points.create',
			input: Inputs.pointsCreate,
			output: Outputs.pointsCreate,
		},
		input,
		({ contactUuid, businessProfileUuid, points, customAttributes }) => ({
			method: 'POST',
			path: `${CLIENT}/direct-points-transactions`,
			body: {
				contact: { uuid: contactUuid },
				business_profile: { uuid: businessProfileUuid },
				points,
				custom_attributes: customAttributes,
			},
		}),
		{
			log: (_, tx) => ({
				uuid: tx.data.uuid ?? undefined,
				points: tx.data.points ?? undefined,
			}),
		},
	);

export const get: PiggyEndpoints['pointsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'points.get',
			input: Inputs.pointsGet,
			output: Outputs.pointsGet,
		},
		input,
		({ uuid }) => ({
			method: 'GET',
			path: `${CLIENT}/direct-points-transactions/${encodeURIComponent(uuid)}`,
		}),
		{ log: (_, tx) => ({ uuid: tx.data.uuid ?? undefined }) },
	);

export const reverse: PiggyEndpoints['pointsReverse'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'points.reverse',
			input: Inputs.pointsReverse,
			output: Outputs.pointsReverse,
		},
		input,
		({ uuid }) => ({
			method: 'POST',
			path: `${CLIENT}/direct-points-transactions/${encodeURIComponent(uuid)}/reverse`,
		}),
		{ log: (_, tx) => ({ uuid: tx.data.uuid ?? undefined }) },
	);
