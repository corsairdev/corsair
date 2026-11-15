import type { SimilarwebEndpoints } from '..';
import { segment } from '../client';
import { call } from './shared';
import {
	SimilarwebEndpointInputSchemas as Inputs,
	SimilarwebEndpointOutputSchemas as Outputs,
} from './types';

export const rank: SimilarwebEndpoints['appsRank'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apps.rank',
			input: Inputs.appsRank,
			output: Outputs.appsRank,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/v1/app/${segment(parsed.store)}/${segment(parsed.app_id)}/rank/app-store-rank`,
			query: {
				country: parsed.country.toLowerCase(),
				category: parsed.category,
				mode: parsed.mode,
				device: parsed.device,
				duration: parsed.duration,
			},
		}),
		{
			log: (parsed, result) => ({
				store: parsed.store,
				appId: parsed.app_id,
				country: parsed.country,
				points: result.ranks.length,
			}),
		},
	);

/**
 * This route needs no key and no parameters: it lists the countries, stores,
 * modes and devices the rank route accepts, which is the only way to know a
 * valid `mode`.
 */
export const describe: SimilarwebEndpoints['appsDescribe'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'apps.describe',
			input: Inputs.appsDescribe,
			output: Outputs.appsDescribe,
		},
		input,
		() => ({ method: 'GET', path: '/v1/app/rank/describe' }),
		{
			log: (_, result) => ({
				stores: result.app_rank.stores.length,
				countries: result.app_rank.countries.length,
			}),
		},
	);
