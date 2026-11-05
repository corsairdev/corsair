import type { TeamsNotification, TeamsWebhookPayload } from './types';
import { verifyTeamsClientState } from './types';

// Regression for #684: verifyTeamsClientState compared clientState with `===`,
// which is not constant-time. The comparison now uses timingSafeEqual after a
// length check, while preserving the valid/invalid outcomes.

function payloadWith(
	...clientStates: (string | undefined)[]
): TeamsWebhookPayload<TeamsNotification> {
	return {
		value: clientStates.map(
			(clientState) => ({ clientState }) as TeamsNotification,
		),
	};
}

describe('verifyTeamsClientState', () => {
	it('accepts a matching clientState', () => {
		const result = verifyTeamsClientState(
			payloadWith('secret-state'),
			'secret-state',
		);
		expect(result).toEqual({ valid: true });
	});

	it('accepts when every notification matches', () => {
		const result = verifyTeamsClientState(
			payloadWith('secret-state', 'secret-state'),
			'secret-state',
		);
		expect(result).toEqual({ valid: true });
	});

	it('rejects a mismatched clientState of equal length', () => {
		const result = verifyTeamsClientState(
			payloadWith('wrong-secret1'),
			'secret-state1',
		);
		expect(result).toEqual({ valid: false, error: 'clientState mismatch' });
	});

	it('rejects a clientState of a different length', () => {
		const result = verifyTeamsClientState(payloadWith('short'), 'secret-state');
		expect(result).toEqual({ valid: false, error: 'clientState mismatch' });
	});

	it('rejects when any notification does not match', () => {
		const result = verifyTeamsClientState(
			payloadWith('secret-state', 'other-state1'),
			'secret-state',
		);
		expect(result).toEqual({ valid: false, error: 'clientState mismatch' });
	});

	it('rejects a missing clientState', () => {
		const result = verifyTeamsClientState(
			payloadWith(undefined),
			'secret-state',
		);
		expect(result).toEqual({ valid: false, error: 'clientState mismatch' });
	});

	it('errors when the expected clientState is empty', () => {
		const result = verifyTeamsClientState(payloadWith('anything'), '');
		expect(result).toEqual({ valid: false, error: 'clientState is required' });
	});

	it('rejects an empty value array', () => {
		const result = verifyTeamsClientState({ value: [] }, 'secret-state');
		expect(result).toEqual({
			valid: false,
			error: 'Invalid payload: missing value array',
		});
	});

	it('rejects a null notification without throwing', () => {
		const malformed = {
			value: [null],
		} as unknown as TeamsWebhookPayload<TeamsNotification>;
		expect(() =>
			verifyTeamsClientState(malformed, 'secret-state'),
		).not.toThrow();
		expect(verifyTeamsClientState(malformed, 'secret-state')).toEqual({
			valid: false,
			error: 'clientState mismatch',
		});
	});
});
