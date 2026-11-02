import { recallai } from './index';

jest.mock('./client', () => {
	const makeRecallaiRequest = jest.fn();
	return {
		makeRecallaiRequest,
		makeRecallaiContextRequest: jest.fn((ctx, path, options) =>
			makeRecallaiRequest(path, ctx.key, options),
		),
	};
});

import { makeRecallaiRequest } from './client';
import { recallaiTestContext } from './test-context';

const artifact = {
	id: '550e8400-e29b-41d4-a716-446655440000',
	recording: { id: '550e8400-e29b-41d4-a716-446655440001' },
	created_at: '2026-01-01T00:00:00.000Z',
	status: {
		code: 'done',
		sub_code: null,
		updated_at: '2026-01-01T00:00:00.000Z',
	},
	metadata: {},
	data: { download_url: 'https://downloads.example.test/transcript.json' },
};

describe('Recall.ai transcript and participant-event endpoints', () => {
	it('lists transcripts with documented filters', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValueOnce({
			next: null,
			previous: null,
			results: [artifact],
		});
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await expect(
			plugin.endpoints.transcripts.list(recallaiTestContext, {
				recording_id: '550e8400-e29b-41d4-a716-446655440001',
				status_code: 'done',
			}),
		).resolves.toEqual({ next: null, previous: null, results: [artifact] });
		expect(request).toHaveBeenCalledWith('/api/v1/transcript/', 'recall-key', {
			method: 'GET',
			query: {
				recording_id: '550e8400-e29b-41d4-a716-446655440001',
				status_code: 'done',
			},
		});
	});

	it('retrieves a transcript artifact', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockResolvedValue(artifact);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');

		await plugin.endpoints.transcripts.retrieve(recallaiTestContext, {
			id: artifact.id,
		});
		expect(request).toHaveBeenCalledWith(
			`/api/v1/transcript/${artifact.id}/`,
			'recall-key',
			{ method: 'GET' },
		);
	});

	it('lists, retrieves, and updates participant-event artifacts', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockClear();
		request
			.mockResolvedValueOnce({
				next: null,
				previous: null,
				results: [artifact],
			})
			.mockResolvedValue(artifact);
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		const ctx = recallaiTestContext;

		await plugin.endpoints.participantEvents.list(ctx, {
			cursor: 'next',
			status_code: 'processing',
		});
		await plugin.endpoints.participantEvents.retrieve(ctx, { id: artifact.id });
		await plugin.endpoints.participantEvents.update(ctx, {
			id: artifact.id,
			metadata: { source: 'test' },
		});

		expect(request).toHaveBeenNthCalledWith(
			1,
			'/api/v1/participant_events/',
			'recall-key',
			{
				method: 'GET',
				query: { cursor: 'next', status_code: 'processing' },
			},
		);
		expect(request).toHaveBeenNthCalledWith(
			2,
			`/api/v1/participant_events/${artifact.id}/`,
			'recall-key',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenNthCalledWith(
			3,
			`/api/v1/participant_events/${artifact.id}/`,
			'recall-key',
			{
				method: 'PATCH',
				body: { metadata: { source: 'test' } },
			},
		);
	});

	it('rejects unsafe artifact identifiers before transport', async () => {
		const request = jest.mocked(makeRecallaiRequest);
		request.mockClear();
		const plugin = recallai({ key: 'recall-key' });
		if (!plugin.endpoints) throw new Error('Recall.ai endpoints are missing');
		await expect(
			plugin.endpoints.transcripts.retrieve(recallaiTestContext, {
				id: '../secret',
			}),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});
});
