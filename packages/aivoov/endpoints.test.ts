import { Audio, Voices } from './endpoints';

/**
 * Exercises the public endpoint handlers themselves (not just their helpers):
 * request mapping onto the AiVOOV wire format, and the side effects each
 * handler performs. `fetch` is stubbed so no network call is made.
 */

type FetchCall = { url: string; init: RequestInit };

let calls: FetchCall[];
let upserts: Array<{ entityId: string; data: Record<string, unknown> }>;

function stubFetch(body: unknown, status = 200) {
	global.fetch = jest.fn(async (url: unknown, init: unknown) => {
		calls.push({ url: String(url), init: init as RequestInit });
		return new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		});
	}) as unknown as typeof fetch;
}

// Minimal stand-in for the plugin context the framework injects. `database` is
// undefined so logEventFromContext resolves to a no-op instead of touching a DB.
function makeCtx(overrides: Record<string, unknown> = {}) {
	return {
		key: 'test-api-key',
		database: undefined,
		$getAccountId: async () => 'account_test',
		db: {
			voices: {
				upsertByEntityId: jest.fn(
					async (entityId: string, data: Record<string, unknown>) => {
						upserts.push({ entityId, data });
						return { entityId, data };
					},
				),
			},
		},
		...overrides,
	} as unknown as Parameters<typeof Voices.list>[0];
}

const VOICES_PAYLOAD = {
	status: true,
	message: 'Voice list',
	data: [
		{
			voice_id: 'a9c6e858-cbcb-4380-91e5-21cea93be41f',
			name: 'English Male 1',
			gender: 'Male',
			language_code: 'en-US',
			language_name: 'English (United States)',
		},
		{
			voice_id: 'cffc1d81-07cc-494f-a03a-0c0eebe99c8c',
			name: 'English Female 1',
			gender: 'Female',
			language_code: 'en-US',
			language_name: 'English (United States)',
		},
	],
};

beforeEach(() => {
	calls = [];
	upserts = [];
});

describe('voices.list handler', () => {
	it('maps the language filter onto the query string and authenticates with X-API-KEY', async () => {
		stubFetch(VOICES_PAYLOAD);
		const ctx = makeCtx();

		const result = await Voices.list(ctx, { language_code: 'en-US' });

		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toBe(
			'https://aivoov.com/api/v8/voices?language_code=en-US',
		);
		expect(calls[0]?.init.method).toBe('GET');

		const headers = calls[0]?.init.headers as Headers;
		expect(headers.get('X-API-KEY')).toBe('test-api-key');
		// AiVOOV authenticates on X-API-KEY alone; sending Bearer too would
		// transmit the key a second time.
		expect(headers.get('Authorization')).toBeNull();

		expect(result.data).toHaveLength(2);
		expect(result.data[0]?.voice_id).toBe(
			'a9c6e858-cbcb-4380-91e5-21cea93be41f',
		);
	});

	it('omits the query string entirely when no filter is given', async () => {
		stubFetch(VOICES_PAYLOAD);

		await Voices.list(makeCtx(), {});

		expect(calls[0]?.url).toBe('https://aivoov.com/api/v8/voices');
	});

	it('mirrors every voice into the voices entity keyed by voice_id', async () => {
		stubFetch(VOICES_PAYLOAD);

		await Voices.list(makeCtx(), {});

		expect(upserts).toHaveLength(2);
		expect(upserts.map((u) => u.entityId)).toEqual([
			'a9c6e858-cbcb-4380-91e5-21cea93be41f',
			'cffc1d81-07cc-494f-a03a-0c0eebe99c8c',
		]);
		expect(upserts[0]?.data.name).toBe('English Male 1');
		expect(upserts[0]?.data.updatedAt).toBeInstanceOf(Date);
	});

	it('still returns voices when the local mirror write fails', async () => {
		stubFetch(VOICES_PAYLOAD);
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const ctx = makeCtx({
			db: {
				voices: {
					upsertByEntityId: async () => {
						throw new Error('database unavailable');
					},
				},
			},
		});

		const result = await Voices.list(ctx, {});

		expect(result.data).toHaveLength(2);
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('throws when AiVOOV reports status:false on a 200 response', async () => {
		stubFetch({ status: false, error: 'Daily limit reached' });

		await expect(Voices.list(makeCtx(), {})).rejects.toThrow(
			'Daily limit reached',
		);
	});
});

describe('audio.create handler', () => {
	const AUDIO_PAYLOAD = {
		status: true,
		message: 'Audio successfully generated',
		audio: 'UklGRiQAAABXQVZF',
	};

	it('posts form-encoded parallel arrays in the order supplied', async () => {
		stubFetch(AUDIO_PAYLOAD);

		const result = await Audio.create(makeCtx(), {
			voice_id: ['voice-a', 'voice-b'],
			transcribe_text: ['hello world', 'how are you'],
			transcribe_ssml_pitch_rate: [-50, 10],
			transcribe_ssml_spk_rate: ['default', 120],
			transcribe_ssml_volume: [0, -40],
		});

		expect(calls).toHaveLength(1);
		expect(calls[0]?.url).toBe('https://aivoov.com/api/v8/create');
		expect(calls[0]?.init.method).toBe('POST');

		const headers = calls[0]?.init.headers as Headers;
		expect(headers.get('Content-Type')).toBe(
			'application/x-www-form-urlencoded',
		);
		expect(headers.get('X-API-KEY')).toBe('test-api-key');

		const sent = new URLSearchParams(String(calls[0]?.init.body));
		expect(sent.getAll('voice_id[]')).toEqual(['voice-a', 'voice-b']);
		expect(sent.getAll('transcribe_text[]')).toEqual([
			'hello world',
			'how are you',
		]);
		expect(sent.getAll('transcribe_ssml_pitch_rate[]')).toEqual(['-50', '10']);
		expect(sent.getAll('transcribe_ssml_spk_rate[]')).toEqual([
			'default',
			'120',
		]);
		expect(sent.getAll('transcribe_ssml_volume[]')).toEqual(['0', '-40']);

		expect(result.audio).toBe('UklGRiQAAABXQVZF');
	});

	it('sends no SSML keys when none are supplied', async () => {
		stubFetch(AUDIO_PAYLOAD);

		await Audio.create(makeCtx(), {
			voice_id: ['voice-a'],
			transcribe_text: ['hello world'],
		});

		const sent = new URLSearchParams(String(calls[0]?.init.body));
		expect(sent.has('transcribe_ssml_pitch_rate[]')).toBe(false);
		expect(sent.has('transcribe_ssml_spk_rate[]')).toBe(false);
		expect(sent.has('transcribe_ssml_volume[]')).toBe(false);
	});

	it('does not write synthesis output to the database', async () => {
		stubFetch(AUDIO_PAYLOAD);

		await Audio.create(makeCtx(), {
			voice_id: ['voice-a'],
			transcribe_text: ['hello world'],
		});

		expect(upserts).toHaveLength(0);
	});

	it('throws when AiVOOV reports status:false on a 200 response', async () => {
		stubFetch({ status: false, error: 'Insufficient character credits' });

		await expect(
			Audio.create(makeCtx(), {
				voice_id: ['voice-a'],
				transcribe_text: ['hello world'],
			}),
		).rejects.toThrow('Insufficient character credits');
	});

	it('surfaces a 403 from AiVOOV as an error', async () => {
		stubFetch({ status: false, error: 'Invalid API key' }, 403);

		await expect(
			Audio.create(makeCtx(), {
				voice_id: ['voice-a'],
				transcribe_text: ['hello world'],
			}),
		).rejects.toThrow();
	});
});
