import { fly } from './index';

describe('Fly plugin options', () => {
	it('uses the default auth type without claiming caller-supplied options', () => {
		expect(fly().options).toEqual({ authType: 'api_key' });
		expect(fly({ key: 'token' }).options).toEqual({
			authType: 'api_key',
			key: 'token',
		});
	});
});

// Supplying a generic with required fields must not allow omitting its argument.
if (false) {
	// @ts-expect-error The required key cannot be provided by the empty default.
	fly<{ key: string }>();
}
