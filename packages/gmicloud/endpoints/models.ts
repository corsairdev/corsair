import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import { saveRecords } from './persistence';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['modelsList'] = async (ctx, input) => {
	GmicloudEndpointInputSchemas.modelsList.parse(input);
	const result = GmicloudEndpointOutputSchemas.modelsList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'inference',
			method: 'GET',
			url: 'v1/models',
		}),
	);
	await saveRecords(ctx.db.models, result.data);
	await logEventFromContext(
		ctx,
		'gmicloud.models.list',
		{ count: result.data.length },
		'completed',
	);
	return result;
};
