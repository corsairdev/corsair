import type { CertSpotterEndpoints } from '..';
import { call } from './call';
import {
	CertSpotterEndpointInputSchemas,
	CertSpotterEndpointOutputSchemas,
} from './types';

/**
 * Builds the query both routes share. `expand` repeats as one parameter per
 * value, which `getQueryString` already does for an array.
 */
function expandQuery(expand: readonly string[] | undefined) {
	return expand === undefined || expand.length === 0 ? undefined : [...expand];
}

export const listIssuances: CertSpotterEndpoints['issuancesList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'issuances.list',
			input: CertSpotterEndpointInputSchemas.listIssuances,
			output: CertSpotterEndpointOutputSchemas.listIssuances,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'issuances',
			query: {
				domain: parsed.domain,
				include_subdomains: parsed.include_subdomains,
				match_wildcards: parsed.match_wildcards,
				after: parsed.after,
				expand: expandQuery(parsed.expand),
			},
		}),
		{
			log: (parsed, result) => ({
				domain: parsed.domain,
				include_subdomains: parsed.include_subdomains ?? false,
				issuances: result.length,
			}),
		},
	);

export const firehose: CertSpotterEndpoints['firehoseList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'firehose',
			input: CertSpotterEndpointInputSchemas.firehose,
			output: CertSpotterEndpointOutputSchemas.firehose,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'issuances/firehose',
			query: {
				after: parsed.after,
				expand: expandQuery(parsed.expand),
			},
		}),
		{
			log: (parsed, result) => ({
				after: parsed.after,
				issuances: result.length,
			}),
		},
	);
