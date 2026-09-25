import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from './client';
import { Feed } from './endpoints';
import type { FeedListResponse } from './index';
import { TEST_KEY, testContext } from './test-utils';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeRemoetRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeRemoetRequest);
const mockLog = jest.mocked(logEventFromContext);

const context = testContext();
const KEY = TEST_KEY;

const feedFixture: FeedListResponse = {
	hasNextPage: true,
	filtersApplied: false,
	nextCursor: 'cursor-2',
	entries: [
		{
			id: '65f0000000000000000000f1',
			kind: 'item',
			date: '2026-09-24T00:00:00.000Z',
			item: {
				id: '65f0000000000000000000f1',
				type: 'new_jobs',
				listingId: '65f0000000000000000000b1',
				isStarred: true,
				listingName: 'Starburst',
				listingSlug: 'starburst',
				listingImage: null,
				jobs: [
					{
						id: '65f0000000000000000000a1',
						isActive: true,
						savedJobId: null,
						matchesFilters: true,
						title: 'Senior Backend Engineer',
						url: null,
						remotePolicy: 'remote',
						remoteRestrictions: null,
						techStack: ['Java'],
						salaryEnriched: null,
						experienceLevel: 'senior',
						isOnPublishablePlatform: true,
						postingCount: 1,
					},
				],
				jobCount: 1,
				createdAt: '2026-09-24T00:00:00.000Z',
			},
		},
		{
			id: '65f0000000000000000000f2',
			kind: 'blog',
			date: '2026-09-23T00:00:00.000Z',
			blogPost: {
				id: '65f0000000000000000000f3',
				createdAt: '2026-09-20T00:00:00.000Z',
				updatedAt: '2026-09-20T00:00:00.000Z',
				publishedAt: '2026-09-20T00:00:00.000Z',
				isPublished: true,
				isFeatured: false,
				views: 100,
				image: 'https://remoet.dev/blog/cover.png',
				title: 'How Remoet tracks jobs',
				slug: 'how-remoet-tracks-jobs',
				description: 'A look under the hood.',
				tags: ['product'],
				readingTime: 4,
				audience: 'consumer',
			},
		},
		{
			id: '65f0000000000000000000f4',
			kind: 'job_of_the_day',
			date: '2026-09-22T00:00:00.000Z',
			jobOfTheDay: {
				id: '65f0000000000000000000f5',
				listingId: '65f0000000000000000000b1',
				listingName: 'Starburst',
				listingSlug: 'starburst',
				listingImage: null,
				job: {
					id: '65f0000000000000000000a2',
					isActive: true,
					savedJobId: null,
					title: 'Staff Engineer',
					url: null,
					remotePolicy: 'hybrid',
					remoteRestrictions: null,
					techStack: ['Go'],
					salaryEnriched: null,
					experienceLevel: 'senior',
					isOnPublishablePlatform: true,
				},
				nbrOfStars: 12,
				createdAt: '2026-09-22T00:00:00.000Z',
			},
		},
		{
			id: '65f0000000000000000000f6',
			kind: 'broadcast',
			date: '2026-09-21T00:00:00.000Z',
			broadcast: {
				id: '65f0000000000000000000f7',
				title: 'New feature',
				body: 'We shipped something.',
				createdAt: '2026-09-21T00:00:00.000Z',
			},
		},
	],
};

describe('Remoet feed.list', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('reads a page with pageSize and cursor, parsing every entry kind', async () => {
		mockRequest.mockResolvedValueOnce(feedFixture);

		const response = await Feed.list(context, {
			pageSize: 20,
			cursor: 'cursor-1',
		});

		expect(response.entries.map((e) => e.kind)).toEqual([
			'item',
			'blog',
			'job_of_the_day',
			'broadcast',
		]);
		expect(response.entries[0]?.item?.jobs[0]?.matchesFilters).toBe(true);
		expect(response.entries[0]?.item?.jobs[0]?.postingCount).toBe(1);
		expect(response.entries[1]?.blogPost?.slug).toBe('how-remoet-tracks-jobs');
		expect(response.entries[2]?.jobOfTheDay?.job.title).toBe('Staff Engineer');
		// A job-of-the-day job never reports postingCount, unlike an item's job.
		expect(response.entries[2]?.jobOfTheDay?.job.postingCount).toBeUndefined();
		expect(response.entries[3]?.broadcast?.body).toBe('We shipped something.');
		expect(response.nextCursor).toBe('cursor-2');
		expect(mockRequest).toHaveBeenCalledWith('/user/feed', KEY, {
			method: 'GET',
			query: { pageSize: 20, cursor: 'cursor-1' },
		});
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'remoet.feed.list',
			{ resultCount: 4, hasNextPage: true },
			'completed',
		);
	});

	it('leaves pageSize and cursor undefined when omitted', async () => {
		mockRequest.mockResolvedValueOnce({
			hasNextPage: false,
			filtersApplied: false,
			nextCursor: null,
			entries: [],
		});

		await Feed.list(context, {});

		expect(mockRequest).toHaveBeenCalledWith('/user/feed', KEY, {
			method: 'GET',
			query: { pageSize: undefined, cursor: undefined },
		});
	});

	it('allows a blog post missing its editorial fields', async () => {
		mockRequest.mockResolvedValueOnce({
			hasNextPage: false,
			filtersApplied: false,
			nextCursor: null,
			entries: [
				{
					id: '65f0000000000000000000f8',
					kind: 'blog',
					date: '2025-01-01T00:00:00.000Z',
					blogPost: {
						id: '65f0000000000000000000f9',
						createdAt: '2025-01-01T00:00:00.000Z',
						updatedAt: '2025-01-01T00:00:00.000Z',
						publishedAt: '2025-01-01T00:00:00.000Z',
						isPublished: true,
						title: 'A post without editorial fields',
						slug: 'a-post-without-editorial-fields',
						description: 'No image, tags or readingTime.',
					},
				},
			],
		});

		const response = await Feed.list(context, {});

		expect(response.entries[0]?.blogPost?.readingTime).toBeUndefined();
		expect(response.entries[0]?.blogPost?.audience).toBeUndefined();
	});

	it('parses an entry kind it does not know yet', async () => {
		mockRequest.mockResolvedValueOnce({
			hasNextPage: false,
			filtersApplied: false,
			nextCursor: null,
			entries: [
				{
					id: '65f0000000000000000000fa',
					kind: 'poll',
					date: '2025-01-01T00:00:00.000Z',
				},
			],
		});

		const response = await Feed.list(context, {});

		expect(response.entries[0]?.kind).toBe('poll');
	});

	it('rejects an out-of-range pageSize, an over-long cursor and unknown keys', async () => {
		await expect(Feed.list(context, { pageSize: 0 })).rejects.toThrow();
		await expect(Feed.list(context, { pageSize: 51 })).rejects.toThrow();
		await expect(
			Feed.list(context, { cursor: 'x'.repeat(65) }),
		).rejects.toThrow();
		await expect(
			// @ts-expect-error: unknown key
			Feed.list(context, { limit: 20 }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
