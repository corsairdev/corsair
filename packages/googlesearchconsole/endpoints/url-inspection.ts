import type { GoogleSearchConsoleEndpoints } from '..';
import { call } from './call';
import {
	GoogleSearchConsoleEndpointInputSchemas as Inputs,
	GoogleSearchConsoleEndpointOutputSchemas as Outputs,
} from './types';

/**
 * urlInspection.index.inspect reports what Google knows about one URL: whether
 * it is indexed, which canonical Google chose, and any mobile-usability or rich
 * result issues.
 *
 * It is a POST under the `v1` host, not the `webmasters/v3` one, and its body
 * carries the property and the URL because neither is a path parameter.
 * URL inspection has its own quota: 2,000 per day and 600 per minute per site.
 */
export const inspect: GoogleSearchConsoleEndpoints['urlInspectionInspect'] =
	async (ctx, rawInput) =>
		call(
			ctx,
			{
				event: 'urlInspection.inspect',
				input: Inputs.urlInspectionInspect,
				output: Outputs.urlInspectionInspect,
			},
			rawInput,
			(input) => ({
				method: 'POST',
				path: '/v1/urlInspection/index:inspect',
				body: {
					siteUrl: input.siteUrl,
					inspectionUrl: input.inspectionUrl,
					...(input.languageCode ? { languageCode: input.languageCode } : {}),
				},
			}),
		);
