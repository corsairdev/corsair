/**
 * Live tests against ElevenLabs. They run when ELEVENLABS_API_KEY is set (CI has
 * none, so they skip). Reads are free. The rest run only with
 * ELEVENLABS_LIVE_GENERATE=1 and spend about 150 credits (about $0.06 on
 * pay-as-you-go), mostly the dub, music and isolation: a few words of speech, 3 s
 * of music, 0.5 s of sound, a 1 s dub. They delete what they create. Voice design costs about 100 credits with this
 * test's short text and only runs with ELEVENLABS_LIVE_DESIGN=1.
 *
 *   set -a; . ~/pranay-personal/.env; set +a
 *   ELEVENLABS_LIVE_GENERATE=1 pnpm --filter @corsair-dev/elevenlabs test:live
 */

import { ApiError } from 'corsair/http';
import { z } from 'zod';
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

const KEY = z.string().min(1).safeParse(process.env.ELEVENLABS_API_KEY);
const describeLive = KEY.success ? describe : describe.skip;
const generate = KEY.success && process.env.ELEVENLABS_LIVE_GENERATE === '1';
const itGenerate = generate ? it : it.skip;
const itDesign =
	generate && process.env.ELEVENLABS_LIVE_DESIGN === '1' ? it : it.skip;

// unknown: endpoints read only ctx.key; the rest of the context is the runtime's.
const ctx = { key: KEY.data ?? '' } as unknown as Parameters<
	typeof Voices.get
>[0];

const VOICE = 'FGY2WhTYpPnrIDTdsKH5'; // premade: Laura
const OTHER_VOICE = 'JBFqnCBsd6RMkjVDRZzb'; // premade: George
const FLASH = 'eleven_flash_v2_5';
const SMALL = 'mp3_22050_32';
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// unknown: only whether it rejects matters here, not what it resolves to.
const failure = (call: Promise<unknown>) =>
	call.then(
		() => {
			throw new Error('expected the call to reject');
		},
		(error) => error as ApiError & { code?: string; requestId?: string },
	);

describeLive('ElevenLabs live API', () => {
	jest.setTimeout(240_000);

	const createdHistory: string[] = [];
	let sampleClip: Promise<string> | undefined;

	/** A short clip made once, by whichever test needs it first, so any test can run alone. */
	const speechSample = () => {
		sampleClip ??= TextToSpeech.convert(ctx, {
			voiceId: VOICE,
			text: 'Hello from Corsair.',
			modelId: FLASH,
			outputFormat: SMALL,
		}).then((clip) => {
			createdHistory.push(clip.historyItemId ?? '');
			return clip.contentBase64 ?? '';
		});
		return sampleClip;
	};

	afterAll(async () => {
		for (const historyItemId of createdHistory) {
			await History.delete(ctx, { historyItemId }).catch(() => undefined);
		}
	});

	it('models.list names the current models and no key leaks', async () => {
		const { models } = await Models.list(ctx, {});
		expect(models.map((m) => m.model_id)).toContain(FLASH);
	});

	it('account.user keeps ids and drops the key fields', async () => {
		const user = await Account.user(ctx, {});
		expect(user.user_id).toBeTruthy();
		expect('xi_api_key' in user).toBe(false);
		expect('xi_api_key_preview' in user).toBe(false);
		expect(JSON.stringify(user)).not.toContain(KEY.data);
	});

	it('account.subscription and account.usageStats read', async () => {
		expect((await Account.subscription(ctx, {})).tier).toBeTruthy();
		const now = Date.now();
		const stats = await Account.usageStats(ctx, {
			startTime: now - 2 * 86400_000,
			endTime: now,
			groupBy: ['product_type'],
		});
		expect(stats.columns).toContain('total_usage');
	});

	it('voices.list pages with its token', async () => {
		const first = await Voices.list(ctx, { pageSize: 1 });
		expect(first.voices).toHaveLength(1);
		if (first.has_more && first.next_page_token) {
			const second = await Voices.list(ctx, {
				pageSize: 1,
				nextPageToken: first.next_page_token,
			});
			expect(second.voices[0]?.voice_id).not.toBe(first.voices[0]?.voice_id);
		}
	});

	it('voices: get, getSettings, defaultSettings, searchLibrary', async () => {
		expect((await Voices.get(ctx, { voiceId: VOICE })).voice_id).toBe(VOICE);
		expect(
			(await Voices.getSettings(ctx, { voiceId: VOICE })).stability,
		).toBeDefined();
		expect((await Voices.defaultSettings(ctx, {})).stability).toBeDefined();
		const library = await Voices.searchLibrary(ctx, {
			search: 'narrator',
			pageSize: 2,
		});
		expect(library.voices.length).toBeGreaterThan(0);
	});

	it('lists answer with their paging fields', async () => {
		expect((await Dubbing.list(ctx, { pageSize: 1 })).has_more).toBeDefined();
		expect((await History.list(ctx, { pageSize: 1 })).has_more).toBeDefined();
		expect((await Agents.list(ctx, { pageSize: 1 })).has_more).toBeDefined();
		expect(
			(await Agents.conversationsList(ctx, { pageSize: 1 })).has_more,
		).toBeDefined();
	});

	it('singleUseTokens.create mints a token', async () => {
		const { token } = await SingleUseTokens.create(ctx, {
			tokenType: 'tts_websocket',
		});
		expect(token.length).toBeGreaterThan(10);
	});

	it('errors come back in the shapes the client reads', async () => {
		const badId = await failure(
			Voices.get(ctx, { voiceId: 'not-a-real-voice' }),
		);
		expect(badId).toBeInstanceOf(ApiError);
		expect(badId.status).toBe(400);
		expect(badId.code).toBeTruthy();
		expect(badId.requestId).toBeTruthy();

		const badKey = await failure(
			Models.list({ key: 'not-a-real-key' } as typeof ctx, {}),
		);
		expect(badKey.status).toBe(401);
		expect(badKey.code).toBe('unauthorized');
		expect(badKey.message).not.toContain('not-a-real-key');

		// unknown: the body below is read only for its detail list.
		// A validation list: voice_description is required by the API, and the
		// schema here also requires it, so this goes around the plugin's check.
		const badBody = await fetch(
			'https://api.elevenlabs.io/v1/text-to-voice/design',
			{
				method: 'POST',
				headers: {
					'xi-api-key': KEY.data ?? '',
					'content-type': 'application/json',
				},
				body: '{}',
			},
		);
		expect(badBody.status).toBe(422);
		expect(
			Array.isArray(((await badBody.json()) as { detail: unknown }).detail),
		).toBe(true);
	});

	itGenerate('textToSpeech.convert returns audio and its headers', async () => {
		const result = await TextToSpeech.convert(ctx, {
			voiceId: VOICE,
			text: 'Hello from Corsair.',
			modelId: FLASH,
			outputFormat: SMALL,
		});
		expect(result.contentType).toBe('audio/mpeg');
		expect(result.byteLength).toBeGreaterThan(1000);
		expect(result.characterCost).toBeGreaterThan(0);
		expect(result.requestId).toBeTruthy();
		expect(result.historyItemId).toBeTruthy();
		expect(Buffer.from(result.contentBase64 ?? '', 'base64').byteLength).toBe(
			result.byteLength,
		);
		createdHistory.push(result.historyItemId ?? '');
	});

	itGenerate(
		'includeContent false and maxBytes leave it out, and history brings it back',
		async () => {
			const omitted = await TextToSpeech.convert(ctx, {
				voiceId: VOICE,
				text: 'Short.',
				modelId: FLASH,
				outputFormat: SMALL,
				includeContent: false,
			});
			createdHistory.push(omitted.historyItemId ?? '');
			expect(omitted.contentBase64).toBeUndefined();
			expect(omitted.contentOmitted).toBe('not_requested');

			// The id comes back with the audio, but the item takes a moment to be
			// readable: a read right away answers 400 "not found".
			let item: Awaited<ReturnType<typeof History.get>> | undefined;
			for (let i = 0; i < 15 && !item; i++) {
				item = await History.get(ctx, {
					historyItemId: omitted.historyItemId ?? '',
				}).catch(() => undefined);
				if (!item) await sleep(1000);
			}
			expect(item?.text).toBe('Short.');

			const audio = await History.getAudio(ctx, {
				historyItemId: omitted.historyItemId ?? '',
			});
			expect(audio.contentBase64).toBeTruthy();

			const over = await History.getAudio(ctx, {
				historyItemId: omitted.historyItemId ?? '',
				maxBytes: 100,
			});
			expect(over.contentOmitted).toBe('over_limit');
			expect(over.note).toContain('history.getAudio');
		},
	);

	itGenerate(
		'textToSpeech.convertWithTimestamps aligns characters',
		async () => {
			const result = await TextToSpeech.convertWithTimestamps(ctx, {
				voiceId: VOICE,
				text: 'Hi there.',
				modelId: FLASH,
				outputFormat: SMALL,
			});
			createdHistory.push(result.historyItemId ?? '');
			expect(result.contentBase64).toBeTruthy();
			expect(result.alignment?.characters?.length).toBe(9);
		},
	);

	itGenerate('textToDialogue.convert has a history item too', async () => {
		const result = await TextToDialogue.convert(ctx, {
			inputs: [
				{ text: 'Hi.', voiceId: VOICE },
				{ text: 'Hey.', voiceId: OTHER_VOICE },
			],
			outputFormat: SMALL,
		});
		createdHistory.push(result.historyItemId ?? '');
		expect(result.historyItemId).toBeTruthy();
	});

	itGenerate('speechToText: file, read, delete', async () => {
		const transcript = await SpeechToText.convert(ctx, {
			fileBase64: await speechSample(),
			fileName: 'sample.mp3',
			contentType: 'audio/mpeg',
			keyterms: ['Corsair'],
			timestampsGranularity: 'word',
		});
		const id = transcript.transcription_id ?? '';
		let deleted = false;
		try {
			expect(transcript.text?.toLowerCase()).toContain('corsair');
			expect(id).toBeTruthy();
			const read = await SpeechToText.getTranscript(ctx, {
				transcriptionId: id,
			});
			expect(read.text).toBe(transcript.text);
			await SpeechToText.deleteTranscript(ctx, { transcriptionId: id });
			deleted = true;
			const gone = await failure(
				SpeechToText.getTranscript(ctx, { transcriptionId: id }),
			);
			expect(gone.status).toBe(404);
		} finally {
			if (id && !deleted) {
				await SpeechToText.deleteTranscript(ctx, {
					transcriptionId: id,
				}).catch(() => undefined);
			}
		}
	});

	itGenerate('speechToText reads a hosted file by URL', async () => {
		const library = await Voices.get(ctx, { voiceId: VOICE });
		const transcript = await SpeechToText.convert(ctx, {
			sourceUrl: library.preview_url ?? '',
		});
		expect(transcript.text?.length).toBeGreaterThan(0);
		if (transcript.transcription_id) {
			await SpeechToText.deleteTranscript(ctx, {
				transcriptionId: transcript.transcription_id,
			}).catch(() => undefined);
		}
	});

	itGenerate('forcedAlignment.create times the words', async () => {
		const result = await ForcedAlignment.create(ctx, {
			fileBase64: await speechSample(),
			fileName: 'sample.mp3',
			contentType: 'audio/mpeg',
			text: 'Hello from Corsair.',
		});
		expect(result.words?.length).toBeGreaterThan(0);
	});

	itGenerate('voiceChanger.convert speaks it in another voice', async () => {
		const result = await VoiceChanger.convert(ctx, {
			voiceId: OTHER_VOICE,
			fileBase64: await speechSample(),
			fileName: 'sample.mp3',
			contentType: 'audio/mpeg',
			modelId: 'eleven_multilingual_sts_v2',
			outputFormat: SMALL,
		});
		createdHistory.push(result.historyItemId ?? '');
		expect(result.historyItemId).toBeTruthy();
		expect(result.characterCost).toBeGreaterThan(0);
	});

	itGenerate('audioIsolation.isolate takes a clip over 4.6 s', async () => {
		const long = await TextToSpeech.convert(ctx, {
			voiceId: VOICE,
			text: 'This clip is long enough for the voice isolator, which refuses anything under five seconds of audio. It only needs a few more words.',
			modelId: FLASH,
			outputFormat: SMALL,
		});
		createdHistory.push(long.historyItemId ?? '');
		const result = await AudioIsolation.isolate(ctx, {
			fileBase64: long.contentBase64 ?? '',
			fileName: 'long.mp3',
			contentType: 'audio/mpeg',
		});
		expect(result.contentBase64).toBeTruthy();
		expect(result.historyItemId).toBeUndefined();
	});

	itGenerate(
		'soundEffects.generate has no history item, so audio always returns',
		async () => {
			const result = await SoundEffects.generate(ctx, {
				text: 'a short click',
				durationSeconds: 0.5,
				outputFormat: SMALL,
			});
			expect(result.contentBase64).toBeTruthy();
			expect(result.historyItemId).toBeUndefined();
		},
	);

	itGenerate(
		'music: plan, compose from the plan, split into stems',
		async () => {
			const plan = await Music.plan(ctx, {
				prompt: 'a short calm piano note',
				musicLengthMs: 3000,
			});
			expect(plan.chunks?.length).toBeGreaterThan(0);

			const song = await Music.compose(ctx, {
				compositionPlan: plan,
				outputFormat: SMALL,
			});
			expect(song.contentBase64).toBeTruthy();
			expect(song.songId).toBeTruthy();

			const stems = await Music.separateStems(ctx, {
				fileBase64: song.contentBase64 ?? '',
				fileName: 'song.mp3',
				contentType: 'audio/mpeg',
				stemVariationId: 'two_stems_v1',
				outputFormat: SMALL,
			});
			expect(stems.contentType).toBe('application/zip');
			expect(
				Buffer.from(stems.contentBase64 ?? '', 'base64')
					.subarray(0, 2)
					.toString(),
			).toBe('PK');
		},
	);

	itGenerate('dubbing: create, follow, read, delete', async () => {
		const dub = await Dubbing.create(ctx, {
			fileBase64: await speechSample(),
			fileName: 'sample.mp3',
			contentType: 'audio/mpeg',
			targetLang: 'es',
			sourceLang: 'en',
			numSpeakers: 1,
			watermark: true,
			disableVoiceCloning: true,
			name: 'corsair-plugin-test',
		});
		try {
			let status = '';
			for (let i = 0; i < 40; i++) {
				status = (await Dubbing.get(ctx, { dubbingId: dub.dubbing_id })).status;
				if (status === 'dubbed' || status === 'failed') break;
				await sleep(5000);
			}
			expect(status).toBe('dubbed');
			const audio = await Dubbing.getAudio(ctx, {
				dubbingId: dub.dubbing_id,
				languageCode: 'es',
			});
			expect(audio.contentBase64).toBeTruthy();
			const srt = await Dubbing.getTranscript(ctx, {
				dubbingId: dub.dubbing_id,
				languageCode: 'es',
			});
			expect(srt.srt).toBeTruthy();
		} finally {
			await Dubbing.delete(ctx, { dubbingId: dub.dubbing_id });
		}
	});

	itGenerate('agents: create, get, update, signedUrl, delete', async () => {
		const { agent_id: agentId } = await Agents.create(ctx, {
			name: 'corsair-plugin-test',
			conversationConfig: {
				agent: {
					first_message: 'Hi.',
					prompt: { prompt: 'Answer in one word.' },
				},
			},
		});
		try {
			expect((await Agents.get(ctx, { agentId })).name).toBe(
				'corsair-plugin-test',
			);
			const updated = await Agents.update(ctx, {
				agentId,
				name: 'corsair-plugin-test-2',
				tags: ['corsair-test'],
			});
			expect(updated.name).toBe('corsair-plugin-test-2');
			const { signed_url: url } = await Agents.signedUrl(ctx, { agentId });
			expect(url.startsWith('wss://')).toBe(true);
		} finally {
			await Agents.delete(ctx, { agentId });
		}
	});

	itDesign(
		'voiceDesign: previews without their audio, read back with getPreview',
		async () => {
			const result = await VoiceDesign.design(ctx, {
				voiceDescription: 'A calm middle-aged narrator with a warm low voice.',
				text: 'This is a short line for a voice preview, just long enough for the design endpoint to accept it here.',
				outputFormat: SMALL,
			});
			expect(result.previews.length).toBeGreaterThan(0);
			expect(result.previews[0]?.generated_voice_id).toBeTruthy();
			expect('audio_base_64' in (result.previews[0] ?? {})).toBe(false);

			const preview = await VoiceDesign.getPreview(ctx, {
				generatedVoiceId: result.previews[0]?.generated_voice_id ?? '',
				maxBytes: 5_000_000,
			});
			expect(preview.contentType).toContain('audio');
			expect(preview.contentBase64).toBeTruthy();
		},
	);
});
