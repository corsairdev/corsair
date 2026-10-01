import { parseDurationMs } from '../core/permissions';

const DEFAULT_MS = 10 * 60 * 1_000;

describe('parseDurationMs', () => {
	it.each([
		['30s', 30_000],
		['10m', 600_000],
		['1h', 3_600_000],
		['2h30m', 9_000_000],
		['1d', 86_400_000],
	])('parses %s', (input, expected) => {
		expect(parseDurationMs(input)).toBe(expected);
	});

	it('keeps 0s as 0', () => {
		expect(parseDurationMs('0s')).toBe(0);
	});

	it.each(['1.5h', '500ms', '', 'abc', '10', '5x', ' 30s', '30s ', '1h30'])(
		'falls back to the default for %p',
		(input) => {
			expect(parseDurationMs(input)).toBe(DEFAULT_MS);
		},
	);
});
