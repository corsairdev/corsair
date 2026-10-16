import type { TinyFishEndpoints } from '..';
import { makeTinyFishRequest } from '../client';
import { callTinyFish } from './call';
import {
	TinyFishEndpointInputSchemas,
	TinyFishEndpointOutputSchemas,
} from './types';

export const createSession: TinyFishEndpoints['createBrowserSession'] = async (
	ctx,
	input,
) => {
	return callTinyFish(
		ctx,
		'tinyfish.browser.createSession',
		TinyFishEndpointInputSchemas.createBrowserSession,
		TinyFishEndpointOutputSchemas.createBrowserSession,
		input,
		(validated) =>
			makeTinyFishRequest('browser', '/', ctx.key, {
				method: 'POST',
				body: validated,
			}),
		(validated, response) => ({
			sessionId: response.session_id,
			startUrl: validated.url,
			proxyCountry: validated.proxy_config?.country_code,
		}),
	);
};

export const terminateSession: TinyFishEndpoints['terminateBrowserSession'] =
	async (ctx, input) => {
		return callTinyFish(
			ctx,
			'tinyfish.browser.terminateSession',
			TinyFishEndpointInputSchemas.terminateBrowserSession,
			TinyFishEndpointOutputSchemas.terminateBrowserSession,
			input,
			async (validated) => {
				// The endpoint answers 204 No Content, which the shared client
				// resolves to undefined; the confirmation comes from the request.
				await makeTinyFishRequest(
					'browser',
					`/${encodeURIComponent(validated.sessionId)}`,
					ctx.key,
					{ method: 'DELETE' },
				);
				return { terminated: true as const, session_id: validated.sessionId };
			},
			(validated) => ({
				sessionId: validated.sessionId,
				terminated: true,
			}),
		);
	};

export const usage: TinyFishEndpoints['browserUsage'] = async (ctx, input) => {
	return callTinyFish(
		ctx,
		'tinyfish.browser.usage',
		TinyFishEndpointInputSchemas.browserUsage,
		TinyFishEndpointOutputSchemas.browserUsage,
		input,
		(validated) =>
			makeTinyFishRequest('browser', '/usage', ctx.key, {
				method: 'GET',
				query: {
					session_id: validated.session_id,
					start_after: validated.start_after,
					end_before: validated.end_before,
					status: validated.status,
					limit: validated.limit,
					page: validated.page,
				},
			}),
		(validated, response) => ({
			sessionId: validated.session_id,
			itemCount: response.items.length,
			total: response.total,
			page: response.page,
		}),
	);
};
