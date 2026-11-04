import { z } from 'zod';

export const SignatureImageContentTypeSchema = z.enum([
	'image/gif',
	'image/png',
	'image/jpeg',
	'image/bmp',
]);

export function base64ToBytes(imageBase64: string): Uint8Array {
	return Buffer.from(imageBase64, 'base64');
}

/**
 * Edit lock header DocuSign requires to release or extend an envelope or
 * template lock.
 * https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopelocks/
 */
export function lockHeaders(
	lockToken: string | undefined,
): Record<string, string> | undefined {
	return lockToken === undefined
		? undefined
		: { 'X-DocuSign-Edit': JSON.stringify({ LockToken: lockToken }) };
}
