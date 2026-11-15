import type { SimpleanalyticsEndpoints } from '..';
import { isRootPath, statsPath } from '../client';
import { call } from './shared';
import {
	SimpleanalyticsEndpointInputSchemas as Inputs,
	SimpleanalyticsEndpointOutputSchemas as Outputs,
} from './types';

export const get: SimpleanalyticsEndpoints['statsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stats.get',
			input: Inputs.statsGet,
			output: Outputs.statsGet,
		},
		input,
		async (parsed) => ({
			method: 'GET',
			path: statsPath(parsed.hostname, parsed.path),
			query: {
				version: 6,
				// The response otherwise carries a `__`-prefixed explanation for
				// every field, which doubles its size and confuses a reader.
				info: false,
				start: parsed.start,
				end: parsed.end,
				timezone: parsed.timezone,
				fields: parsed.fields.join(','),
				limit: parsed.limit,
				interval: parsed.interval,
				events: parsed.events?.join(','),
				// The homepage has no segment to put before .json, so `/` is sent
				// as the page filter instead.
				page: parsed.page ?? (isRootPath(parsed.path) ? '/' : undefined),
				pages: parsed.pages,
				country: parsed.country,
				referrer: parsed.referrer,
				utm_source: parsed.utm_source,
				utm_medium: parsed.utm_medium,
				utm_campaign: parsed.utm_campaign,
				utm_content: parsed.utm_content,
				utm_term: parsed.utm_term,
				browser_name: parsed.browser_name,
				os_name: parsed.os_name,
				device_type: parsed.device_type,
				// Metadata filters are `metadata.<key>` query parameters, so they
				// have to be spread rather than nested.
				...Object.fromEntries(
					Object.entries(parsed.metadata ?? {}).map(([key, value]) => [
						`metadata.${key}`,
						value,
					]),
				),
			},
		}),
		{
			log: (parsed, result) => ({
				hostname: parsed.hostname,
				start: parsed.start,
				end: parsed.end,
				fields: parsed.fields.length,
				pageviews: result.pageviews ?? undefined,
				visitors: result.visitors ?? undefined,
			}),
		},
	);
