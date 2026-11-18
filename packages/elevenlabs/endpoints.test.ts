import { HARD_MAX_CONTENT_BYTES } from './client';
import {
	Account,
	Agents,
	AudioIsolation,
	Dubbing,
	ForcedAlignment,
	History,
	Models,
	Music,
	SingleUseTokens,
	SoundEffects,
	SpeechToText,
	TextToDialogue,
	TextToSpeech,
	VoiceChanger,
	VoiceDesign,
	Voices,
} from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const KEY = 'sk_test_key_123';
// unknown: endpoints read only ctx.key; the rest of the context is the runtime's.
const ctx = { key: KEY } as unknown as Parameters<typeof Voices.get>[0];

const FILE = {
	fileBase64: 'YWJj',
	fileName: 'a.mp3',
	contentType: 'audio/mpeg',
};

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	jest.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

// unknown: response bodies are arbitrary JSON.
const answerJson = (body: unknown, headers: Record<string, string> = {}) =>
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status: 200,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);

const answerBytes = (headers: Record<string, string> = {}) =>
	fetchMock.mockResolvedValueOnce(
		new Response(new Uint8Array([97, 98, 99]), {
			status: 200,
			headers: { 'Content-Type': 'audio/mpeg', ...headers },
		}),
	);

const SPEECH_HEADERS = {
	'request-id': 'req_1',
	'x-trace-id': 'trace_1',
	'character-cost': '4',
	'history-item-id': 'hist_1',
};

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url: new URL(url),
		method: init.method,
		json:
			typeof init.body === 'string'
				? // unknown: the body the endpoint built, checked field by field.
					(JSON.parse(init.body) as Record<string, unknown>)
				: undefined,
		form: init.body instanceof FormData ? init.body : undefined,
	};
}

describe('textToSpeech', () => {
	it('convert posts the text and returns the audio with its headers', async () => {
		answerBytes(SPEECH_HEADERS);
		const result = await TextToSpeech.convert(ctx, {
			voiceId: 'voice/1',
			text: 'Hello',
			modelId: 'eleven_flash_v2_5',
			outputFormat: 'mp3_22050_32',
			voiceSettings: { stability: 0.4 },
			previousText: 'Before',
			enableLogging: true,
		});
		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.url.pathname).toBe('/v1/text-to-speech/voice%2F1');
		expect(call.url.searchParams.get('output_format')).toBe('mp3_22050_32');
		expect(call.url.searchParams.get('enable_logging')).toBe('true');
		expect(call.json).toMatchObject({
			text: 'Hello',
			model_id: 'eleven_flash_v2_5',
			voice_settings: { stability: 0.4 },
			previous_text: 'Before',
		});
		expect(result).toMatchObject({
			contentBase64: 'YWJj',
			contentType: 'audio/mpeg',
			byteLength: 3,
			requestId: 'req_1',
			traceId: 'trace_1',
			characterCost: 4,
			historyItemId: 'hist_1',
		});
	});

	it('convert keeps the audio out of the result when asked', async () => {
		answerBytes(SPEECH_HEADERS);
		const result = await TextToSpeech.convert(ctx, {
			voiceId: 'v',
			text: 'Hello',
			includeContent: false,
		});
		expect(result.contentBase64).toBeUndefined();
		expect(result.contentOmitted).toBe('not_requested');
		expect(result.historyItemId).toBe('hist_1');
		expect(result.note).toContain('history.getAudio');
	});

	it('convert refuses bad input before spending anything', async () => {
		await expect(
			// @ts-expect-error text is required
			TextToSpeech.convert(ctx, { voiceId: 'v' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('convertWithTimestamps moves the audio into the common fields', async () => {
		answerJson(
			{
				audio_base64: 'YWJj',
				alignment: {
					characters: ['H', 'i'],
					character_start_times_seconds: [0, 0.1],
					character_end_times_seconds: [0.1, 0.2],
				},
				normalized_alignment: null,
			},
			SPEECH_HEADERS,
		);
		const result = await TextToSpeech.convertWithTimestamps(ctx, {
			voiceId: 'v',
			text: 'Hi',
		});
		expect(lastCall().url.pathname).toBe(
			'/v1/text-to-speech/v/with-timestamps',
		);
		expect(result).toMatchObject({
			contentBase64: 'YWJj',
			contentType: 'audio/mpeg',
			byteLength: 3,
			historyItemId: 'hist_1',
		});
		expect(result.alignment?.characters).toEqual(['H', 'i']);
		expect('audio_base64' in result).toBe(false);
	});

	it('convertWithTimestamps applies the limit like convert', async () => {
		answerJson({ audio_base64: 'YWJj' }, SPEECH_HEADERS);
		const result = await TextToSpeech.convertWithTimestamps(ctx, {
			voiceId: 'v',
			text: 'Hi',
			maxBytes: 1,
		});
		expect(result.contentBase64).toBeUndefined();
		expect(result.contentOmitted).toBe('over_limit');
	});

	it.each([
		['missing', {}],
		['not a string', { audio_base64: 123 }],
		['empty', { audio_base64: '' }],
	])(
		'convertWithTimestamps raises when the audio is %s, and says it may have billed',
		async (_case, body) => {
			answerJson(body, SPEECH_HEADERS);
			await expect(
				TextToSpeech.convertWithTimestamps(ctx, { voiceId: 'v', text: 'Hi' }),
			).rejects.toThrow(/no audio_base64\. It may have been billed/);
		},
	);

	it('convertWithTimestamps over the hard cap with no history item says it can’t be fetched again', async () => {
		answerJson({
			audio_base64: 'A'.repeat(Math.ceil((HARD_MAX_CONTENT_BYTES * 4) / 3) + 8),
		});
		const result = await TextToSpeech.convertWithTimestamps(ctx, {
			voiceId: 'v',
			text: 'Hi',
			maxBytes: HARD_MAX_CONTENT_BYTES,
		});
		expect(result.contentBase64).toBeUndefined();
		expect(result.contentOmitted).toBe('over_limit');
		expect(result.note).toMatch(/can't be fetched again/);
	});

	it('convertWithTimestamps over the limit names the history item', async () => {
		answerJson({ audio_base64: 'YWJj' }, SPEECH_HEADERS);
		const result = await TextToSpeech.convertWithTimestamps(ctx, {
			voiceId: 'v',
			text: 'Hi',
			maxBytes: 1,
		});
		expect(result.note).toContain(
			"history.getAudio({ historyItemId: 'hist_1', maxBytes: 3 })",
		);
	});

	it('convertWithTimestamps keeps audio with no history item', async () => {
		answerJson({ audio_base64: 'YWJj' });
		const result = await TextToSpeech.convertWithTimestamps(ctx, {
			voiceId: 'v',
			text: 'Hi',
			includeContent: false,
		});
		expect(result.contentBase64).toBe('YWJj');
	});
});

describe('textToDialogue', () => {
	it('convert sends each line with its voice', async () => {
		answerBytes(SPEECH_HEADERS);
		const result = await TextToDialogue.convert(ctx, {
			inputs: [
				{ text: 'Hi', voiceId: 'a' },
				{ text: 'Hey', voiceId: 'b' },
			],
			futureText: 'After',
		});
		const call = lastCall();
		expect(call.url.pathname).toBe('/v1/text-to-dialogue');
		expect(call.json).toMatchObject({
			inputs: [
				{ text: 'Hi', voice_id: 'a' },
				{ text: 'Hey', voice_id: 'b' },
			],
			future_text: 'After',
		});
		expect(result.historyItemId).toBe('hist_1');
	});
});

describe('speechToText', () => {
	const transcript = {
		language_code: 'eng',
		language_probability: 0.9,
		text: 'Hello',
		words: [{ text: 'Hello', type: 'word', extra: 1 }],
		transcription_id: 'tr_1',
		new_field: true,
	};

	it('convert uploads a file with the default model', async () => {
		answerJson(transcript);
		const result = await SpeechToText.convert(ctx, {
			...FILE,
			diarize: true,
			keyterms: ['Corsair', 'hub'],
		});
		const { url, form } = lastCall();
		expect(url.pathname).toBe('/v1/speech-to-text');
		expect(form?.get('model_id')).toBe('scribe_v2');
		expect(form?.get('diarize')).toBe('true');
		expect(form?.getAll('keyterms')).toEqual(['Corsair', 'hub']);
		const file = form?.get('file') as File;
		expect(file.name).toBe('a.mp3');
		expect(await file.text()).toBe('abc');
		expect(result.text).toBe('Hello');
		expect(result.transcription_id).toBe('tr_1');
		expect(result.new_field).toBe(true);
	});

	it('convert takes a URL and async mode', async () => {
		answerJson({
			message: 'accepted',
			request_id: 'r1',
			transcription_id: 'tr_2',
		});
		const result = await SpeechToText.convert(ctx, {
			sourceUrl: 'https://example.com/a.mp3',
			webhook: true,
			webhookId: 'wh_1',
			webhookMetadata: { job: 7 },
		});
		const { form } = lastCall();
		expect(form?.get('source_url')).toBe('https://example.com/a.mp3');
		expect(form?.get('file')).toBeNull();
		expect(form?.get('webhook')).toBe('true');
		expect(form?.get('webhook_id')).toBe('wh_1');
		expect(form?.get('webhook_metadata')).toBe('{"job":7}');
		expect(result.request_id).toBe('r1');
	});

	it.each([[{}], [{ ...FILE, sourceUrl: 'https://example.com/a.mp3' }]])(
		'convert wants exactly one source',
		async (input) => {
			await expect(SpeechToText.convert(ctx, input)).rejects.toThrow(
				/exactly one/,
			);
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('getTranscript reads by id', async () => {
		answerJson(transcript);
		const result = await SpeechToText.getTranscript(ctx, {
			transcriptionId: 'tr_1',
		});
		expect(lastCall().url.pathname).toBe('/v1/speech-to-text/transcripts/tr_1');
		expect(result.text).toBe('Hello');
	});

	it('deleteTranscript deletes by id and takes an empty answer', async () => {
		fetchMock.mockResolvedValueOnce(new Response('', { status: 200 }));
		await expect(
			SpeechToText.deleteTranscript(ctx, { transcriptionId: 'tr_1' }),
		).resolves.toEqual({});
		expect(lastCall().method).toBe('DELETE');
	});
});

describe('forcedAlignment', () => {
	it('create sends the file and the text', async () => {
		answerJson({
			characters: [{ text: 'H', start: 0, end: 0.1 }],
			words: [{ text: 'Hi', start: 0, end: 0.2, loss: 0.1 }],
			loss: 0.2,
		});
		const result = await ForcedAlignment.create(ctx, { ...FILE, text: 'Hi' });
		const { url, form } = lastCall();
		expect(url.pathname).toBe('/v1/forced-alignment');
		expect(form?.get('text')).toBe('Hi');
		expect(form?.get('file')).toBeInstanceOf(File);
		expect(result.loss).toBe(0.2);
		expect(result.words?.[0]?.text).toBe('Hi');
	});

	it('refuses bad base64 before uploading', async () => {
		await expect(
			ForcedAlignment.create(ctx, { fileBase64: 'YWJjA', text: 'Hi' }),
		).rejects.toThrow(/not valid base64/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('soundEffects', () => {
	it('generate defaults to the current model', async () => {
		answerBytes({ 'character-cost': '3' });
		const result = await SoundEffects.generate(ctx, {
			text: 'a click',
			durationSeconds: 0.5,
		});
		const call = lastCall();
		expect(call.url.pathname).toBe('/v1/sound-generation');
		expect(call.json).toMatchObject({
			text: 'a click',
			duration_seconds: 0.5,
			model_id: 'eleven_text_to_sound_v3',
		});
		expect(result.contentBase64).toBe('YWJj');
		expect(result.characterCost).toBe(3);
		expect(result.historyItemId).toBeUndefined();
	});

	it('refuses a length the API refuses, before any request', async () => {
		fetchMock.mockRejectedValue(new Error('Unexpected fetch'));
		await expect(
			SoundEffects.generate(ctx, { text: 'x', durationSeconds: 31 }),
		).rejects.toThrow(/durationSeconds|expected number/i);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('music', () => {
	it('compose defaults to the current model and surfaces the song id', async () => {
		answerBytes({ 'song-id': 'song_1' });
		const result = await Music.compose(ctx, {
			prompt: 'piano',
			musicLengthMs: 3000,
			forceInstrumental: true,
		});
		const call = lastCall();
		expect(call.url.pathname).toBe('/v1/music');
		expect(call.json).toMatchObject({
			prompt: 'piano',
			music_length_ms: 3000,
			force_instrumental: true,
			model_id: 'music_v2_5',
		});
		expect(result.songId).toBe('song_1');
	});

	it('compose takes a plan instead of a prompt', async () => {
		answerBytes();
		await Music.compose(ctx, { compositionPlan: { chunks: [] } });
		expect(lastCall().json).toMatchObject({ composition_plan: { chunks: [] } });
	});

	it('compose refuses a length with a plan, at that field, before any request', async () => {
		const error = await Music.compose(ctx, {
			compositionPlan: { chunks: [] },
			musicLengthMs: 3000,
		}).catch((e) => e);
		expect(error.issues?.[0]?.path).toEqual(['musicLengthMs']);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('compose wants exactly one of prompt and plan', async () => {
		await expect(
			Music.compose(ctx, { prompt: 'x', compositionPlan: {} }),
		).rejects.toThrow(/exactly one/);
		await expect(Music.compose(ctx, {})).rejects.toThrow(/exactly one/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('plan defaults to the current model and keeps either plan shape', async () => {
		answerJson({ chunks: [{ text: 'a' }] });
		const result = await Music.plan(ctx, { prompt: 'piano' });
		expect(lastCall().json).toMatchObject({ model_id: 'music_v2_5' });
		expect(result.chunks).toHaveLength(1);

		answerJson({ sections: [{ section_name: 'a' }] });
		const older = await Music.plan(ctx, {
			prompt: 'piano',
			modelId: 'music_v2',
		});
		expect(older.sections).toHaveLength(1);
	});

	it('separateStems uploads the song and returns the zip', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([1]), {
				headers: { 'content-type': 'application/zip' },
			}),
		);
		const result = await Music.separateStems(ctx, {
			...FILE,
			stemVariationId: 'two_stems_v1',
			outputFormat: 'mp3_22050_32',
		});
		const { url, form } = lastCall();
		expect(url.pathname).toBe('/v1/music/stem-separation');
		expect(url.searchParams.get('output_format')).toBe('mp3_22050_32');
		expect(form?.get('stem_variation_id')).toBe('two_stems_v1');
		expect(result.contentType).toBe('application/zip');
		expect(result.contentBase64).toBe('AQ==');
	});
});

describe('audioIsolation', () => {
	it('isolate uploads the audio field', async () => {
		answerBytes({ 'character-cost': '41' });
		const result = await AudioIsolation.isolate(ctx, {
			...FILE,
			fileFormat: 'other',
		});
		const { url, form } = lastCall();
		expect(url.pathname).toBe('/v1/audio-isolation');
		expect(form?.get('audio')).toBeInstanceOf(File);
		expect(form?.get('file_format')).toBe('other');
		expect(result.characterCost).toBe(41);
	});
});

describe('voiceChanger', () => {
	it('convert uploads audio, JSON-encodes settings and keeps the history id', async () => {
		answerBytes(SPEECH_HEADERS);
		const result = await VoiceChanger.convert(ctx, {
			...FILE,
			voiceId: 'v',
			modelId: 'eleven_multilingual_sts_v2',
			voiceSettings: { stability: 0.5 },
			outputFormat: 'mp3_22050_32',
		});
		const { url, form } = lastCall();
		expect(url.pathname).toBe('/v1/voice-changer/v');
		expect(url.searchParams.get('output_format')).toBe('mp3_22050_32');
		expect(form?.get('model_id')).toBe('eleven_multilingual_sts_v2');
		expect(form?.get('voice_settings')).toBe('{"stability":0.5}');
		expect(result.historyItemId).toBe('hist_1');
	});
});

describe('voices', () => {
	const voice = {
		voice_id: 'v1',
		name: 'Laura',
		category: 'premade',
		labels: { accent: 'american' },
		brand_new_field: 1,
	};

	it('list pages with the v2 cursor', async () => {
		answerJson({
			voices: [voice],
			has_more: true,
			total_count: 9,
			next_page_token: 'next',
		});
		const result = await Voices.list(ctx, {
			pageSize: 1,
			nextPageToken: 'cur',
			search: 'Laura',
			voiceIds: ['v1', 'v2'],
		});
		const { url } = lastCall();
		expect(url.pathname).toBe('/v2/voices');
		expect(url.searchParams.get('next_page_token')).toBe('cur');
		expect(url.searchParams.get('page_size')).toBe('1');
		expect(url.searchParams.getAll('voice_ids')).toEqual(['v1', 'v2']);
		expect(result.next_page_token).toBe('next');
		expect(result.voices[0]?.brand_new_field).toBe(1);
	});

	it('list needs no input', async () => {
		answerJson({ voices: [] });
		await Voices.list(ctx, undefined as never);
		expect(lastCall().url.pathname).toBe('/v2/voices');
	});

	it('get reads one voice', async () => {
		answerJson(voice);
		await expect(Voices.get(ctx, { voiceId: 'v1' })).resolves.toMatchObject({
			name: 'Laura',
		});
		expect(lastCall().url.pathname).toBe('/v1/voices/v1');
	});

	it('searchLibrary pages by number', async () => {
		answerJson({
			voices: [{ voice_id: 'v2', public_owner_id: 'o1' }],
			has_more: false,
		});
		const result = await Voices.searchLibrary(ctx, {
			search: 'narrator',
			page: 2,
			pageSize: 5,
			useCases: ['news'],
		});
		const { url } = lastCall();
		expect(url.pathname).toBe('/v1/shared-voices');
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.getAll('use_cases')).toEqual(['news']);
		expect(result.voices[0]?.public_owner_id).toBe('o1');
	});

	it('addFromLibrary posts the new name', async () => {
		answerJson({ voice_id: 'v2' });
		await Voices.addFromLibrary(ctx, {
			publicUserId: 'o1',
			voiceId: 'v2',
			newName: 'Mine',
		});
		const call = lastCall();
		expect(call.url.pathname).toBe('/v1/voices/add/o1/v2');
		expect(call.json).toEqual({ new_name: 'Mine' });
	});

	it('edit sends a multipart form with JSON labels', async () => {
		answerJson({ status: 'ok' });
		await Voices.edit(ctx, {
			voiceId: 'v1',
			name: 'New',
			description: 'd',
			labels: { accent: 'british' },
		});
		const { url, form, method } = lastCall();
		expect(url.pathname).toBe('/v1/voices/v1/edit');
		expect(method).toBe('POST');
		expect(form?.get('name')).toBe('New');
		expect(form?.get('labels')).toBe('{"accent":"british"}');
	});

	it('delete deletes', async () => {
		answerJson({ status: 'ok' });
		await expect(Voices.delete(ctx, { voiceId: 'v1' })).resolves.toEqual({
			status: 'ok',
		});
		expect(lastCall().method).toBe('DELETE');
	});

	it('getSettings and defaultSettings read settings', async () => {
		const settings = { stability: 0.5, similarity_boost: 0.75, speed: 1 };
		answerJson(settings);
		await expect(
			Voices.getSettings(ctx, { voiceId: 'v1' }),
		).resolves.toMatchObject(settings);
		expect(lastCall().url.pathname).toBe('/v1/voices/v1/settings');

		answerJson(settings);
		await expect(Voices.defaultSettings(ctx, {})).resolves.toMatchObject(
			settings,
		);
		expect(lastCall().url.pathname).toBe('/v1/voices/settings/default');
	});

	it('editSettings posts the settings', async () => {
		answerJson({ status: 'ok' });
		await Voices.editSettings(ctx, {
			voiceId: 'v1',
			settings: { stability: 0.4 },
		});
		const call = lastCall();
		expect(call.url.pathname).toBe('/v1/voices/v1/settings/edit');
		expect(call.json).toEqual({ stability: 0.4 });
	});
});

describe('voiceDesign', () => {
	const previews = {
		previews: [
			{
				generated_voice_id: 'g1',
				audio_base_64: 'YWJj',
				media_type: 'audio/mpeg',
				duration_secs: 15,
			},
			{ generated_voice_id: 'g2', audio_base_64: 'YWJj' },
		],
		text: 'Preview text',
	};
	const description = 'A calm narrator with a warm low voice.';

	it('design asks for streaming previews and returns ids, never audio', async () => {
		answerJson(previews);
		const result = await VoiceDesign.design(ctx, {
			voiceDescription: description,
			autoGenerateText: true,
			outputFormat: 'mp3_22050_32',
		});
		const call = lastCall();
		expect(call.url.pathname).toBe('/v1/text-to-voice/design');
		expect(call.url.searchParams.get('output_format')).toBe('mp3_22050_32');
		expect(call.json).toMatchObject({
			voice_description: description,
			auto_generate_text: true,
			stream_previews: true,
		});
		expect(result.previews[0]?.generated_voice_id).toBe('g1');
		expect(result.previews[0]?.duration_secs).toBe(15);
		expect('audio_base_64' in (result.previews[0] ?? {})).toBe(false);
		expect(result.note).toContain('voiceDesign.getPreview');
	});

	it('design refuses a description the API refuses', async () => {
		await expect(
			VoiceDesign.design(ctx, { voiceDescription: 'too short' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('getPreview reads the audio by id and costs nothing new', async () => {
		answerBytes();
		const result = await VoiceDesign.getPreview(ctx, {
			generatedVoiceId: 'g/1',
		});
		const call = lastCall();
		expect(call.method).toBe('GET');
		expect(call.url.pathname).toBe('/v1/text-to-voice/g%2F1/stream');
		expect(result).toMatchObject({
			contentBase64: 'YWJj',
			contentType: 'audio/mpeg',
			byteLength: 3,
		});
	});

	it('getPreview applies the same limits as other reads', async () => {
		answerBytes();
		const over = await VoiceDesign.getPreview(ctx, {
			generatedVoiceId: 'g1',
			maxBytes: 1,
		});
		expect(over.contentOmitted).toBe('over_limit');
		expect(over.note).toContain('maxBytes: 3');

		answerBytes();
		const none = await VoiceDesign.getPreview(ctx, {
			generatedVoiceId: 'g1',
			includeContent: false,
		});
		expect(none.contentOmitted).toBe('not_requested');
		expect(none.contentBase64).toBeUndefined();
	});

	it('create saves a preview', async () => {
		answerJson({ voice_id: 'v9', name: 'Mine' });
		const result = await VoiceDesign.create(ctx, {
			voiceName: 'Mine',
			voiceDescription: description,
			generatedVoiceId: 'g1',
			labels: { accent: 'british' },
		});
		const call = lastCall();
		expect(call.url.pathname).toBe('/v1/text-to-voice');
		expect(call.json).toMatchObject({
			voice_name: 'Mine',
			generated_voice_id: 'g1',
		});
		expect(result.voice_id).toBe('v9');
	});

	it('remix posts the changes to the voice, for streaming previews too', async () => {
		answerJson(previews);
		const result = await VoiceDesign.remix(ctx, {
			voiceId: 'v1',
			voiceDescription: 'Brighter',
			autoGenerateText: true,
		});
		const call = lastCall();
		expect(call.url.pathname).toBe('/v1/text-to-voice/v1/remix');
		expect(call.json).toMatchObject({
			voice_description: 'Brighter',
			stream_previews: true,
		});
		expect('audio_base_64' in (result.previews[0] ?? {})).toBe(false);
		expect(result.note).toContain('voiceDesign.getPreview');
	});

	it.each([
		[
			'design',
			() =>
				VoiceDesign.design(ctx, {
					voiceDescription: description,
					autoGenerateText: true,
				}),
		],
		[
			'remix',
			() =>
				VoiceDesign.remix(ctx, {
					voiceId: 'v1',
					voiceDescription: 'Brighter',
					autoGenerateText: true,
				}),
		],
	] as const)('%s refuses a 200 with no previews', async (_op, call) => {
		answerJson({ text: 'Preview text' });
		await expect(call()).rejects.toThrow(/previews/);
		answerJson({ text: 'Preview text', previews: null });
		await expect(call()).rejects.toThrow(/previews/);
	});
});

describe('dubbing', () => {
	const dub = {
		dubbing_id: 'd1',
		name: 'x',
		status: 'dubbing',
		target_languages: ['es'],
		created_at: '2026-11-08T00:00:00Z',
	};

	it('create sends a file and returns the job id', async () => {
		answerJson({ dubbing_id: 'd1', expected_duration_sec: 2 });
		const result = await Dubbing.create(ctx, {
			...FILE,
			targetLang: 'es',
			numSpeakers: 1,
			disableVoiceCloning: true,
		});
		const { url, form, method } = lastCall();
		expect(url.pathname).toBe('/v1/dubbing');
		expect(method).toBe('POST');
		expect(form?.get('file')).toBeInstanceOf(File);
		expect(form?.get('target_lang')).toBe('es');
		expect(form?.get('num_speakers')).toBe('1');
		expect(form?.get('disable_voice_cloning')).toBe('true');
		expect(result.dubbing_id).toBe('d1');
	});

	it('create takes a URL', async () => {
		answerJson({ dubbing_id: 'd2' });
		await Dubbing.create(ctx, {
			sourceUrl: 'https://example.com/a.mp4',
			targetLang: 'de',
		});
		expect(lastCall().form?.get('source_url')).toBe(
			'https://example.com/a.mp4',
		);
	});

	it('create wants exactly one source', async () => {
		await expect(Dubbing.create(ctx, { targetLang: 'es' })).rejects.toThrow(
			/exactly one/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('get reads where it stands', async () => {
		answerJson({ ...dub, status: 'dubbed' });
		const result = await Dubbing.get(ctx, { dubbingId: 'd1' });
		expect(lastCall().url.pathname).toBe('/v1/dubbing/d1');
		expect(result.status).toBe('dubbed');
	});

	it('get keeps a status it has not heard of', async () => {
		answerJson({ ...dub, status: 'something_new' });
		await expect(Dubbing.get(ctx, { dubbingId: 'd1' })).resolves.toMatchObject({
			status: 'something_new',
		});
	});

	it('list pages by cursor', async () => {
		answerJson({ dubs: [dub], next_cursor: 'n', has_more: true });
		const result = await Dubbing.list(ctx, {
			cursor: 'c',
			pageSize: 5,
			dubbingStatus: 'dubbed',
		});
		const { url } = lastCall();
		expect(url.searchParams.get('cursor')).toBe('c');
		expect(url.searchParams.get('dubbing_status')).toBe('dubbed');
		expect(result.next_cursor).toBe('n');
	});

	it('delete deletes', async () => {
		answerJson({ status: 'ok' });
		await Dubbing.delete(ctx, { dubbingId: 'd1' });
		expect(lastCall().method).toBe('DELETE');
	});

	it('getAudio applies the size limit, with the id to read it again', async () => {
		answerBytes();
		const whole = await Dubbing.getAudio(ctx, {
			dubbingId: 'd1',
			languageCode: 'es',
		});
		expect(lastCall().url.pathname).toBe('/v1/dubbing/d1/audio/es');
		expect(whole.contentBase64).toBe('YWJj');

		answerBytes();
		const over = await Dubbing.getAudio(ctx, {
			dubbingId: 'd1',
			languageCode: 'es',
			maxBytes: 1,
		});
		expect(over.contentOmitted).toBe('over_limit');

		answerBytes();
		const none = await Dubbing.getAudio(ctx, {
			dubbingId: 'd1',
			languageCode: 'es',
			includeContent: false,
		});
		expect(none.contentOmitted).toBe('not_requested');
	});

	it('getTranscript reads the format asked, srt by default', async () => {
		answerJson({ transcript_format: 'srt', srt: '1\n' });
		const result = await Dubbing.getTranscript(ctx, {
			dubbingId: 'd1',
			languageCode: 'es',
		});
		expect(lastCall().url.pathname).toBe(
			'/v1/dubbing/d1/transcripts/es/format/srt',
		);
		expect(result.srt).toBe('1\n');

		answerJson({ transcript_format: 'json', json: { language: 'es' } });
		await Dubbing.getTranscript(ctx, {
			dubbingId: 'd1',
			languageCode: 'source',
			formatType: 'json',
		});
		expect(lastCall().url.pathname).toBe(
			'/v1/dubbing/d1/transcripts/source/format/json',
		);
	});
});

describe('history', () => {
	const item = {
		history_item_id: 'h1',
		voice_id: 'v1',
		text: 'Hello',
		date_unix: 1,
		state: 'created',
	};

	it('list pages after an id', async () => {
		answerJson({
			history: [item],
			has_more: true,
			last_history_item_id: 'h1',
			scanned_until: 1,
		});
		const result = await History.list(ctx, {
			pageSize: 1,
			startAfterHistoryItemId: 'h0',
			source: 'TTS',
		});
		const { url } = lastCall();
		expect(url.pathname).toBe('/v1/history');
		expect(url.searchParams.get('start_after_history_item_id')).toBe('h0');
		expect(url.searchParams.get('source')).toBe('TTS');
		expect(result.last_history_item_id).toBe('h1');
	});

	it('list keeps an empty page that says there is more', async () => {
		// Seen live: deleted items count toward a page.
		answerJson({
			history: [],
			has_more: true,
			last_history_item_id: 'h9',
		});
		const result = await History.list(ctx, { pageSize: 3 });
		expect(result.history).toEqual([]);
		expect(result.has_more).toBe(true);
		expect(result.last_history_item_id).toBe('h9');
	});

	it('get reads one item', async () => {
		answerJson(item);
		await expect(
			History.get(ctx, { historyItemId: 'h1' }),
		).resolves.toMatchObject({ text: 'Hello' });
	});

	it('getAudio returns bytes and names the item', async () => {
		answerBytes();
		const result = await History.getAudio(ctx, { historyItemId: 'h1' });
		expect(lastCall().url.pathname).toBe('/v1/history/h1/audio');
		expect(result.contentBase64).toBe('YWJj');
		expect(result.historyItemId).toBe('h1');
	});

	it('getAudio over the limit says how to get it', async () => {
		answerBytes();
		const result = await History.getAudio(ctx, {
			historyItemId: 'h1',
			maxBytes: 1,
		});
		expect(result.contentOmitted).toBe('over_limit');
		expect(result.note).toContain('maxBytes: 3');
	});

	it('delete deletes', async () => {
		answerJson({ status: 'ok' });
		await History.delete(ctx, { historyItemId: 'h1' });
		expect(lastCall().method).toBe('DELETE');
		expect(lastCall().url.pathname).toBe('/v1/history/h1');
	});
});

describe('models', () => {
	it('list wraps the API’s array', async () => {
		answerJson([
			{ model_id: 'eleven_flash_v2_5', can_do_text_to_speech: true, other: 1 },
		]);
		const result = await Models.list(ctx, {});
		expect(lastCall().url.pathname).toBe('/v1/models');
		expect(result.models[0]?.model_id).toBe('eleven_flash_v2_5');
		expect(result.models[0]?.other).toBe(1);
	});
});

describe('account', () => {
	it('user removes the key fields the API reports', async () => {
		answerJson({
			user_id: 'u1',
			workspace_id: 'w1',
			xi_api_key: KEY,
			xi_api_key_preview: 'sk_t...123',
			is_api_key_hashed: false,
			subscription: { tier: 'payg' },
		});
		const result = await Account.user(ctx, {});
		expect(lastCall().url.pathname).toBe('/v1/user');
		expect(result.user_id).toBe('u1');
		expect(result.subscription?.tier).toBe('payg');
		expect(JSON.stringify(result)).not.toContain(KEY);
		expect('xi_api_key_preview' in result).toBe(false);
	});

	it('subscription reads the plan', async () => {
		answerJson({ tier: 'payg', voice_limit: 3 });
		await expect(Account.subscription(ctx, {})).resolves.toMatchObject({
			tier: 'payg',
		});
		expect(lastCall().url.pathname).toBe('/v1/user/subscription');
	});

	it('usageStats asks the current report, daily by default', async () => {
		answerJson({
			columns: ['timestamp', 'total_usage'],
			column_units: [null, 'credits'],
			rows: [['2026-11-08T00:00:00Z', 4]],
		});
		const result = await Account.usageStats(ctx, {
			startTime: 1,
			endTime: 2,
			groupBy: ['model'],
		});
		const call = lastCall();
		expect(call.url.pathname).toBe(
			'/v1/workspace/analytics/query/usage-by-product-over-time',
		);
		expect(call.json).toEqual({
			start_time: 1,
			end_time: 2,
			interval_seconds: 86400,
			group_by: ['model'],
		});
		expect(result.rows?.[0]?.[1]).toBe(4);
	});
});

describe('agents', () => {
	const agent = {
		agent_id: 'a1',
		name: 'Test',
		conversation_config: { agent: {} },
		tags: ['t'],
	};

	it('list pages by cursor', async () => {
		answerJson({ agents: [agent], next_cursor: 'n', has_more: true });
		const result = await Agents.list(ctx, {
			cursor: 'c',
			pageSize: 2,
			search: 'x',
			tags: ['t'],
		});
		const { url } = lastCall();
		expect(url.pathname).toBe('/v1/convai/agents');
		expect(url.searchParams.get('cursor')).toBe('c');
		expect(url.searchParams.getAll('tags')).toEqual(['t']);
		expect(result.next_cursor).toBe('n');
	});

	it('get reads one, at a version if asked', async () => {
		answerJson(agent);
		await Agents.get(ctx, { agentId: 'a1', versionId: 'ver' });
		const { url } = lastCall();
		expect(url.pathname).toBe('/v1/convai/agents/a1');
		expect(url.searchParams.get('version_id')).toBe('ver');
	});

	it('create passes the configuration through', async () => {
		answerJson({ agent_id: 'a1' });
		const config = { agent: { first_message: 'Hi' } };
		const result = await Agents.create(ctx, {
			name: 'Test',
			conversationConfig: config,
			tags: ['t'],
		});
		const call = lastCall();
		expect(call.url.pathname).toBe('/v1/convai/agents/create');
		expect(call.json).toEqual({
			conversation_config: config,
			name: 'Test',
			tags: ['t'],
		});
		expect(result.agent_id).toBe('a1');
	});

	it('update patches', async () => {
		answerJson(agent);
		await Agents.update(ctx, { agentId: 'a1', name: 'New' });
		const call = lastCall();
		expect(call.method).toBe('PATCH');
		expect(call.url.pathname).toBe('/v1/convai/agents/a1');
		expect(call.json).toEqual({ name: 'New' });
	});

	it('delete deletes, forced if asked', async () => {
		fetchMock.mockResolvedValueOnce(new Response('', { status: 200 }));
		await Agents.delete(ctx, { agentId: 'a1', force: true });
		const call = lastCall();
		expect(call.method).toBe('DELETE');
		expect(call.url.searchParams.get('force')).toBe('true');
	});

	it('conversationsList filters and pages', async () => {
		answerJson({
			conversations: [{ conversation_id: 'c1', agent_id: 'a1' }],
			has_more: false,
			next_cursor: null,
		});
		const result = await Agents.conversationsList(ctx, {
			agentId: 'a1',
			cursor: 'c',
			summaryMode: 'include',
		});
		const { url } = lastCall();
		expect(url.pathname).toBe('/v1/convai/conversations');
		expect(url.searchParams.get('agent_id')).toBe('a1');
		expect(url.searchParams.get('summary_mode')).toBe('include');
		expect(result.conversations[0]?.conversation_id).toBe('c1');
	});

	it('conversationGet reads the transcript', async () => {
		answerJson({
			conversation_id: 'c1',
			status: 'done',
			transcript: [{ role: 'agent', message: 'Hi' }],
		});
		const result = await Agents.conversationGet(ctx, { conversationId: 'c1' });
		expect(lastCall().url.pathname).toBe('/v1/convai/conversations/c1');
		expect(result.transcript).toHaveLength(1);
	});

	it('conversationDelete deletes', async () => {
		fetchMock.mockResolvedValueOnce(new Response('{}', { status: 200 }));
		await Agents.conversationDelete(ctx, { conversationId: 'c1' });
		expect(lastCall().method).toBe('DELETE');
	});

	it('signedUrl asks for the agent', async () => {
		answerJson({ signed_url: 'wss://x' });
		const result = await Agents.signedUrl(ctx, { agentId: 'a1' });
		const { url } = lastCall();
		expect(url.pathname).toBe('/v1/convai/conversation/get-signed-url');
		expect(url.searchParams.get('agent_id')).toBe('a1');
		expect(result.signed_url).toBe('wss://x');
	});
});

describe('singleUseTokens', () => {
	it('create posts the type', async () => {
		answerJson({ token: 'tok' });
		const result = await SingleUseTokens.create(ctx, {
			tokenType: 'tts_websocket',
		});
		const call = lastCall();
		expect(call.url.pathname).toBe('/v1/single-use-token/tts_websocket');
		expect(call.method).toBe('POST');
		expect(result.token).toBe('tok');
	});

	it('refuses an unknown type, before any request', async () => {
		fetchMock.mockRejectedValue(new Error('Unexpected fetch'));
		await expect(
			// @ts-expect-error not a token type
			SingleUseTokens.create(ctx, { tokenType: 'other' }),
		).rejects.toThrow(/tokenType|invalid/i);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('a log entry that can’t be written', () => {
	const { logEventFromContext } = jest.requireMock('corsair/core') as {
		logEventFromContext: jest.Mock;
	};
	const previewBody = { previews: [{ generated_voice_id: 'g1' }] };
	const description = 'A calm narrator with a warm low voice.';

	it.each([
		[
			'textToSpeech.convert',
			() => answerBytes(SPEECH_HEADERS),
			() => TextToSpeech.convert(ctx, { voiceId: 'v', text: 'Hi' }),
		],
		[
			'textToSpeech.convertWithTimestamps',
			() => answerJson({ audio_base64: 'YWJj' }, SPEECH_HEADERS),
			() =>
				TextToSpeech.convertWithTimestamps(ctx, { voiceId: 'v', text: 'Hi' }),
		],
		[
			'textToDialogue.convert',
			() => answerBytes(SPEECH_HEADERS),
			() =>
				TextToDialogue.convert(ctx, {
					inputs: [{ text: 'Hi', voiceId: 'v' }],
				}),
		],
		[
			'speechToText.convert',
			() => answerJson({ text: 'Hi' }),
			() => SpeechToText.convert(ctx, FILE),
		],
		[
			'forcedAlignment.create',
			() => answerJson({ words: [] }),
			() => ForcedAlignment.create(ctx, { ...FILE, text: 'Hi' }),
		],
		[
			'soundEffects.generate',
			() => answerBytes(),
			() => SoundEffects.generate(ctx, { text: 'x' }),
		],
		[
			'music.compose',
			() => answerBytes(),
			() => Music.compose(ctx, { prompt: 'x' }),
		],
		[
			'music.plan',
			() => answerJson({ chunks: [] }),
			() => Music.plan(ctx, { prompt: 'x' }),
		],
		[
			'music.separateStems',
			() => answerBytes(),
			() => Music.separateStems(ctx, FILE),
		],
		[
			'audioIsolation.isolate',
			() => answerBytes(),
			() => AudioIsolation.isolate(ctx, FILE),
		],
		[
			'voiceChanger.convert',
			() => answerBytes(SPEECH_HEADERS),
			() => VoiceChanger.convert(ctx, { ...FILE, voiceId: 'v' }),
		],
		[
			'voiceDesign.design',
			() => answerJson(previewBody),
			() => VoiceDesign.design(ctx, { voiceDescription: description }),
		],
		[
			'voiceDesign.remix',
			() => answerJson(previewBody),
			() =>
				VoiceDesign.remix(ctx, { voiceId: 'v', voiceDescription: 'Brighter' }),
		],
		[
			'dubbing.create',
			() => answerJson({ dubbing_id: 'd1' }),
			() => Dubbing.create(ctx, { ...FILE, targetLang: 'es' }),
		],
	] as const)('doesn’t fail %s after it ran', async (_op, answer, call) => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		logEventFromContext.mockRejectedValueOnce(
			new Error('encryptDataAtRest requires kek'),
		);
		answer();
		await expect(call()).resolves.toBeDefined();
		expect(logEventFromContext).toHaveBeenCalled();
		expect(warn).toHaveBeenCalledWith(
			'Failed to log event:',
			expect.objectContaining({ message: 'encryptDataAtRest requires kek' }),
		);
	});
});

describe('logs', () => {
	it('never logs text, audio or credentials', async () => {
		const { logEventFromContext } = jest.requireMock('corsair/core') as {
			logEventFromContext: jest.Mock;
		};
		logEventFromContext.mockClear();
		answerBytes(SPEECH_HEADERS);
		await TextToSpeech.convert(ctx, {
			voiceId: 'v',
			text: 'a secret sentence',
		});
		answerJson({ token: 'secret-token' });
		await SingleUseTokens.create(ctx, { tokenType: 'tts_websocket' });
		answerJson({ signed_url: 'wss://secret-url' });
		await Agents.signedUrl(ctx, { agentId: 'a1' });

		const logged = JSON.stringify(
			logEventFromContext.mock.calls.map((c) => c[2]),
		);
		expect(logged).not.toContain('a secret sentence');
		expect(logged).not.toContain('YWJj');
		expect(logged).not.toContain('secret-token');
		expect(logged).not.toContain('secret-url');
		expect(logged).not.toContain(KEY);
	});
});
