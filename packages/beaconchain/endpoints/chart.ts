import { logEventFromContext } from 'corsair/core';
import { makeBeaconchainRequest } from '../client';
import type { BeaconchainEndpoints } from '../index';
import type { BeaconchainBaseResponse } from './types';

export const getChart: BeaconchainEndpoints['getChart'] = async (
	ctx,
	input,
) => {
	const res = await makeBeaconchainRequest<BeaconchainBaseResponse>(
		`chart/${input.chartName}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'beaconchain.chart.get',
		{ chartName: input.chartName },
		'completed',
	);
	return res;
};
