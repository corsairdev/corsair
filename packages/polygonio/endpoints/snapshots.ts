import type { PolygonioEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PolygonioEndpointInputSchemas as Inputs,
	PolygonioEndpointOutputSchemas as Outputs,
} from './types';

export const snapshot: PolygonioEndpoints['snapshot'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'snapshot', input: Inputs.snapshot, output: Outputs.snapshot },
		input,
		({ ticker }) => ({
			method: 'GET',
			path: `/v2/snapshot/locale/us/markets/stocks/tickers/${segment(ticker)}`,
		}),
		{ log: ({ ticker }) => ({ ticker }) },
	);

export const movers: PolygonioEndpoints['movers'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'movers', input: Inputs.movers, output: Outputs.movers },
		input,
		({ direction, include_otc }) => ({
			method: 'GET',
			path: `/v2/snapshot/locale/us/markets/stocks/${segment(direction)}`,
			query: { include_otc },
		}),
		{
			log: (parsed, result) => ({
				direction: parsed.direction,
				count: result.tickers?.length ?? 0,
			}),
		},
	);
