import type { WaiverFileEndpoints } from '..';
import { call } from './call';
import { fromDotNet } from './shape';
import {
	WaiverFileEndpointInputSchemas as Inputs,
	WaiverFileEndpointOutputSchemas as Outputs,
} from './types';

/** Checks that the key and site pair work, and that the service is up. */
export const ping: WaiverFileEndpoints['ping'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'ping', input: Inputs.ping, output: Outputs.ping },
		input,
		() => ({ method: 'GET', path: '/api/v1/Ping' }),
		{
			// The body is the bare string "Service online".
			shape: (raw) => ({ Message: typeof raw === 'string' ? raw : undefined }),
			log: (_, result) => ({ message: result.Message ?? undefined }),
		},
	);

/** The site behind the credentials: its name, timezone and contact details. */
export const get: WaiverFileEndpoints['siteGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'site.get', input: Inputs.siteGet, output: Outputs.siteGet },
		input,
		() => ({ method: 'GET', path: '/api/v1/GetSiteDetails' }),
		{
			// The labels and their raw data are over a megabyte of UI text that
			// says nothing about the site, so they are dropped.
			shape: (raw) => {
				const {
					Labels: _labels,
					LabelData: _labelData,
					...site
				} = (fromDotNet(raw) ?? {}) as Record<string, unknown>;
				return site;
			},
			log: (_, result) => ({
				id: result.ID ?? undefined,
				name: result.Name ?? undefined,
			}),
		},
	);
