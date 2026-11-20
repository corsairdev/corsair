import { createSign, generateKeyPairSync } from 'node:crypto';
import { event } from './webhooks';
import {
	matchPasscreatorWebhook,
	PasscreatorWebhookPayloadSchema,
	verifyPasscreatorSignature,
} from './webhooks/types';

// The docs' scheme: hex SHA256 ECDSA over signedData with the PEM EC P-256
// public key from GET /api/hook/publickey. The test signs with a fresh
// keypair, so a wrong key or tampered data must fail.
const { publicKey, privateKey } = generateKeyPairSync('ec', {
	namedCurve: 'prime256v1',
});
const PUBLIC_KEY_PEM = publicKey
	.export({ type: 'spki', format: 'pem' })
	.toString();

const SIGNED_DATA = JSON.stringify({
	passId: 'pass_1',
	passTemplate: 'Example',
});

function sign(data: string): string {
	const signer = createSign('SHA256');
	signer.update(data);
	signer.end();
	return signer.sign(privateKey, 'hex');
}

function delivery(
	// unknown: the delivery body mirrors the provider's pass object, whose
	// keys are template-defined.
	overrides: Record<string, unknown> = {},
) {
	return {
		event: 'pass_created',
		pass: { passId: 'pass_1' },
		signedData: SIGNED_DATA,
		signature: sign(SIGNED_DATA),
		...overrides,
	};
}

// unknown: the handler reads fields the webhook fixture does not carry; the
// runtime key manager carries many more methods than this stub implements.
function webhookContext(publicKey: string | undefined) {
	return {
		key: publicKey,
		keys: { get_webhook_signature: () => Promise.resolve(publicKey ?? null) },
	} as never;
}

describe('verifyPasscreatorSignature', () => {
	it('accepts a delivery signed with the platform key', () => {
		expect(verifyPasscreatorSignature(delivery(), PUBLIC_KEY_PEM)).toEqual({
			valid: true,
		});
	});

	it('rejects a signature from another key', () => {
		const other = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
		const signer = createSign('SHA256');
		signer.update(SIGNED_DATA);
		signer.end();
		const wrongSignature = signer.sign(other.privateKey, 'hex');
		expect(
			verifyPasscreatorSignature(
				delivery({ signature: wrongSignature }),
				PUBLIC_KEY_PEM,
			),
		).toEqual({ valid: false });
	});

	it('rejects tampered signedData', () => {
		expect(
			verifyPasscreatorSignature(
				delivery({ signedData: SIGNED_DATA.slice(0, -2) }),
				PUBLIC_KEY_PEM,
			),
		).toEqual({ valid: false });
	});

	it('rejects a delivery without a signature pair', () => {
		const result = verifyPasscreatorSignature(
			{ event: 'pass_created', pass: {} },
			PUBLIC_KEY_PEM,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('signature/signedData');
	});

	it('rejects when no public key is available', () => {
		const result = verifyPasscreatorSignature(delivery(), undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toContain('webhooks.getPublicKey');
	});
});

describe('matchPasscreatorWebhook', () => {
	it('matches the documented event envelope', () => {
		expect(
			matchPasscreatorWebhook({ headers: {}, body: delivery() } as never),
		).toBe(true);
	});

	it('does not match bodies without an event string', () => {
		expect(
			matchPasscreatorWebhook({ headers: {}, body: { pass: {} } } as never),
		).toBe(false);
		expect(
			matchPasscreatorWebhook({ headers: {}, body: [delivery()] } as never),
		).toBe(false);
	});
});

describe('PasscreatorWebhookPayloadSchema', () => {
	it('parses a delivery', () => {
		const parsed = PasscreatorWebhookPayloadSchema.parse(delivery());
		expect(parsed.event).toBe('pass_created');
		expect(parsed.signedData).toBe(SIGNED_DATA);
	});

	it('rejects a delivery without an event', () => {
		expect(() => PasscreatorWebhookPayloadSchema.parse({ pass: {} })).toThrow();
	});
});

describe('passcreator.event handler', () => {
	it('returns a 401 refusal when the signature does not verify', async () => {
		const result = await event.handler(webhookContext(PUBLIC_KEY_PEM), {
			payload: delivery({ signature: '00'.repeat(32) }),
			rawBody: undefined,
		} as never);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 401 refusal when no public key is stored', async () => {
		const result = await event.handler(webhookContext(undefined), {
			payload: delivery(),
		} as never);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 400 refusal for a signed body the payload schema rejects', async () => {
		// The signature verifies (the pair is well-formed and signed), but the
		// delivery carries no event string, so the payload schema rejects it.
		const body = { signedData: SIGNED_DATA, signature: sign(SIGNED_DATA) };
		const result = await event.handler(webhookContext(PUBLIC_KEY_PEM), {
			payload: body,
		} as never);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('returns the parsed event for a verified delivery', async () => {
		const result = await event.handler(webhookContext(PUBLIC_KEY_PEM), {
			payload: delivery(),
		} as never);
		expect(result.success).toBe(true);
		// unknown: the handler's data field is the parsed event object.
		const data = (result as { data?: { event?: string } }).data;
		expect(data?.event).toBe('pass_created');
	});
});
