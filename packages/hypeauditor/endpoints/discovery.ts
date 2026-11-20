import type { HypeAuditorEndpoints } from '..';
import { call } from './call';
import {
	HypeAuditorEndpointInputSchemas as Inputs,
	HypeAuditorEndpointOutputSchemas as Outputs,
} from './types';

/**
 * One discovery page costs one discovery call, and every page is charged, so
 * the read is marked not replayable: a retried POST would bill a second page.
 *
 * The sandbox action validates the same request and returns sample data without
 * spending a call, which is why it is offered here as a flag rather than as a
 * separate operation.
 */
export const search: HypeAuditorEndpoints['discoverySearch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'discovery.search',
			input: Inputs['discovery.search'],
			output: Outputs['discovery.search'],
		},
		input,
		({ social_network, filters, page, sandbox }) => ({
			method: 'POST',
			action: sandbox ? 'auditor.searchSandbox/' : 'auditor.search/',
			body: {
				...filters,
				social_network,
				page,
			},
			replayable: false,
		}),
		{
			log: ({ social_network, page, sandbox }) => ({
				social_network,
				page,
				sandbox,
			}),
		},
	);

/**
 * Reads the content behind a keyword search. It takes the content IDs the
 * discovery result returns, which is why it is a separate call.
 */
export const keywords: HypeAuditorEndpoints['discoveryKeywords'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'discovery.keywords',
			input: Inputs['discovery.keywords'],
			output: Outputs['discovery.keywords'],
		},
		input,
		({ socialNetwork, contentIds }) => ({
			action: 'auditor.searchKeywordsPosts/',
			query: { socialNetwork, contentIds },
		}),
	);
