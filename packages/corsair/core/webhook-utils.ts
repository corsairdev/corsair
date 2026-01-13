import * as crypto from 'crypto';

export function verifyHmacSignature(
	payload: string | Buffer,
	secret: string,
	signature: string,
	algorithm: 'sha256' | 'sha1' = 'sha256',
): boolean {
	if (!signature || !secret) {
		return false;
	}

	const expectedSignature = crypto
		.createHmac(algorithm, secret)
		.update(payload)
		.digest('hex');

	try {
		return crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
	} catch {
		return false;
	}
}

export function verifyHmacSignatureWithPrefix(
	payload: string | Buffer,
	secret: string,
	signature: string,
	prefix: string,
	algorithm: 'sha256' | 'sha1' = 'sha256',
): boolean {
	if (!signature || !secret) {
		return false;
	}

	if (!signature.startsWith(prefix)) {
		return false;
	}

	const signatureWithoutPrefix = signature.slice(prefix.length);
	const expectedSignature = crypto
		.createHmac(algorithm, secret)
		.update(payload)
		.digest('hex');

	try {
		return crypto.timingSafeEqual(
			Buffer.from(signatureWithoutPrefix),
			Buffer.from(expectedSignature),
		);
	} catch {
		return false;
	}
}

export function verifySlackSignature(
	payload: string,
	secret: string,
	timestamp: string,
	signature: string,
	maxAgeSeconds: number = 60 * 5,
): boolean {
	if (!secret) {
		return true;
	}

	if (!signature || !timestamp) {
		return false;
	}

	const currentTime = Math.floor(Date.now() / 1000);
	const requestTime = parseInt(timestamp, 10);

	if (Math.abs(currentTime - requestTime) > maxAgeSeconds) {
		return false;
	}

	const sigBasestring = `v0:${timestamp}:${payload}`;
	const expectedSignature =
		'v0=' +
		crypto.createHmac('sha256', secret).update(sigBasestring).digest('hex');

	try {
		return crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);
	} catch {
		return false;
	}
}

