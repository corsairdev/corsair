import crypto from 'node:crypto';
import { buildSignedString, signRequest } from './signing';

const rsa = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const rsaPem = rsa.privateKey
	.export({ type: 'pkcs8', format: 'pem' })
	.toString();

const ed = crypto.generateKeyPairSync('ed25519');
const edPem = ed.privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();

describe('buildSignedString', () => {
	it('joins timestamp, method and path in that order', () => {
		expect(
			buildSignedString(
				'1731330000000',
				'GET',
				'/trade-api/v2/portfolio/balance',
			),
		).toBe('1731330000000GET/trade-api/v2/portfolio/balance');
	});

	it('drops the query string before signing', () => {
		expect(
			buildSignedString(
				'1731330000000',
				'GET',
				'/trade-api/v2/portfolio/orders?limit=5&status=resting',
			),
		).toBe('1731330000000GET/trade-api/v2/portfolio/orders');
	});

	it('keeps the method as given so POST and DELETE sign differently', () => {
		const path = '/trade-api/v2/portfolio/events/orders';
		expect(buildSignedString('1', 'POST', path)).not.toBe(
			buildSignedString('1', 'DELETE', path),
		);
	});
});

describe('signRequest', () => {
	const message = '1731330000000GET/trade-api/v2/portfolio/balance';

	it('signs RSA keys with RSA-PSS, SHA-256 and digest-length salt', () => {
		const signature = signRequest(message, rsaPem);

		const valid = crypto.verify(
			'sha256',
			Buffer.from(message),
			{
				key: rsa.publicKey,
				padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
				saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
			},
			Buffer.from(signature, 'base64'),
		);
		expect(valid).toBe(true);
	});

	it('signs Ed25519 keys directly over the message', () => {
		const signature = signRequest(message, edPem);

		const valid = crypto.verify(
			null,
			Buffer.from(message),
			ed.publicKey,
			Buffer.from(signature, 'base64'),
		);
		expect(valid).toBe(true);
	});

	it('returns base64 text that is safe for an HTTP header', () => {
		expect(signRequest(message, rsaPem)).toMatch(/^[A-Za-z0-9+/]+=*$/);
	});

	it('does not verify against a different message', () => {
		const signature = signRequest(message, rsaPem);

		const valid = crypto.verify(
			'sha256',
			Buffer.from(`${message}x`),
			{
				key: rsa.publicKey,
				padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
				saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST,
			},
			Buffer.from(signature, 'base64'),
		);
		expect(valid).toBe(false);
	});

	it('throws on text that is not a private key', () => {
		expect(() => signRequest(message, 'not a pem')).toThrow();
	});
});
