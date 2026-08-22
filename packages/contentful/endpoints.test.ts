import { logEventFromContext } from 'corsair/core';
import { makeContentfulRequest } from './client';
import { Entries, Environments, Spaces } from './endpoints';

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
});
