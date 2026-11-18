import { makeYoutubeRequest } from '../client';
import type { YoutubeContext } from '../index';
import { list } from './videos';

jest.mock('../client', () => ({ makeYoutubeRequest: jest.fn() }));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeYoutubeRequest as jest.MockedFunction<
	typeof makeYoutubeRequest
>;

function makeCtx(): YoutubeContext {
	return { key: 'test-key', options: {}, db: {} } as unknown as YoutubeContext;
}

describe('youtube videos.list', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('returns the search page tokens alongside the hydrated videos', async () => {
		mockRequest
			.mockResolvedValueOnce({
				items: [{ id: { videoId: 'vid1' } }, { id: { videoId: 'vid2' } }],
				nextPageToken: 'PAGE2',
				prevPageToken: 'PAGE0',
				pageInfo: { totalResults: 120, resultsPerPage: 2 },
			})
			.mockResolvedValueOnce({
				kind: 'youtube#videoListResponse',
				items: [{ id: 'vid1' }, { id: 'vid2' }],
				pageInfo: { totalResults: 2, resultsPerPage: 2 },
			});

		const result = await list(makeCtx(), {
			channelId: 'UC123',
			maxResults: 2,
		});

		expect(mockRequest).toHaveBeenNthCalledWith(1, '/search', 'test-key', {
			method: 'GET',
			query: {
				type: 'video',
				part: 'id',
				channelId: 'UC123',
				maxResults: 2,
			},
		});
		expect(result.items?.map((v) => v.id)).toEqual(['vid1', 'vid2']);
		expect(result.nextPageToken).toBe('PAGE2');
		expect(result.prevPageToken).toBe('PAGE0');
		expect(result.pageInfo).toEqual({ totalResults: 120, resultsPerPage: 2 });
	});
});
