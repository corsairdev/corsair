import type { BinaryResponse } from 'corsair/http';
import { toFileOutput } from 'corsair/http';
import { moceanForm } from '../client';
import { endpoint, FORM } from './call';

/** Calls one or more numbers and runs the given Mocean Command flow. */
export const dial = endpoint('voiceDial', {
	event: 'voice.dial',
	request: (p) => ({
		family: 'voice',
		method: 'POST',
		path: '/rest/2/voice/dial',
		body: moceanForm({
			'mocean-to': p.mocean_to,
			'mocean-from': p.mocean_from,
			'mocean-event-url': p.mocean_event_url,
			// Mocean takes the command array as one JSON string field.
			'mocean-command': JSON.stringify(p.mocean_command),
		}),
		mediaType: FORM,
	}),
	log: (_, result) => ({ calls: result.calls?.length ?? 0 }),
});

/** Hangs up a call in progress. */
export const hangup = endpoint('voiceHangup', {
	event: 'voice.hangup',
	request: ({ mocean_call_uuid }) => ({
		family: 'voice',
		method: 'POST',
		path: '/rest/2/voice/hangup',
		body: moceanForm({ 'mocean-call-uuid': mocean_call_uuid }),
		mediaType: FORM,
	}),
});

/** Downloads a call recording (audio). */
export const recording = endpoint('voiceRecording', {
	event: 'voice.recording',
	request: ({ mocean_call_uuid }) => ({
		family: 'voice',
		method: 'GET',
		path: '/rest/2/voice/rec',
		query: { 'mocean-call-uuid': mocean_call_uuid },
		responseType: 'binary',
	}),
	shape: (raw) => {
		const { bytes, contentType } = raw as BinaryResponse;
		return toFileOutput(bytes, contentType, { filename: 'recording.mp3' });
	},
	log: (_, result) => ({ bytes: result.byteLength }),
});
