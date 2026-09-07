import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { GladiaAPIError } from './client';
import type { GladiaContext } from './index';
import { gladia, gladiaEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.Mock;
const mockLogEvent = logEventFromContext as jest.Mock;

const mockCtx = {
	key: 'test-api-key',
	$getAccountId: async () => 'test-account-id',
	database: undefined,
	endpoints: {},
} as GladiaContext;

const job = {
	id: 'job-1',
	status: 'done',
	kind: 'pre-recorded',
	custom_metadata: {},
};

describe('Gladia plugin shape', () => {
	it('exposes the nine supported operations and no deprecated audio download', () => {
		const plugin = gladia();
		const paths = Object.entries(plugin.endpointMeta ?? {}).map(
			([path]) => path,
		);

		expect(paths).toHaveLength(9);
		expect(paths).toContain('upload.audioVideoFile');
		expect(paths).toContain('preRecorded.deleteJob');
		expect(paths.some((path) => path.toLowerCase().includes('audiofile'))).toBe(
			false,
		);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
	});
});

describe('Gladia live input bounds', () => {
	const live =
		gladiaEndpointSchemas['live.initiateTranscriptionSession']?.input;

	it('rejects endpointing outside the 0.01 to 10 second range', () => {
		expect(live!.safeParse({ endpointing: 0.001 }).success).toBe(false);
		expect(live!.safeParse({ endpointing: 20 }).success).toBe(false);
		expect(live!.safeParse({ endpointing: 0.05 }).success).toBe(true);
	});

	it('rejects maximum_duration_without_endpointing outside 5 to 60 seconds', () => {
		expect(
			live!.safeParse({ maximum_duration_without_endpointing: 1 }).success,
		).toBe(false);
		expect(
			live!.safeParse({ maximum_duration_without_endpointing: 61 }).success,
		).toBe(false);
		expect(
			live!.safeParse({ maximum_duration_without_endpointing: 30 }).success,
		).toBe(true);
	});

	it('requires 8-bit audio for alaw and ulaw encodings', () => {
		expect(
			live!.safeParse({ encoding: 'wav/alaw', bit_depth: 16 }).success,
		).toBe(false);
		expect(
			live!.safeParse({ encoding: 'wav/ulaw', bit_depth: 24 }).success,
		).toBe(false);
		expect(
			live!.safeParse({ encoding: 'wav/alaw', bit_depth: 8 }).success,
		).toBe(true);
		expect(
			live!.safeParse({ encoding: 'wav/pcm', bit_depth: 16 }).success,
		).toBe(true);
	});

	it('rejects alaw and ulaw when bit_depth is omitted', () => {
		expect(live!.safeParse({ encoding: 'wav/alaw' }).success).toBe(false);
		expect(live!.safeParse({ encoding: 'wav/ulaw' }).success).toBe(false);
		expect(live!.safeParse({ encoding: 'wav/pcm' }).success).toBe(true);
		expect(live!.safeParse({}).success).toBe(true);
	});
});

describe('Gladia HTTP client and endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLogEvent.mockReset();
		mockRequest.mockResolvedValue(job);
	});

	it('uses the Gladia base URL and x-gladia-key header', async () => {
		await gladia({
			key: 'test-api-key',
		}).endpoints!.live.getTranscriptionResult(mockCtx, { id: 'job/1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.gladia.io',
				HEADERS: {
					'x-gladia-key': 'test-api-key',
					'Content-Type': 'application/json',
				},
			}),
			expect.objectContaining({ method: 'GET', url: '/v2/live/job%2F1' }),
		);
	});

	it('starts a pre-recorded job with a JSON body', async () => {
		mockRequest.mockResolvedValue({
			id: 'job-1',
			result_url: 'https://api.gladia.io/v2/pre-recorded/job-1',
		});
		await gladia({
			key: 'test-api-key',
		}).endpoints!.preRecorded.initiateTranscription(mockCtx, {
			audio_url: 'https://files.gladia.io/audio.wav',
			language_config: { languages: ['en'] },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/v2/pre-recorded',
				body: {
					audio_url: 'https://files.gladia.io/audio.wav',
					language_config: { languages: ['en'] },
				},
			}),
		);
	});

	it('passes pagination and filters to both list endpoints', async () => {
		const list = {
			first: 'https://api.gladia.io/v2/live',
			current: 'https://api.gladia.io/v2/live',
			next: null,
			items: [],
		};
		mockRequest.mockResolvedValue(list);
		const input = { offset: 20, limit: 10, status: ['done'] as Array<'done'> };
		await gladia({ key: 'test-api-key' }).endpoints!.live.listTranscriptionJobs(
			mockCtx,
			input,
		);
		await gladia({ key: 'test-api-key' }).endpoints!.preRecorded.listJobs(
			mockCtx,
			input,
		);

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual([
			expect.objectContaining({ method: 'GET', url: '/v2/live', query: input }),
			expect.objectContaining({
				method: 'GET',
				url: '/v2/pre-recorded',
				query: input,
			}),
		]);
	});

	it('creates live sessions with a region query and returns the WebSocket URL', async () => {
		const response = {
			id: 'live-1',
			created_at: '2026-01-01T00:00:00.000Z',
			url: 'wss://api.gladia.io/v2/live?token=temporary',
		};
		mockRequest.mockResolvedValue(response);
		await gladia({
			key: 'test-api-key',
		}).endpoints!.live.initiateTranscriptionSession(mockCtx, {
			region: 'eu-west',
			channels: 1,
		});

		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/v2/live',
				query: { region: 'eu-west' },
				body: { channels: 1 },
			}),
		);
	});

	it('uploads audio as multipart form data', async () => {
		mockRequest.mockResolvedValue({
			audio_url: 'https://api.gladia.io/file/1',
			audio_metadata: {},
		});
		const audio = new Blob(['audio'], { type: 'audio/wav' });
		await gladia({ key: 'test-api-key' }).endpoints!.upload.audioVideoFile(
			mockCtx,
			{ audio, filename: 'sample.wav' },
		);

		const options = mockRequest.mock.calls[0]?.[1] as {
			body: FormData;
			url: string;
		};
		expect(options.url).toBe('/v2/upload');
		expect(options.body).toBeInstanceOf(FormData);
		expect(options.body.get('audio')).toBeInstanceOf(File);
	});

	it('maps delete operations to the documented routes', async () => {
		mockRequest.mockResolvedValue(undefined);
		await gladia({ key: 'test-api-key' }).endpoints!.live.deleteSession(
			mockCtx,
			{ id: 'live-1' },
		);
		await gladia({ key: 'test-api-key' }).endpoints!.preRecorded.deleteJob(
			mockCtx,
			{ id: 'pre-1' },
		);

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual([
			expect.objectContaining({ method: 'DELETE', url: '/v2/live/live-1' }),
			expect.objectContaining({
				method: 'DELETE',
				url: '/v2/pre-recorded/pre-1',
			}),
		]);
	});

	it('accepts acknowledgement bodies on delete responses', async () => {
		mockRequest.mockResolvedValueOnce({
			message: 'The pre recorded job has been successfully deleted',
		});
		await expect(
			gladia({ key: 'test-api-key' }).endpoints!.preRecorded.deleteJob(
				mockCtx,
				{ id: 'pre-1' },
			),
		).resolves.toEqual({
			message: 'The pre recorded job has been successfully deleted',
		});
	});

	it('rejects delete responses that are not acknowledgement objects', async () => {
		mockRequest.mockResolvedValueOnce({ unexpected: true });
		await expect(async () => {
			await gladia({ key: 'test-api-key' }).endpoints!.preRecorded.deleteJob(
				mockCtx,
				{ id: 'pre-1' },
			);
		}).rejects.toThrow(/output validation failed/);
	});

	it('wraps transport failures with the provider error type', async () => {
		mockRequest.mockRejectedValue(new Error('network unavailable'));
		await expect(
			gladia({ key: 'test-api-key' }).endpoints!.preRecorded.getJob(mockCtx, {
				id: 'job-1',
			}),
		).rejects.toBeInstanceOf(GladiaAPIError);
	});

	it('rejects malformed inputs before they reach Gladia', async () => {
		await expect(async () => {
			await gladia({
				key: 'test-api-key',
			}).endpoints!.preRecorded.initiateTranscription(mockCtx, {
				audio_url: 'not-a-url',
			} as never);
		}).rejects.toThrow(/input validation failed/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects responses that violate the advertised output contract', async () => {
		mockRequest.mockResolvedValueOnce({ unexpected: true });
		await expect(
			gladia({ key: 'test-api-key' }).endpoints!.live.getTranscriptionResult(
				mockCtx,
				{ id: 'job-1' },
			),
		).rejects.toThrow(/gladia/i);
	});
});
