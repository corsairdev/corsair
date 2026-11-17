import { createHmac } from 'node:crypto';
import { verifySurveymonkeySignature } from './index';

const CLIENT_ID = 'client-id';
const CLIENT_SECRET = 'client-secret';
const PAYLOAD = JSON.stringify({
	event_type: 'response_completed',
	object_id: '1234',
});

/** The digest the vendor's recipe produces: base64 HMAC-SHA1 over the body. */
function sign(key: string): string {
	return createHmac('sha1', key).update(PAYLOAD, 'utf8').digest('base64');
}

describe('surveymonkey webhook signature', () => {
	it('accepts the documented client id ampersand secret key', () => {
		const signature = sign(`${CLIENT_ID}&${CLIENT_SECRET}`);

		expect(
			verifySurveymonkeySignature(PAYLOAD, signature, CLIENT_ID, CLIENT_SECRET),
		).toBe(true);
	});

	it('also accepts the pair in the other order', () => {
		// The vendor's own example builds the key as `api_key&api_secret` while
		// the prose says client id first, so both orders are tried.
		const signature = sign(`${CLIENT_SECRET}&${CLIENT_ID}`);

		expect(
			verifySurveymonkeySignature(PAYLOAD, signature, CLIENT_ID, CLIENT_SECRET),
		).toBe(true);
	});

	it('rejects a signature made with the wrong secret', () => {
		expect(
			verifySurveymonkeySignature(
				PAYLOAD,
				sign(`${CLIENT_ID}&wrong-secret`),
				CLIENT_ID,
				CLIENT_SECRET,
			),
		).toBe(false);
	});

	it('rejects a body that was changed after signing', () => {
		const signature = sign(`${CLIENT_ID}&${CLIENT_SECRET}`);

		expect(
			verifySurveymonkeySignature(
				`${PAYLOAD} `,
				signature,
				CLIENT_ID,
				CLIENT_SECRET,
			),
		).toBe(false);
	});

	it('rejects when any part is missing', () => {
		const signature = sign(`${CLIENT_ID}&${CLIENT_SECRET}`);

		expect(
			verifySurveymonkeySignature(PAYLOAD, undefined, CLIENT_ID, CLIENT_SECRET),
		).toBe(false);
		expect(
			verifySurveymonkeySignature(PAYLOAD, signature, undefined, CLIENT_SECRET),
		).toBe(false);
		expect(
			verifySurveymonkeySignature(PAYLOAD, signature, CLIENT_ID, undefined),
		).toBe(false);
	});

	it('rejects an empty or malformed signature without throwing', () => {
		expect(
			verifySurveymonkeySignature(PAYLOAD, '', CLIENT_ID, CLIENT_SECRET),
		).toBe(false);
		// A length mismatch must not reach timingSafeEqual, which throws on one.
		expect(
			verifySurveymonkeySignature(PAYLOAD, 'short', CLIENT_ID, CLIENT_SECRET),
		).toBe(false);
	});
});
