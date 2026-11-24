import { moceanForm } from '../client';
import { endpoint, FORM } from './call';

/** Sends one SMS to up to 500 receivers; charged per destination. */
export const send = endpoint('smsSend', {
	event: 'sms.send',
	request: (p) => ({
		family: 'sms',
		method: 'POST',
		path: '/rest/2/sms',
		body: moceanForm({
			'mocean-from': p.mocean_from,
			'mocean-to': p.mocean_to,
			'mocean-text': p.mocean_text,
			'mocean-udh': p.mocean_udh,
			'mocean-coding': p.mocean_coding,
			'mocean-dlr-mask': p.mocean_dlr_mask,
			'mocean-dlr-url': p.mocean_dlr_url,
			'mocean-schedule': p.mocean_schedule,
			'mocean-mclass': p.mocean_mclass,
			'mocean-alt-dcs': p.mocean_alt_dcs,
			'mocean-charset': p.mocean_charset,
			'mocean-validity': p.mocean_validity,
		}),
		mediaType: FORM,
	}),
	log: (_, result) => ({
		receivers: result.messages.length,
		failed: result.messages.filter((m) => Number(m.status) !== 0).length,
	}),
});

/** Reads one message's final status by its msgid. */
export const status = endpoint('smsStatus', {
	event: 'sms.status',
	request: ({ mocean_msgid }) => ({
		family: 'query',
		method: 'GET',
		path: '/rest/2/report/message',
		query: { 'mocean-msgid': mocean_msgid, 'mocean-resp-format': 'json' },
	}),
	log: (_, result) => ({ messageStatus: result.message_status ?? undefined }),
});

/** Tells Mocean whether an SMS led to a conversion (delivered to the user). */
export const reportConversion = endpoint('smsReportConversion', {
	event: 'sms.reportConversion',
	request: (p) => ({
		family: 'sms',
		method: 'POST',
		path: '/rest/2/conversion',
		body: moceanForm({
			'mocean-msgid': p.mocean_msgid,
			'mocean-delivered': p.mocean_delivered,
			'mocean-timestamp': p.mocean_timestamp,
		}),
		mediaType: FORM,
	}),
});
