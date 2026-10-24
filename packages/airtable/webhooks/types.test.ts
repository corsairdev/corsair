import { createAirtableMatch } from './types';

describe('createAirtableMatch', () => {
	const match = createAirtableMatch();

	it('does not match malformed JSON bodies', () => {
		expect(match({ headers: {}, body: '{not-json' })).toBe(false);
	});

	it('does not match JSON arrays', () => {
		expect(match({ headers: {}, body: '[]' })).toBe(false);
	});

	it('matches an Airtable webhook-shaped object', () => {
		expect(
			match({
				headers: {},
				body: JSON.stringify({ base: {}, webhook: {} }),
			}),
		).toBe(true);
	});
});
