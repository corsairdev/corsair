import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import { SurfResponse, XTweetsInput } from './types';

export const X = {
	tweets: (ctx: SurfContext, input: SurfEndpointInputs['xTweets']) =>
		callSurf(
			ctx,
			'x.tweets',
			XTweetsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/x/tweets',
				query: omitEmpty({ ids: validated.ids }),
			}),
			(validated) => ({ ids: String(validated.ids ?? '') }),
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
