import { moceanForm } from '../client';
import { endpoint, FORM } from './call';

/** Sends a verification code over SMS; charged per attempt. */
export const request = endpoint('verifyRequest', {
	event: 'verify.request',
	request: (p) => ({
		family: 'verify',
		method: 'POST',
		path: '/rest/2/verify/req/sms',
		body: moceanForm({
			'mocean-to': p.mocean_to,
			'mocean-brand': p.mocean_brand,
			'mocean-from': p.mocean_from,
			'mocean-code-length': p.mocean_code_length,
			'mocean-pin-validity': p.mocean_pin_validity,
		}),
		mediaType: FORM,
	}),
	log: (_, result) => ({ reqid: result.reqid ?? undefined }),
});

/** Sends a verification code to a Telegram chat through your bot. */
export const requestTelegram = endpoint('verifyRequestTelegram', {
	event: 'verify.requestTelegram',
	request: (p) => ({
		family: 'verify',
		method: 'POST',
		path: '/rest/2/verify/req/telegram',
		body: moceanForm({
			'mocean-to': p.mocean_to,
			'mocean-from': p.mocean_from,
			'mocean-brand': p.mocean_brand,
			'mocean-code-length': p.mocean_code_length,
			'mocean-pin-validity': p.mocean_pin_validity,
		}),
		mediaType: FORM,
	}),
	log: (_, result) => ({ reqid: result.reqid ?? undefined }),
});

/** Resends the code of an existing verify request over SMS. */
export const resend = endpoint('verifyResend', {
	event: 'verify.resend',
	request: ({ mocean_reqid }) => ({
		family: 'verify',
		method: 'POST',
		path: '/rest/2/verify/resend/sms',
		body: moceanForm({ 'mocean-reqid': mocean_reqid }),
		mediaType: FORM,
	}),
	log: (_, result) => ({ reqid: result.reqid ?? undefined }),
});

/** Checks the code a user gave you against a verify request. */
export const check = endpoint('verifyCheck', {
	event: 'verify.check',
	request: ({ mocean_reqid, mocean_code }) => ({
		family: 'verify',
		method: 'POST',
		path: '/rest/2/verify/check',
		body: moceanForm({
			'mocean-reqid': mocean_reqid,
			'mocean-code': mocean_code,
		}),
		mediaType: FORM,
	}),
	log: (_, result) => ({ reqid: result.reqid ?? undefined }),
});
