import { verifyOnedriveClientState } from './types';

describe('verifyOnedriveClientState', () => {
	const expectedClientState = 'secret-client-state-12345';

	it('should return invalid when clientState is missing in notification', () => {
		const result = verifyOnedriveClientState({}, expectedClientState);
		expect(result).toEqual({
			valid: false,
			error: 'Missing clientState in notification',
		});
	});

	it('should return invalid when clientState is null in notification', () => {
		const result = verifyOnedriveClientState(
			{ clientState: null },
			expectedClientState,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing clientState in notification',
		});
	});

	it('should return invalid when clientState is an empty string', () => {
		const result = verifyOnedriveClientState(
			{ clientState: '' },
			expectedClientState,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing clientState in notification',
		});
	});

	it('should return valid for matching clientState', () => {
		const result = verifyOnedriveClientState(
			{ clientState: 'secret-client-state-12345' },
			expectedClientState,
		);
		expect(result).toEqual({
			valid: true,
			error: undefined,
		});
	});

	it('should return invalid when clientState values mismatch with same length', () => {
		const result = verifyOnedriveClientState(
			{ clientState: 'secret-client-state-99999' },
			expectedClientState,
		);
		expect(result).toEqual({
			valid: false,
			error: 'clientState mismatch',
		});
	});

	it('should return invalid when clientState values mismatch with different length', () => {
		const result = verifyOnedriveClientState(
			{ clientState: 'short' },
			expectedClientState,
		);
		expect(result).toEqual({
			valid: false,
			error: 'clientState mismatch',
		});
	});

	it('should return invalid without throwing when clientState is a non-string truthy value', () => {
		// Truthy non-string values (e.g. number) can arrive in untrusted webhook payloads
		// at runtime despite TypeScript types. Reject them instead of coercing.
		const result = verifyOnedriveClientState(
			{ clientState: 12345 as unknown as string },
			expectedClientState,
		);
		expect(result).toEqual({
			valid: false,
			error: 'clientState mismatch',
		});
	});

	it('should not treat a numeric clientState as equal to its string form', () => {
		const result = verifyOnedriveClientState(
			{ clientState: 12345 as unknown as string },
			'12345',
		);
		expect(result).toEqual({
			valid: false,
			error: 'clientState mismatch',
		});
	});
});
