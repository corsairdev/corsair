import {
	signDeliveryEnvelope,
	verifySignedTunnelDelivery,
} from '../hub/signing/envelope';

// A missing signing secret is a config mistake (empty hub.signingSecret), not a
// programming bug — it must surface as a clear, actionable message pointing at
// the config field (never an env-var guess, never a raw
// `Cannot read properties of undefined (reading 'trim')` crash).
describe('signing secret misconfiguration → clear error, not a crash', () => {
	it('signDeliveryEnvelope throws an actionable error naming hub.signingSecret', () => {
		expect(() =>
			signDeliveryEnvelope({
				projectId: 'proj_test',
				signingSecret: undefined as unknown as string,
				type: 'credentials.migrate',
				payload: { integrations: [] },
			}),
		).toThrow(/hub\.signingSecret/);
	});

	it('verifySignedTunnelDelivery returns a clear error (no crash) when the secret is missing', () => {
		const result = verifySignedTunnelDelivery({
			body: '{}',
			signatureHeader: 'sha256=deadbeef',
			timestampHeader: String(Math.floor(Date.now() / 1000)),
			signingSecret: undefined as unknown as string,
		});
		expect(result.ok).toBe(false);
		expect(result.ok === false && result.error).toMatch(/hub\.signingSecret/);
	});
});
