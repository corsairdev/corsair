import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['idcsList'] = async (ctx, input) => {
	GmicloudEndpointInputSchemas.idcsList.parse(input);
	const result = GmicloudEndpointOutputSchemas.idcsList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v1/idcs',
		}),
	);
	await logEventFromContext(ctx, 'gmicloud.idcs.list', {}, 'completed');
	return result;
};
