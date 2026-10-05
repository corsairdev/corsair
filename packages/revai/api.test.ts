import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { getJob, getTranscript, submitJob } from './endpoints/jobs';

jest.mock('./client');
jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

describe('Rev AI Endpoints', () => {
	const mockCtx = {
		key: 'test_token',
		auth: { token: 'test_token' },
	} as any;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('submitJob serializes media_url to source_config.url', async () => {
		(client.makeRevAIRequest as jest.Mock).mockResolvedValue({ id: '123' });

		await submitJob(mockCtx, {
			media_url: 'https://test.com/audio.mp3',
			metadata: 'test',
			language: 'en',
			notification_config: {
				url: 'https://example.com/webhooks/revai',
				auth_headers: {
					Authorization: 'Bearer webhook-secret',
				},
			},
		});

		expect(client.makeRevAIRequest).toHaveBeenCalledWith(
			'/jobs',
			'test_token',
			expect.objectContaining({
				method: 'POST',
				body: {
					source_config: { url: 'https://test.com/audio.mp3' },
					metadata: 'test',
					language: 'en',
					notification_config: {
						url: 'https://example.com/webhooks/revai',
						auth_headers: {
							Authorization: 'Bearer webhook-secret',
						},
					},
				},
			}),
		);

		expect(logEventFromContext).toHaveBeenCalledWith(
			mockCtx,
			'revai.jobs.submit',
			{
				metadata: 'test',
				language: 'en',
				notification_config: {
					url: 'https://example.com/webhooks/revai',
				},
			},
			'completed',
		);
	});

	it('submitJob validates both input and output', async () => {
		await expect(
			submitJob(mockCtx, {
				media_url: 'not-a-url',
			} as any),
		).rejects.toThrow();

		(client.makeRevAIRequest as jest.Mock).mockResolvedValue({
			status: 'in_progress',
		});

		await expect(
			submitJob(mockCtx, {
				media_url: 'https://test.com/audio.mp3',
			}),
		).rejects.toThrow();
	});

	it('getJob encodes the job ID', async () => {
		(client.makeRevAIRequest as jest.Mock).mockResolvedValue({ id: '123' });

		await getJob(mockCtx, { id: 'some/id?with=params' });

		expect(client.makeRevAIRequest).toHaveBeenCalledWith(
			`/jobs/${encodeURIComponent('some/id?with=params')}`,
			'test_token',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('getJob validates input and output', async () => {
		await expect(getJob(mockCtx, {} as any)).rejects.toThrow();

		(client.makeRevAIRequest as jest.Mock).mockResolvedValue({
			status: 'transcribed',
		});
		await expect(getJob(mockCtx, { id: 'job-123' })).rejects.toThrow();
	});

	it('getTranscript encodes the job ID and adds accept header', async () => {
		(client.makeRevAIRequest as jest.Mock).mockResolvedValue(
			'plain text transcript',
		);

		await getTranscript(mockCtx, {
			id: 'some/id?with=params',
			accept: 'text/plain',
		});

		expect(client.makeRevAIRequest).toHaveBeenCalledWith(
			`/jobs/${encodeURIComponent('some/id?with=params')}/transcript`,
			'test_token',
			expect.objectContaining({
				method: 'GET',
				headers: { Accept: 'text/plain' },
			}),
		);
	});

	it('getTranscript validates transcript output based on accept format', async () => {
		(client.makeRevAIRequest as jest.Mock).mockResolvedValue(
			'plain text transcript',
		);
		await expect(
			getTranscript(mockCtx, {
				id: 'job-123',
				accept: 'text/plain',
			}),
		).resolves.toBe('plain text transcript');

		(client.makeRevAIRequest as jest.Mock).mockResolvedValue(
			JSON.stringify({ monologues: [] }),
		);
		await expect(
			getTranscript(mockCtx, {
				id: 'job-123',
				accept: 'application/vnd.rev.transcript.v1.0+json',
			}),
		).resolves.toEqual({ monologues: [] });
	});

	it('getTranscript accepts vendor JSON transcript objects', async () => {
		(client.makeRevAIRequest as jest.Mock).mockResolvedValue({
			monologues: [],
			vendor: 'rev',
		});

		await expect(
			getTranscript(mockCtx, {
				id: 'job-123',
				accept: 'application/vnd.rev.transcript.v1.0+json',
			}),
		).resolves.toEqual({ monologues: [], vendor: 'rev' });
	});
});
