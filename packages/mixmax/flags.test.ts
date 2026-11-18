import { z } from 'zod';
import { mixmaxBooleanFlag } from './endpoints/flags';

describe('Mixmax boolean query flags', () => {
	it.each([
		[true, true],
		[false, false],
		['true', true],
		['false', false],
	] as const)('parses %p as %p', (input, expected) => {
		expect(mixmaxBooleanFlag.parse(input)).toBe(expected);
	});

	it.each(['yes', '1', 1, 0, null])('rejects %p', (input) => {
		expect(mixmaxBooleanFlag.safeParse(input).success).toBe(false);
	});

	// Studio's form builder and any JSON Schema consumer read the output side
	// of the schema. A bare `.transform()` has no output type, so the flag
	// rendered as a disabled "unknown" input; ending in a boolean keeps the
	// control a checkbox.
	it('declares a boolean on its output side', () => {
		expect(z.toJSONSchema(mixmaxBooleanFlag, { io: 'output' })).toMatchObject({
			type: 'boolean',
		});
	});
});
