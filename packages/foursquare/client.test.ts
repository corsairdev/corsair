import { cursorFromLinkHeader } from './client';

describe('cursorFromLinkHeader', () => {
	it('reads the cursor out of a real next-page link', () => {
		// The exact header shape the API sent while building this plugin.
		const link =
			'<https://places-api.foursquare.com/places/search?limit=3&near=Chicago%2CIL&cursor=c3I6Mw>; rel="next"';
		expect(cursorFromLinkHeader(link)).toBe('c3I6Mw');
	});

	it('reads a cursor that is not the first query parameter', () => {
		expect(
			cursorFromLinkHeader('<https://x/y?cursor=abc123>; rel="next"'),
		).toBe('abc123');
	});

	it('decodes a percent-encoded cursor', () => {
		expect(cursorFromLinkHeader('<https://x/y?cursor=a%2Fb>; rel="next"')).toBe(
			'a/b',
		);
	});

	it('returns undefined when the header is absent', () => {
		expect(cursorFromLinkHeader(null)).toBeUndefined();
		expect(cursorFromLinkHeader(undefined)).toBeUndefined();
	});

	it('returns undefined when there is no cursor', () => {
		expect(
			cursorFromLinkHeader('<https://x/y?limit=3>; rel="next"'),
		).toBeUndefined();
	});

	it('returns undefined for a malformed header', () => {
		expect(cursorFromLinkHeader('garbage')).toBeUndefined();
	});
});
