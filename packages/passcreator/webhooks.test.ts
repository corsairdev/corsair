import { createSign, generateKeyPairSync } from 'node:crypto';
import { event } from './webhooks';
import {
	matchPasscreatorWebhook,
	PasscreatorWebhookPayloadSchema,
	passcreatorWebhookToken,
	verifyPasscreatorSignature,
	verifyPasscreatorWebhookToken,
} from './webhooks/types';

// The docs' scheme: a hex ECDSA signature over signedData, checked with
// openssl_verify and SHA1 against the PEM public key from
// GET /api/hook/publickey. The test signs with a fresh keypair, so a wrong
// key or tampered data must fail.
const { publicKey, privateKey } = generateKeyPairSync('ec', {
	namedCurve: 'prime256v1',
});
const PUBLIC_KEY_PEM = publicKey
	.export({ type: 'spki', format: 'pem' })
	.toString();

const SIGNED = {
	passId: 'pass_1',
	identifier: 'pass_1',
	uniqueIdentifier: 'u1',
	passTemplate: 'Example',
	passTemplateGuid: 'tmpl_1',
	genericProperties: [],
};
const SIGNED_DATA = JSON.stringify(SIGNED);

function sign(data: string, algorithm = 'SHA1'): string {
	const signer = createSign(algorithm);
	signer.update(data);
	signer.end();
	return signer.sign(privateKey, 'hex');
}

// A documented delivery: the flat pass object plus the signature pair. There
// is no event field.
function delivery(
	// unknown: the delivery body mirrors the provider's pass object, whose
	// keys are template-defined.
	overrides: Record<string, unknown> = {},
) {
	return {
		...SIGNED,
		signedData: SIGNED_DATA,
		signature: sign(SIGNED_DATA),
		...overrides,
	};
}

// unknown: the handler reads fields the webhook fixture does not carry; the
// runtime key manager carries many more methods than this stub implements.
const ACCOUNT_API_KEY = 'pc-account-a';
const ACCOUNT_TOKEN = passcreatorWebhookToken(ACCOUNT_API_KEY);

function webhookContext(
	key: string | undefined,
	stored: string | null = null,
	apiKey: string | null = ACCOUNT_API_KEY,
) {
	return {
		key,
		options: {},
		keys: {
			get_webhook_signature: () => Promise.resolve(stored),
			get_api_key: () => Promise.resolve(apiKey),
		},
	} as never;
}

// The delivery URL query of a subscription made with webhooks.subscribe.
const OWN_QUERY = { corsair_token: ACCOUNT_TOKEN };

describe('verifyPasscreatorWebhookToken', () => {
	it("accepts this account's token", () => {
		expect(verifyPasscreatorWebhookToken(OWN_QUERY, ACCOUNT_API_KEY)).toEqual({
			valid: true,
		});
	});

	it("rejects another account's token", () => {
		const other = { corsair_token: passcreatorWebhookToken('pc-account-b') };
		expect(verifyPasscreatorWebhookToken(other, ACCOUNT_API_KEY).valid).toBe(
			false,
		);
	});

	it('rejects a URL without a token, and an account without a key', () => {
		expect(verifyPasscreatorWebhookToken({}, ACCOUNT_API_KEY).valid).toBe(
			false,
		);
		expect(verifyPasscreatorWebhookToken(OWN_QUERY, undefined).valid).toBe(
			false,
		);
	});

	it('gives every API key a different token that does not contain the key', () => {
		expect(passcreatorWebhookToken('k1')).not.toBe(
			passcreatorWebhookToken('k2'),
		);
		expect(ACCOUNT_TOKEN).not.toContain(ACCOUNT_API_KEY);
	});
});

describe('verifyPasscreatorSignature', () => {
	it('accepts a delivery signed with SHA1, as the docs verify it', () => {
		expect(verifyPasscreatorSignature(delivery(), PUBLIC_KEY_PEM)).toEqual({
			valid: true,
		});
	});

	it('also accepts a SHA256 signature', () => {
		expect(
			verifyPasscreatorSignature(
				delivery({ signature: sign(SIGNED_DATA, 'SHA256') }),
				PUBLIC_KEY_PEM,
			).valid,
		).toBe(true);
	});

	it('rejects a signature from another key', () => {
		const other = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
		const signer = createSign('SHA1');
		signer.update(SIGNED_DATA);
		signer.end();
		const wrongSignature = signer.sign(other.privateKey, 'hex');
		expect(
			verifyPasscreatorSignature(
				delivery({ signature: wrongSignature }),
				PUBLIC_KEY_PEM,
			).valid,
		).toBe(false);
	});

	it('rejects tampered signedData', () => {
		expect(
			verifyPasscreatorSignature(
				delivery({ signedData: SIGNED_DATA.slice(0, -2) }),
				PUBLIC_KEY_PEM,
			).valid,
		).toBe(false);
	});

	it('rejects a delivery without a signature pair', () => {
		const result = verifyPasscreatorSignature(SIGNED, PUBLIC_KEY_PEM);
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
	it('matches a flat pass delivery by its signature pair', () => {
		expect(
			matchPasscreatorWebhook({ headers: {}, body: delivery() } as never),
		).toBe(true);
	});

	it('leaves { event } bodies of other providers (Stannp) alone', () => {
		expect(
			matchPasscreatorWebhook({
				headers: {},
				body: { event: 'mailpiece_status', data: {} },
			} as never),
		).toBe(false);
		expect(
			matchPasscreatorWebhook({ headers: {}, body: [delivery()] } as never),
		).toBe(false);
	});
});

describe('PasscreatorWebhookPayloadSchema', () => {
	it('parses a flat delivery without an event field', () => {
		const parsed = PasscreatorWebhookPayloadSchema.parse(delivery());
		expect(parsed.identifier).toBe('pass_1');
		expect(parsed.signedData).toBe(SIGNED_DATA);
	});

	it('rejects a delivery without the signature pair', () => {
		expect(() => PasscreatorWebhookPayloadSchema.parse(SIGNED)).toThrow();
	});
});

describe('passcreator.event handler', () => {
	it('returns a 401 refusal when the signature does not verify', async () => {
		const result = await event.handler(webhookContext(PUBLIC_KEY_PEM), {
			payload: delivery({ signature: '00'.repeat(32) }),
			query: OWN_QUERY,
		} as never);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('returns a 401 refusal when no key is configured', async () => {
		const result = await event.handler(webhookContext(undefined), {
			payload: delivery(),
			query: OWN_QUERY,
		} as never);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('verifies with the key the keyBuilder resolved (ctx.key), not a second storage read', async () => {
		const result = await event.handler(webhookContext(PUBLIC_KEY_PEM, null), {
			payload: delivery(),
			query: OWN_QUERY,
		} as never);
		expect(result.success).toBe(true);
	});

	it('returns the verified signedData, not the outer fields', async () => {
		const result = await event.handler(webhookContext(PUBLIC_KEY_PEM), {
			payload: delivery({ identifier: 'forged', passTemplateGuid: 'other' }),
			query: OWN_QUERY,
		} as never);
		expect(result.success).toBe(true);
		// unknown: the handler's data field is the parsed signed pass data.
		const data = (result as { data?: Record<string, unknown> }).data;
		expect(data?.['identifier']).toBe('pass_1');
		expect(data?.['passTemplateGuid']).toBe('tmpl_1');
	});

	it('returns a 400 refusal when signedData is not JSON', async () => {
		const result = await event.handler(webhookContext(PUBLIC_KEY_PEM), {
			payload: delivery({
				signedData: 'not-json',
				signature: sign('not-json'),
			}),
			query: OWN_QUERY,
		} as never);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});
});

describe('passcreator.event handler: per-account delivery token', () => {
	it("refuses a genuine delivery posted to another account's URL", async () => {
		// Correctly signed by Passcreator, but the URL token was minted for a
		// different account than the one handling it.
		const result = await event.handler(webhookContext(PUBLIC_KEY_PEM), {
			payload: delivery(),
			query: { corsair_token: passcreatorWebhookToken('pc-account-b') },
		} as never);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('refuses a delivery whose URL has no token', async () => {
		const result = await event.handler(webhookContext(PUBLIC_KEY_PEM), {
			payload: delivery(),
		} as never);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('checks the token even when the Hub verified the signature', async () => {
		const result = await event.handler(webhookContext(PUBLIC_KEY_PEM), {
			payload: delivery(),
			query: {},
			hubVerified: true,
		} as never);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('refuses when the account has no API key to check against', async () => {
		const result = await event.handler(
			webhookContext(PUBLIC_KEY_PEM, null, null),
			{ payload: delivery(), query: OWN_QUERY } as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});
});
