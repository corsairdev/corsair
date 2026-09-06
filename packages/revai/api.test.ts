import * as client from './client';
import { getJob, getTranscript, submitJob } from './endpoints/jobs';

jest.mock('./client');

describe('Rev AI Endpoints', () => {
	const mockCtx = {
		key: 'test_token',
		auth: { token: 'test_token' },
	} as any;

	beforeEach(() => {
		jest.clearAllMocks();
		// Mock the logEventFromContext to do nothing
		jest.mock('corsair/core', () => ({
			logEventFromContext: jest.fn().mockResolvedValue(undefined),
		}));
	});

	it('submitJob serializes media_url to source_config.url', async () => {
		(client.makeRevAIRequest as jest.Mock).mockResolvedValue({ id: '123' });

		await submitJob(mockCtx, {
			media_url: 'https://test.com/audio.mp3',
			metadata: 'test',
			language: 'en',
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
				},
			}),
		);
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

	it('getTranscript encodes the job ID and adds accept header', async () => {
		(client.makeRevAIRequest as jest.Mock).mockResolvedValue({});

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
});
