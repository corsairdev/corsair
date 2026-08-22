import { logEventFromContext } from 'corsair/core';
import { makeContentfulRequest } from './client';
import {
	Assets,
	ContentTypes,
	Entries,
	Environments,
	Spaces,
} from './endpoints';

jest.mock('./client', () => ({
	makeContentfulRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

describe('Contentful Endpoints', () => {
	const mockCtx = {
		key: 'test-api-key',
	} as any;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('spaces.get', () => {
		it('constructs correct URL and returns response', async () => {
			(makeContentfulRequest as jest.Mock).mockResolvedValue({
				sys: { id: 'space-123' },
			});

			const response = await Spaces.get(mockCtx, { spaceId: 'space-123' });

			expect(makeContentfulRequest).toHaveBeenCalledWith(
				'/spaces/space-123',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(logEventFromContext).toHaveBeenCalledWith(
				mockCtx,
				'contentful.spaces.get',
				{ spaceId: 'space-123' },
				'completed',
			);
			expect(response).toEqual({ sys: { id: 'space-123' } });
		});
	});

	describe('environments.get', () => {
		it('constructs correct URL and returns response', async () => {
			(makeContentfulRequest as jest.Mock).mockResolvedValue({
				sys: { id: 'master' },
			});

			const response = await Environments.get(mockCtx, {
				spaceId: 'space-123',
				environmentId: 'master',
			});

			expect(makeContentfulRequest).toHaveBeenCalledWith(
				'/spaces/space-123/environments/master',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(response).toEqual({ sys: { id: 'master' } });
		});
	});

	describe('entries.get', () => {
		it('constructs correct URL and returns response', async () => {
			(makeContentfulRequest as jest.Mock).mockResolvedValue({
				sys: { id: 'entry-123' },
			});

			const response = await Entries.get(mockCtx, {
				spaceId: 'space-123',
				environmentId: 'master',
				entryId: 'entry-123',
			});

			expect(makeContentfulRequest).toHaveBeenCalledWith(
				'/spaces/space-123/environments/master/entries/entry-123',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(response).toEqual({ sys: { id: 'entry-123' } });
		});
	});

	describe('entries.list', () => {
		it('constructs correct URL, sends query parameters, and returns response', async () => {
			(makeContentfulRequest as jest.Mock).mockResolvedValue({
				sys: { type: 'Array' },
				items: [],
			});

			const response = await Entries.list(mockCtx, {
				spaceId: 'space-123',
				environmentId: 'master',
				skip: 10,
				limit: 20,
				query: { 'sys.id': 'entry-123' },
			});

			expect(makeContentfulRequest).toHaveBeenCalledWith(
				'/spaces/space-123/environments/master/entries',
				'test-api-key',
				{
					method: 'GET',
					query: {
						skip: 10,
						limit: 20,
						'sys.id': 'entry-123',
					},
				},
			);
			expect(response).toEqual({ sys: { type: 'Array' }, items: [] });
		});
	});

	describe('entries.create', () => {
		it('constructs correct URL and payload and returns response', async () => {
			(makeContentfulRequest as jest.Mock).mockResolvedValue({
				sys: { id: 'new-entry' },
			});

			const response = await Entries.create(mockCtx, {
				spaceId: 'space-123',
				environmentId: 'master',
				contentTypeId: 'post',
				fields: { title: { 'en-US': 'Hello' } },
			});

			expect(makeContentfulRequest).toHaveBeenCalledWith(
				'/spaces/space-123/environments/master/entries',
				'test-api-key',
				{
					method: 'POST',
					headers: { 'X-Contentful-Content-Type': 'post' },
					body: { fields: { title: { 'en-US': 'Hello' } } },
				},
			);
			expect(response).toEqual({ sys: { id: 'new-entry' } });
		});
	});

	describe('entries.update', () => {
		it('constructs correct URL and payload and returns response', async () => {
			(makeContentfulRequest as jest.Mock).mockResolvedValue({
				sys: { id: 'entry-123', version: 3 },
			});

			const response = await Entries.update(mockCtx, {
				spaceId: 'space-123',
				environmentId: 'master',
				entryId: 'entry-123',
				version: 2,
				fields: { title: { 'en-US': 'Updated' } },
			});

			expect(makeContentfulRequest).toHaveBeenCalledWith(
				'/spaces/space-123/environments/master/entries/entry-123',
				'test-api-key',
				{
					method: 'PUT',
					headers: { 'X-Contentful-Version': '2' },
					body: { fields: { title: { 'en-US': 'Updated' } } },
				},
			);
			expect(response).toEqual({ sys: { id: 'entry-123', version: 3 } });
		});
	});

	describe('content_types.get', () => {
		it('constructs correct URL and returns response', async () => {
			(makeContentfulRequest as jest.Mock).mockResolvedValue({
				sys: { id: 'post' },
			});

			const response = await ContentTypes.get(mockCtx, {
				spaceId: 'space-123',
				environmentId: 'master',
				contentTypeId: 'post',
			});

			expect(makeContentfulRequest).toHaveBeenCalledWith(
				'/spaces/space-123/environments/master/content_types/post',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(response).toEqual({ sys: { id: 'post' } });
		});
	});

	describe('content_types.list', () => {
		it('constructs correct URL and returns response', async () => {
			(makeContentfulRequest as jest.Mock).mockResolvedValue({
				sys: { type: 'Array' },
				items: [],
			});

			const response = await ContentTypes.list(mockCtx, {
				spaceId: 'space-123',
				environmentId: 'master',
			});

			expect(makeContentfulRequest).toHaveBeenCalledWith(
				'/spaces/space-123/environments/master/content_types',
				'test-api-key',
				{
					method: 'GET',
					query: {
						skip: undefined,
						limit: undefined,
					},
				},
			);
			expect(response).toEqual({ sys: { type: 'Array' }, items: [] });
		});
	});

	describe('assets.get', () => {
		it('constructs correct URL and returns response', async () => {
			(makeContentfulRequest as jest.Mock).mockResolvedValue({
				sys: { id: 'asset-123' },
			});

			const response = await Assets.get(mockCtx, {
				spaceId: 'space-123',
				environmentId: 'master',
				assetId: 'asset-123',
			});

			expect(makeContentfulRequest).toHaveBeenCalledWith(
				'/spaces/space-123/environments/master/assets/asset-123',
				'test-api-key',
				{ method: 'GET' },
			);
			expect(response).toEqual({ sys: { id: 'asset-123' } });
		});
	});

	describe('assets.list', () => {
		it('constructs correct URL and returns response', async () => {
			(makeContentfulRequest as jest.Mock).mockResolvedValue({
				sys: { type: 'Array' },
				items: [],
			});

			const response = await Assets.list(mockCtx, {
				spaceId: 'space-123',
				environmentId: 'master',
			});

			expect(makeContentfulRequest).toHaveBeenCalledWith(
				'/spaces/space-123/environments/master/assets',
				'test-api-key',
				{
					method: 'GET',
					query: {
						skip: undefined,
						limit: undefined,
					},
				},
			);
			expect(response).toEqual({ sys: { type: 'Array' }, items: [] });
		});
	});
});
