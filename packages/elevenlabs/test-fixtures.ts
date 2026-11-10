import crypto from 'node:crypto';

export const WEBHOOK_SECRET = 'wsec_test_secret';

/** Bodies with the field shapes seen in real deliveries (11-08), shortened. */
export const transcriptionEvent = {
	type: 'speech_to_text_transcription',
	event_timestamp: 1794129900,
	data: {
		request_id: 'b851fba8aced464fbfda280d1e8b22da',
		webhook_metadata: { source: 'test' },
		character_cost: 2,
		audio_duration_secs: 1.25,
		transcription: {
			language_code: 'eng',
			language_probability: 0.98,
			text: 'Hello from Corsair',
			words: [{ text: 'Hello', start: 0, end: 0.4, type: 'word' }],
			transcription_id: 'FLj4GMFolj4niC0Lkyym',
		},
	},
};

export const transcriptionFailedEvent = {
	type: 'webhook_error',
	event_timestamp: 1794129901,
	request_id: 'b851fba8aced464fbfda280d1e8b22da',
	error_message: 'Could not read the file',
	webhook_metadata: null,
};

export const postCallTranscriptionEvent = {
	type: 'post_call_transcription',
	event_timestamp: 1794129902,
	data: {
		agent_id: 'agent_abc',
		agent_name: 'Test',
		conversation_id: 'conv_abc',
		status: 'done',
		transcript: [{ role: 'agent', message: 'Hi.' }],
		metadata: { call_duration_secs: 4 },
		analysis: { call_successful: 'success' },
		has_audio: true,
	},
};

export const postCallAudioEvent = {
	type: 'post_call_audio',
	event_timestamp: 1794129903,
	data: {
		agent_id: 'agent_abc',
		conversation_id: 'conv_abc',
		full_audio: 'SUQzBA==',
	},
};

export const callInitiationFailureEvent = {
	type: 'call_initiation_failure',
	event_timestamp: 1794129904,
	data: {
		agent_id: 'agent_abc',
		conversation_id: 'conv_abc',
		failure_reason: 'busy',
		metadata: { type: 'twilio', body: { CallSid: 'CA1' } },
	},
};

export const voiceRemovalNoticeEvent = {
	type: 'voice_removal_notice',
	event_timestamp: 1794129905,
	data: { voice_id: 'voice_abc' },
};

export const voiceRemovalNoticeWithdrawnEvent = {
	type: 'voice_removal_notice_withdrawn',
	event_timestamp: 1794129906,
	data: { voice_id: 'voice_abc' },
};

export const voiceRemovedEvent = {
	type: 'voice_removed',
	event_timestamp: 1794129907,
	data: { voice_id: 'voice_abc' },
};

/** Signs a body the way ElevenLabs does, as Python-style JSON unless told otherwise. */
export function signDelivery(
	options: {
		// unknown: any JSON body to sign.
		body?: unknown;
		rawBody?: string;
		secret?: string;
		timestampSeconds?: number;
	} = {},
) {
	const rawBody =
		options.rawBody ??
		JSON.stringify(options.body ?? transcriptionEvent)
			.replace(/,"/g, ', "')
			.replace(/":/g, '": ');
	const timestamp = options.timestampSeconds ?? Math.floor(Date.now() / 1000);
	const hex = crypto
		.createHmac('sha256', options.secret ?? WEBHOOK_SECRET)
		.update(`${timestamp}.${rawBody}`)
		.digest('hex');
	return {
		rawBody,
		headers: {
			'content-type': 'application/json',
			'elevenlabs-signature': `t=${timestamp},v0=${hex}`,
		} as Record<string, string>,
		// unknown: the signed body parsed back, any JSON object.
		payload: JSON.parse(rawBody) as Record<string, unknown>,
	};
}
