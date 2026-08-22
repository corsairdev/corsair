/**
 * Aivoov API endpoint tests.
 *
 * These tests verify:
 *  1. Input/output Zod schemas parse correctly (unit)
 *  2. Live API call to GET /voices returns a well-shaped response (integration)
 *
 * Per PLUGIN_PR_RULES.md R2, every implemented endpoint must have a test.
 */

import { makeAivoovRequest } from '../client';
import {
	CreateAudioInputSchema,
	CreateAudioResponseSchema,
	ListVoicesInputSchema,
	ListVoicesResponseSchema,
	VoiceSchema,
} from '../endpoints/types';

// ─────────────────────────────────────────────────────────────────────────────
// Unit: Schema validation
// ─────────────────────────────────────────────────────────────────────────────

describe('ListVoicesInputSchema', () => {
	it('accepts an empty object (no language filter)', () => {
		expect(() => ListVoicesInputSchema.parse({})).not.toThrow();
	});

	it('accepts a valid BCP-47 language_code', () => {
		expect(() =>
			ListVoicesInputSchema.parse({ language_code: 'en-US' }),
		).not.toThrow();
	});

	it('strips unknown keys', () => {
		const result = ListVoicesInputSchema.parse({
			language_code: 'af-ZA',
			unknown_field: 'ignored',
		});
		expect(result).not.toHaveProperty('unknown_field');
	});
});

describe('VoiceSchema', () => {
	const validVoice = {
		voice_id: 'c9568120-ee25-4860-9038-219f0710a691',
		value: 'c9568120-ee25-4860-9038-219f0710a691',
		name: 'Adri',
		gender: 'Female',
		language_name: 'Afrikaans (South Africa)',
		language_code: 'af-ZA',
		label: 'Adri ( Female - Premium )',
	};

	it('parses a valid voice object from the live API shape', () => {
		expect(() => VoiceSchema.parse(validVoice)).not.toThrow();
	});

	it('requires voice_id field', () => {
		const { voice_id, ...rest } = validVoice;
		expect(() => VoiceSchema.parse(rest)).toThrow();
	});
});

describe('ListVoicesResponseSchema', () => {
	const validResponse = {
		status: true,
		message: 'Voice found',
		id: 1234567,
		data: [
			{
				voice_id: 'c9568120-ee25-4860-9038-219f0710a691',
				value: 'c9568120-ee25-4860-9038-219f0710a691',
				name: 'Adri',
				gender: 'Female',
				language_name: 'Afrikaans (South Africa)',
				language_code: 'af-ZA',
				label: 'Adri ( Female - Premium )',
			},
		],
	};

	it('parses a valid API response envelope', () => {
		expect(() => ListVoicesResponseSchema.parse(validResponse)).not.toThrow();
	});

	it('parses response without optional id field', () => {
		const { id, ...rest } = validResponse;
		expect(() => ListVoicesResponseSchema.parse(rest)).not.toThrow();
	});

	it('requires status to be boolean', () => {
		expect(() =>
			ListVoicesResponseSchema.parse({ ...validResponse, status: 'true' }),
		).toThrow();
	});
});

describe('CreateAudioInputSchema', () => {
	const validInput = {
		voice_id: ['c9568120-ee25-4860-9038-219f0710a691'],
		transcribe_text: ['Hello, world!'],
	};

	it('accepts minimal valid input', () => {
		expect(() => CreateAudioInputSchema.parse(validInput)).not.toThrow();
	});

	it('accepts SSML pitch_rate as integer', () => {
		expect(() =>
			CreateAudioInputSchema.parse({
				...validInput,
				transcribe_ssml_pitch_rate: [10],
			}),
		).not.toThrow();
	});

	it('accepts SSML pitch_rate as "default"', () => {
		expect(() =>
			CreateAudioInputSchema.parse({
				...validInput,
				transcribe_ssml_pitch_rate: ['default'],
			}),
		).not.toThrow();
	});

	it('rejects pitch_rate outside [-50, 50]', () => {
		expect(() =>
			CreateAudioInputSchema.parse({
				...validInput,
				transcribe_ssml_pitch_rate: [99],
			}),
		).toThrow();
	});

	it('rejects spk_rate outside [20, 200]', () => {
		expect(() =>
			CreateAudioInputSchema.parse({
				...validInput,
				transcribe_ssml_spk_rate: [5],
			}),
		).toThrow();
	});

	it('rejects empty voice_id array', () => {
		expect(() =>
			CreateAudioInputSchema.parse({ ...validInput, voice_id: [] }),
		).toThrow();
	});

	it('rejects empty transcribe_text array', () => {
		expect(() =>
			CreateAudioInputSchema.parse({ ...validInput, transcribe_text: [] }),
		).toThrow();
	});
});

describe('CreateAudioResponseSchema', () => {
	it('parses a valid audio creation response', () => {
		expect(() =>
			CreateAudioResponseSchema.parse({
				status: true,
				message: 'Audio generated',
				audio: 'https://example.com/audio.mp3',
			}),
		).not.toThrow();
	});

	it('requires the audio field', () => {
		expect(() =>
			CreateAudioResponseSchema.parse({ status: true, message: 'ok' }),
		).toThrow();
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration: Live API call (voices.list)
// Rate limit: 20 calls/day — these tests guard schema accuracy.
// ─────────────────────────────────────────────────────────────────────────────

const TEST_API_KEY = process.env.AIVOOV_API_KEY ?? '';

const describeIfKey = TEST_API_KEY ? describe : describe.skip;

describeIfKey('Live API — voices.list', () => {
	it('returns a valid response for all voices', async () => {
		const response = await makeAivoovRequest<unknown>('/voices', TEST_API_KEY, {
			method: 'GET',
		});

		const parsed = ListVoicesResponseSchema.safeParse(response);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.status).toBe(true);
			expect(Array.isArray(parsed.data.data)).toBe(true);
			expect(parsed.data.data.length).toBeGreaterThan(0);
		}
	}, 30000);

	it('returns filtered voices for a valid language_code', async () => {
		const response = await makeAivoovRequest<unknown>('/voices', TEST_API_KEY, {
			method: 'GET',
			query: { language_code: 'en-US' },
		});

		const parsed = ListVoicesResponseSchema.safeParse(response);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.data.every((v) => v.language_code === 'en-US')).toBe(
				true,
			);
		}
	}, 30000);

	it('each voice includes voice_id usable for audio creation', async () => {
		const response = await makeAivoovRequest<unknown>('/voices', TEST_API_KEY, {
			method: 'GET',
			query: { language_code: 'en-US' },
		});

		const parsed = ListVoicesResponseSchema.safeParse(response);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			for (const voice of parsed.data.data.slice(0, 5)) {
				expect(typeof voice.voice_id).toBe('string');
				expect(voice.voice_id.length).toBeGreaterThan(0);
			}
		}
	}, 30000);
});
