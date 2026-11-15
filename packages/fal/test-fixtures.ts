import crypto from 'node:crypto';
import type { FalJwk } from './webhooks/types';

export const REQUEST_ID = '01a1b266-5b01-74f3-9ff7-03a43d7a2cc5';
export const USER_ID = 'github|test-user';

/** A completed-request webhook body as fal sends it. */
export const completedBody = {
	error: null,
	gateway_request_id: REQUEST_ID,
	payload: {
		images: [
			{
				content_type: 'image/jpeg',
				height: 512,
				url: 'https://v3b.fal.media/files/b/0ab16b11/lighthouse.jpg',
				width: 512,
			},
		],
		seed: 35683856,
	},
	request_id: REQUEST_ID,
	status: 'OK',
};

function jwkOf(publicKey: crypto.KeyObject, kid: string): FalJwk {
	const raw = publicKey.export({ format: 'der', type: 'spki' }).subarray(12);
	// fal publishes x as padded base64.
	return { kty: 'OKP', crv: 'Ed25519', kid, x: raw.toString('base64') };
}

/**
 * A key pair standing in for fal's: `jwks` holds the public half next to an
 * unrelated key, and `sign` signs a body the way fal does.
 */
export function createFalSigner() {
	const signer = crypto.generateKeyPairSync('ed25519');
	const other = crypto.generateKeyPairSync('ed25519');
	const jwks: FalJwk[] = [
		jwkOf(other.publicKey, 'old'),
		jwkOf(signer.publicKey, 'current'),
	];

	function sign(
		options: {
			// unknown: any JSON body to sign.
			body?: unknown;
			rawBody?: string;
			timestampSeconds?: number;
			privateKey?: crypto.KeyObject;
		} = {},
	) {
		// fal sends Python-style JSON (", " and ": "); the hash covers those bytes.
		const rawBody =
			options.rawBody ??
			JSON.stringify(options.body ?? completedBody)
				.replace(/,"/g, ', "')
				.replace(/":/g, '": ');
		const timestamp = String(
			options.timestampSeconds ?? Math.floor(Date.now() / 1000),
		);
		const hash = crypto.createHash('sha256').update(rawBody).digest('hex');
		const signature = crypto
			.sign(
				null,
				Buffer.from([REQUEST_ID, USER_ID, timestamp, hash].join('\n')),
				options.privateKey ?? signer.privateKey,
			)
			.toString('hex');
		const headers: Record<string, string> = {
			'content-type': 'application/json',
			'x-fal-webhook-request-id': REQUEST_ID,
			'x-fal-webhook-user-id': USER_ID,
			'x-fal-webhook-timestamp': timestamp,
			'x-fal-webhook-signature': signature,
		};
		return {
			headers,
			rawBody,
			// unknown: the signed body parsed back, any JSON object.
			body: JSON.parse(rawBody) as Record<string, unknown>,
		};
	}

	return { jwks, sign };
}
