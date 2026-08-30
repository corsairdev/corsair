import { logEventFromContext } from 'corsair/core';
import {
	makeBeaconchainV1Request,
	requireBeaconchainKey,
	v1GetOptions,
} from '../client';
import type { BeaconchainEndpoints } from '../index';
import { BeaconchainV1ResponseSchema, GetChartInputSchema } from './types';

export const getChart: BeaconchainEndpoints['getChart'] = async (
	ctx,
	input,
) => {
	const parsed = GetChartInputSchema.parse(input);
	const res = await makeBeaconchainV1Request(
		`chart/${parsed.chartName}`,
		requireBeaconchainKey(ctx.key),
		v1GetOptions(parsed.chain),
	);
	await logEventFromContext(
		ctx,
		'beaconchain.chart.get',
		{ chartName: parsed.chartName },
		'completed',
	);
	return BeaconchainV1ResponseSchema.parse(res);
};
