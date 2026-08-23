import { createHash } from 'node:crypto';
import { AsticaAiAPIError } from '../client';

/**
 * Astica reports failures with HTTP 200 and `{status:'error', error:'…'}`, so a
 * bad key or exhausted quota never reaches the transport's error path. Raising
 * here is what lets the AUTH_ERROR and RATE_LIMIT_ERROR handlers see them.
 */
export function assertAsticaOk(response: {
	status?: string;
	error?: string;
}): void {
	if (response.status?.toLowerCase() === 'error') {
		throw new AsticaAiAPIError(
			response.error ?? 'Astica API returned an error',
		);
	}
}

/**
 * Digest of the whole input. Inputs are image or audio payloads, so they are
 * neither safe to store nor usable as a key: a base64 blob is megabytes long,
 * and truncating it collides because same-format payloads share a header
 * (every base64 JPEG opens `/9j/4AAQSkZJRgABAQ…`).
 */
export function inputFingerprint(input: string): string {
	return createHash('sha256').update(input).digest('hex');
}

/** Entity id for a call keyed on its input. */
export function inputEntityId(input: string): string {
	return inputFingerprint(input);
}

/**
 * Metadata safe to persist and to log. The input itself is withheld: inline
 * inputs are the image or the recording, and URL inputs can carry a signed
 * query string.
 */
export function describeInput(input: string): {
	inputKind: 'url' | 'inline';
	inputLength: number;
} {
	return {
		inputKind: /^https?:\/\//i.test(input) ? 'url' : 'inline',
		inputLength: input.length,
	};
}
