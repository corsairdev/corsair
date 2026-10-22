import { redactSensitive } from './redact';

describe('redactSensitive', () => {
	it('replaces credential fields before they reach the event log', () => {
		const payload = redactSensitive({
			user: {
				email: 'admin@example.com',
				password: 'hunter2',
				new_password: 'hunter3',
			},
			payment_token: 'tok_live_123',
			api_key: 'df_live_abc',
			client_secret: 'shhh',
		});

		expect(payload).toEqual({
			user: {
				email: 'admin@example.com',
				password: '[redacted]',
				new_password: '[redacted]',
			},
			payment_token: '[redacted]',
			api_key: '[redacted]',
			client_secret: '[redacted]',
		});
	});

	it('keeps non-sensitive values and redacts inside arrays', () => {
		const payload = redactSensitive({
			networks: [{ name: 'HQ', token: 'abc' }, { name: 'Branch' }],
			page: { number: 1, size: 25 },
			protected: false,
		});

		expect(payload).toEqual({
			networks: [{ name: 'HQ', token: '[redacted]' }, { name: 'Branch' }],
			page: { number: 1, size: 25 },
			protected: false,
		});
	});

	it('serialises dates so the event table can store them', () => {
		const payload = redactSensitive({
			from: new Date('2026-01-02T03:04:05.000Z'),
		});

		expect(payload).toEqual({ from: '2026-01-02T03:04:05.000Z' });
	});

	it('returns an object for non-object inputs', () => {
		expect(redactSensitive(undefined)).toEqual({});
		expect(redactSensitive('api_key=abc')).toEqual({});
	});
});
