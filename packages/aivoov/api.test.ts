import {
	AivoovAPIError,
	assertAivoovSuccess,
	makeAivoovRequest,
} from './client';
import { buildCreateAudioForm } from './endpoints/audio';
import type { ListVoicesResponse } from './endpoints/types';
import {
	AivoovEndpointInputSchemas,
	AivoovEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';

const TEST_API_KEY = process.env.AIVOOV_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

function errorWithStatus(message: string, status: number): Error {
	return Object.assign(new Error(message), { status });
}

describe('Aivoov input schemas', () => {
	it('accepts a bare listVoices call and a language filter', () => {
		expect(AivoovEndpointInputSchemas.listVoices.parse({})).toEqual({});
		expect(
			AivoovEndpointInputSchemas.listVoices.parse({ language_code: 'en-US' }),
		).toEqual({ language_code: 'en-US' });
	});

	it('accepts a createAudio call with matching parallel arrays', () => {
		const parsed = AivoovEndpointInputSchemas.createAudio.parse({
			voice_id: ['a9c6e858-cbcb-4380-91e5-21cea93be41f'],
			transcribe_text: ['hello world'],
			transcribe_ssml_pitch_rate: [-50],
			transcribe_ssml_spk_rate: ['default'],
			transcribe_ssml_volume: [40],
		});

		expect(parsed.voice_id).toHaveLength(1);
		expect(parsed.transcribe_ssml_pitch_rate).toEqual([-50]);
		expect(parsed.transcribe_ssml_spk_rate).toEqual(['default']);
	});

	it('rejects parallel arrays whose lengths disagree with voice_id', () => {
		const result = AivoovEndpointInputSchemas.createAudio.safeParse({
			voice_id: ['voice-a', 'voice-b'],
			transcribe_text: ['only one segment'],
		});

		expect(result.success).toBe(false);
		expect(result.error?.issues[0]?.path).toEqual(['transcribe_text']);
		expect(result.error?.issues[0]?.message).toContain(
			'same number of entries as voice_id',
		);
	});

	it('enforces the documented SSML ranges', () => {
		const base = {
			voice_id: ['voice-a'],
			transcribe_text: ['hello'],
		};

		// Pitch is [-50, 50], speaking rate [20, 200], volume [-40, 40].
		expect(
			AivoovEndpointInputSchemas.createAudio.safeParse({
				...base,
				transcribe_ssml_pitch_rate: [51],
			}).success,
		).toBe(false);
		expect(
			AivoovEndpointInputSchemas.createAudio.safeParse({
				...base,
				transcribe_ssml_spk_rate: [19],
			}).success,
		).toBe(false);
		expect(
			AivoovEndpointInputSchemas.createAudio.safeParse({
				...base,
				transcribe_ssml_volume: [-41],
			}).success,
		).toBe(false);
		expect(
			AivoovEndpointInputSchemas.createAudio.safeParse({
				...base,
				transcribe_ssml_volume: [-40],
			}).success,
		).toBe(true);
	});

	it('rejects an empty synthesis request', () => {
		expect(
			AivoovEndpointInputSchemas.createAudio.safeParse({
				voice_id: [],
				transcribe_text: [],
			}).success,
		).toBe(false);
	});
});

describe('Aivoov output schemas', () => {
	it('parses a voices listing and keeps undocumented fields', () => {
		const parsed = AivoovEndpointOutputSchemas.listVoices.parse({
			status: true,
			message: 'Voice list',
			data: [
				{
					voice_id: 'a9c6e858-cbcb-4380-91e5-21cea93be41f',
					name: 'English Male 1',
					gender: 'Male',
					language_code: 'en-US',
					language_name: 'English (United States)',
					provider: 'google',
				},
			],
		});

		expect(parsed.data).toHaveLength(1);
		expect(parsed.data[0]?.voice_id).toBe(
			'a9c6e858-cbcb-4380-91e5-21cea93be41f',
		);
		// `.loose()` keeps fields AiVOOV adds without a schema bump here.
		expect(parsed.data[0]).toHaveProperty('provider', 'google');
	});

	it('parses a synthesis response', () => {
		const parsed = AivoovEndpointOutputSchemas.createAudio.parse({
			status: true,
			message: 'Audio successfully generated',
			audio: 'UklGRiQAAABXQVZF',
		});

		expect(parsed.status).toBe(true);
		expect(parsed.audio).toBe('UklGRiQAAABXQVZF');
	});

	it('rejects a voices payload that is missing the data array', () => {
		expect(
			AivoovEndpointOutputSchemas.listVoices.safeParse({
				status: true,
				message: 'Voice list',
			}).success,
		).toBe(false);
	});
});

describe('createAudio form encoding', () => {
	it('repeats bracketed keys so AiVOOV rebuilds the arrays in order', () => {
		const form = buildCreateAudioForm({
			voice_id: ['voice-a', 'voice-b'],
			transcribe_text: ['hello world', 'how are you'],
			transcribe_ssml_pitch_rate: [-50, 10],
			transcribe_ssml_spk_rate: ['default', 120],
		});

		expect(form.getAll('voice_id[]')).toEqual(['voice-a', 'voice-b']);
		expect(form.getAll('transcribe_text[]')).toEqual([
			'hello world',
			'how are you',
		]);
		expect(form.getAll('transcribe_ssml_pitch_rate[]')).toEqual(['-50', '10']);
		expect(form.getAll('transcribe_ssml_spk_rate[]')).toEqual([
			'default',
			'120',
		]);
	});

	it('omits SSML keys entirely when they are not supplied', () => {
		const form = buildCreateAudioForm({
			voice_id: ['voice-a'],
			transcribe_text: ['hello world'],
		});

		expect(form.has('transcribe_ssml_pitch_rate[]')).toBe(false);
		expect(form.has('transcribe_ssml_volume[]')).toBe(false);
		expect(form.toString()).toBe(
			'voice_id%5B%5D=voice-a&transcribe_text%5B%5D=hello+world',
		);
	});
});

describe('assertAivoovSuccess', () => {
	it('throws when AiVOOV reports failure on a 2xx response', () => {
		expect(() =>
			assertAivoovSuccess(
				{ status: false, error: 'Invalid API key' },
				'voices.list',
			),
		).toThrow(AivoovAPIError);
		expect(() =>
			assertAivoovSuccess({ status: false, error: 'Invalid API key' }, 'x'),
		).toThrow('Invalid API key');
	});

	it('passes through a successful envelope', () => {
		expect(() =>
			assertAivoovSuccess({ status: true, message: 'ok' }, 'voices.list'),
		).not.toThrow();
	});
});

describe('Aivoov error handlers', () => {
	it('routes AiVOOV 403 responses to AUTH_ERROR, not PERMISSION', () => {
		// AiVOOV answers a bad key with 403, so 403 must be treated as auth.
		expect(
			errorHandlers.AUTH_ERROR.match(errorWithStatus('Forbidden', 403)),
		).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(new Error('Invalid API key '))).toBe(
			true,
		);
	});

	it('detects rate limiting by status and by the daily-limit wording', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				errorWithStatus('Too Many Requests', 429),
			),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new Error('Daily limit reached for this endpoint'),
			),
		).toBe(true);
	});

	it('does not retry when character credits are exhausted', async () => {
		const error = new Error('Insufficient character credit balance');
		expect(errorHandlers.INSUFFICIENT_CREDITS_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.INSUFFICIENT_CREDITS_ERROR.handler(
			error,
			{ operation: 'audio.create' } as never,
		);
		expect(result.maxRetries).toBe(0);
	});

	it('retries server errors with backoff', async () => {
		const error = errorWithStatus('Bad Gateway', 502);
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);

		const result = await errorHandlers.SERVER_ERROR.handler();
		expect(result.maxRetries).toBe(2);
		expect(result.retryStrategy).toBe('exponential_backoff');
	});
});

// Live calls. `/voices` is capped at 20 calls per day, so this suite stays
// skipped unless AIVOOV_API_KEY is set.
describeIfApiKey('Aivoov live API', () => {
	it('returns voices matching the documented shape', async () => {
		const response = await makeAivoovRequest<ListVoicesResponse>(
			'/voices',
			TEST_API_KEY as string,
			{ query: { language_code: 'en-US' } },
		);

		const parsed = AivoovEndpointOutputSchemas.listVoices.parse(response);
		expect(parsed.status).toBe(true);
		expect(parsed.data.length).toBeGreaterThan(0);
		expect(typeof parsed.data[0]?.voice_id).toBe('string');
	});

	it('rejects a bad API key', async () => {
		await expect(
			makeAivoovRequest<ListVoicesResponse>('/voices', 'not-a-real-key'),
		).rejects.toThrow(AivoovAPIError);
	});
});
