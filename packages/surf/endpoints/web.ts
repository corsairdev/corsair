import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import { SurfResponse, WebFetchInput } from './types';

export const Web = {
	fetch: (ctx: SurfContext, input: SurfEndpointInputs['webFetch']) =>
		callSurf(
			ctx,
			'web.fetch',
			WebFetchInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/web/fetch',
				query: omitEmpty({
					url: validated.url,
					target_selector: validated.target_selector,
					remove_selector: validated.remove_selector,
					wait_for_selector: validated.wait_for_selector,
					timeout: validated.timeout,
				}),
			}),
			(validated) => ({ url: String(validated.url ?? '') }),
		),
};

function omitEmpty<T extends Record<string, unknown>>(value: T): T {
	// Optional query and body fields are omitted. The helper is generic over that object.
	const next = { ...value };
	for (const key of Object.keys(next)) {
		if (next[key] === undefined) delete next[key];
	}
	return next;
}
