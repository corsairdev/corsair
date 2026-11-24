import { moceanForm } from '../client';
import { endpoint, FORM } from './call';

/** Looks up a number's carrier and porting status; uses prepaid credit. */
export const request = endpoint('lookupRequest', {
	event: 'lookup.request',
	request: ({ mocean_to, mocean_nl_url }) => ({
		family: 'query',
		method: 'POST',
		path: '/rest/2/nl',
		body: moceanForm({
			'mocean-to': mocean_to,
			'mocean-nl-url': mocean_nl_url,
		}),
		mediaType: FORM,
	}),
	log: (_, result) => ({ ported: result.ported ?? undefined }),
});
