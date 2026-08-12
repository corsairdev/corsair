import { logEventFromContext } from 'corsair/core';
import { makeAmaraRequest } from '../client';
import type { AmaraContext } from '../index';
import { create, createSubtitleLanguage, viewDetails } from './videos';

jest.mock('../client', () => ({
	makeAmaraRequest: jest.fn(),
	compactQuery: jest.requireActual('../client').compactQuery,
	encodeAmaraPathSegment:
		jest.requireActual('../client').encodeAmaraPathSegment,
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeAmaraRequest as jest.MockedFunction<
	typeof makeAmaraRequest
>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

function makeCtx(): AmaraContext {
	return {
		key: 'test-key',
		options: {},
	} as unknown as AmaraContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('videos handlers', () => {
	it('viewDetails GETs the video path and returns parsed output', async () => {
		mockRequest.mockResolvedValue({
			id: 'abc123',
			title: 'Meet Amara',
			resource_uri: 'https://amara.org/api/videos/abc123/',
		});

		const result = await viewDetails(makeCtx(), { video_id: 'abc123' });

		expect(mockRequest).toHaveBeenCalledWith('videos/abc123/', 'test-key');
		expect(result.id).toBe('abc123');
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'amara.videos.viewDetails',
			{ video_id: 'abc123' },
			'completed',
		);
	});

	it('create POSTs the input body as-is', async () => {
		mockRequest.mockResolvedValue({
			id: 'new1',
			title: 'Smoke',
			resource_uri: 'https://amara.org/api/videos/new1/',
		});

		const input = {
			video_url: 'https://example.com/v.mp4',
			title: 'Smoke',
		};
		const result = await create(makeCtx(), input);

		expect(mockRequest).toHaveBeenCalledWith('videos/', 'test-key', {
			method: 'POST',
			body: input,
		});
		expect(result.id).toBe('new1');
	});

	it('createSubtitleLanguage POSTs language_code to Amara', async () => {
		mockRequest.mockResolvedValue({
			language_code: 'fr',
			name: 'French',
			resource_uri: 'https://amara.org/api/videos/abc123/languages/fr/',
		});

		const result = await createSubtitleLanguage(makeCtx(), {
			video_id: 'abc123',
			language_code: 'fr',
			is_primary_audio_language: false,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'videos/abc123/languages/',
			'test-key',
			{
				method: 'POST',
				body: {
					language_code: 'fr',
					is_primary_audio_language: false,
				},
			},
		);
		expect(result.language_code).toBe('fr');
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'amara.videos.createSubtitleLanguage',
			{ video_id: 'abc123' },
			'completed',
		);
	});
});
