import { nextOffsetFromLinkHeader } from './client';

const NEXT =
	'<https://api.hotspotsystem.com/v2.0/locations?limit=10&offset=10>; rel="next"';
const PREV =
	'<https://api.hotspotsystem.com/v2.0/locations?limit=10&offset=0>; rel="prev"';
const SELF =
	'<https://api.hotspotsystem.com/v2.0/locations?limit=10&offset=10>; rel="self"';

describe('nextOffsetFromLinkHeader', () => {
	it('reads the offset out of the next relation', () => {
		expect(nextOffsetFromLinkHeader(NEXT)).toBe(10);
	});

	it('finds next among several relations in one header', () => {
		// The documented form puts every relation in one `Link` header, comma
		// separated, so the right one has to be picked out.
		expect(nextOffsetFromLinkHeader(`${SELF}, ${PREV}, ${NEXT}`)).toBe(10);
	});

	it('returns nothing when the header names no next relation', () => {
		expect(nextOffsetFromLinkHeader(PREV)).toBeUndefined();
		expect(nextOffsetFromLinkHeader(SELF)).toBeUndefined();
	});

	it('returns nothing for an absent or empty header', () => {
		expect(nextOffsetFromLinkHeader(undefined)).toBeUndefined();
		expect(nextOffsetFromLinkHeader(null)).toBeUndefined();
		expect(nextOffsetFromLinkHeader('')).toBeUndefined();
	});

	it('tolerates rel without quotes, as some servers send it', () => {
		expect(
			nextOffsetFromLinkHeader(
				'<https://api.hotspotsystem.com/v2.0/locations?limit=5&offset=5>; rel=next',
			),
		).toBe(5);
	});

	it('ignores a next relation with no offset in it', () => {
		expect(
			nextOffsetFromLinkHeader(
				'<https://api.hotspotsystem.com/v2.0/locations?limit=10>; rel="next"',
			),
		).toBeUndefined();
	});

	it('refuses a value that is not a usable offset', () => {
		expect(
			nextOffsetFromLinkHeader(
				'<https://api.hotspotsystem.com/v2.0/locations?offset=abc>; rel="next"',
			),
		).toBeUndefined();
		expect(
			nextOffsetFromLinkHeader(
				'<https://api.hotspotsystem.com/v2.0/locations?offset=-5>; rel="next"',
			),
		).toBeUndefined();
	});

	it('reads offset 0, which is a real page', () => {
		expect(
			nextOffsetFromLinkHeader(
				'<https://api.hotspotsystem.com/v2.0/locations?limit=10&offset=0>; rel="next"',
			),
		).toBe(0);
	});

	it('does not match a relation whose name merely ends in next', () => {
		// A naive `includes('next')` would accept this.
		expect(
			nextOffsetFromLinkHeader(
				'<https://api.hotspotsystem.com/v2.0/locations?offset=99>; rel="nextish"',
			),
		).toBeUndefined();
	});
});
