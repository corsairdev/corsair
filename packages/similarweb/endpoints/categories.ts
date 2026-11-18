import type { SimilarwebEndpoints } from '..';
import { call } from './shared';
import {
	SimilarwebEndpointInputSchemas as Inputs,
	SimilarwebEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The route answers the bare category tree, not an envelope, and it needs no
 * key. The tree is wrapped so the output has a name, and a non-object answer
 * throws rather than becoming an empty category list.
 */
export const list: SimilarwebEndpoints['categoriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'categories.list',
			input: Inputs.categoriesList,
			output: Outputs.categoriesList,
		},
		input,
		() => ({ method: 'GET', path: '/v1/TopSites/categories' }),
		{
			shape: (raw) => {
				if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
					throw new Error(
						'categories.list expected a category tree from Similarweb.',
					);
				}
				return { categories: raw };
			},
			log: (_, result) => ({
				categories: Object.keys(result.categories).length,
			}),
		},
	);
