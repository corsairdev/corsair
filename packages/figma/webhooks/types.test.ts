import { verifyFigmaWebhookPasscode } from './types';

// Regression for #685: verifyFigmaWebhookPasscode never checked the configured
// passcode before timingSafeEqual, so an empty passcode fell into the
// length-mismatch catch and surfaced as a vague 'Invalid passcode'. The verifier
// now fails closed with a clear configuration error.

// type: unknown is used to simulate arbitrary payload shapes for testing
function requestWith(payload: unknown) {
	return { payload, headers: {} };
}

describe('verifyFigmaWebhookPasscode', () => {
	const passcode = 'figma-webhook-passcode';

	it('fails closed when the configured passcode is empty', () => {
		const result = verifyFigmaWebhookPasscode(
			requestWith({ event_type: 'PING', passcode }),
			'',
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook passcode' });
	});

	it('fails closed when the configured passcode is missing', () => {
		const result = verifyFigmaWebhookPasscode(
			requestWith({ event_type: 'PING', passcode }),
			// type assertion: passing undefined to test runtime missing passcode guard
			undefined as unknown as string,
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook passcode' });
	});

	it('accepts a matching payload passcode', () => {
		const result = verifyFigmaWebhookPasscode(
			requestWith({ event_type: 'PING', passcode }),
			passcode,
		);
		expect(result).toEqual({ valid: true, error: undefined });
	});

	it('accepts a matching payload passcode when the payload is a JSON string', () => {
		const result = verifyFigmaWebhookPasscode(
			requestWith(JSON.stringify({ event_type: 'PING', passcode })),
			passcode,
		);
		expect(result).toEqual({ valid: true, error: undefined });
	});

	it('rejects a mismatched payload passcode of equal length', () => {
		const result = verifyFigmaWebhookPasscode(
			requestWith({ event_type: 'PING', passcode: 'figma-webhook-passcodX' }),
			passcode,
		);
		expect(result).toEqual({ valid: false, error: 'Invalid passcode' });
	});

	it('rejects a mismatched payload passcode of a different length', () => {
		const result = verifyFigmaWebhookPasscode(
			requestWith({ event_type: 'PING', passcode: 'short' }),
			passcode,
		);
		expect(result).toEqual({ valid: false, error: 'Invalid passcode' });
	});

	it('rejects a payload without a passcode', () => {
		const result = verifyFigmaWebhookPasscode(
			requestWith({ event_type: 'PING' }),
			passcode,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing passcode in payload',
		});
	});
});
