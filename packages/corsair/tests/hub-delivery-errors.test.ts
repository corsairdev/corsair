import {
	describeDeliveryNetworkError,
	formatServerDeliveryError,
} from '../hub/signing/envelope';

describe('describeDeliveryNetworkError', () => {
	it('explains connection refused without environment-specific hints', () => {
		const error = Object.assign(new TypeError('fetch failed'), {
			cause: Object.assign(new Error('connect ECONNREFUSED'), {
				code: 'ECONNREFUSED',
			}),
		});

		const message = describeDeliveryNetworkError(
			'http://localhost:3001/api/corsair',
			error,
		);

		expect(message).toContain(
			'Could not reach http://localhost:3001/api/corsair',
		);
		expect(message).toContain('connection refused');
		expect(message).not.toContain('Hub API server makes this request');
	});
});

describe('formatServerDeliveryError', () => {
	it('returns preformatted network errors from deliverSignedEnvelope', () => {
		const formatted = formatServerDeliveryError({
			deliveryUrl: 'http://localhost:3001/api/corsair',
			status: 0,
			body: describeDeliveryNetworkError(
				'http://localhost:3001/api/corsair',
				Object.assign(new Error('fetch failed'), {
					cause: { code: 'ECONNREFUSED' },
				}),
			),
			ack: {},
		});

		expect(formatted).toContain('connection refused');
	});

	it('formats app-side auth failures', () => {
		const formatted = formatServerDeliveryError({
			deliveryUrl: 'https://app.example.com/api/corsair',
			status: 401,
			body: '{"error":"Invalid tunnel signature"}',
			ack: { error: 'Invalid tunnel signature' },
		});

		expect(formatted).toContain('Invalid tunnel signature');
		expect(formatted).toContain('HTTP 401');
	});

	it('formats missing delivery route', () => {
		const formatted = formatServerDeliveryError({
			deliveryUrl: 'https://app.example.com/api/corsair',
			status: 404,
			body: 'Not Found',
			ack: {},
		});

		expect(formatted).toContain('HTTP 404');
		expect(formatted).toContain('Check the delivery URL configured');
	});
});
