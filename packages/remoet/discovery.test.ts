import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeRemoetRequest, RemoetAPIError } from './client';
import { Companies, Jobs, SavedJobs, StarredJobs, Stars } from './endpoints';
import type {
	CompaniesGetResponse,
	CompaniesSearchResponse,
	JobsSearchResponse,
	RemoetContext,
	RemoetSavedJob,
	SavedJobsListResponse,
	StarredJobsListResponse,
} from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeRemoetRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeRemoetRequest);
const mockLog = jest.mocked(logEventFromContext);

// Fully-typed test context, as in endpoints.test.ts: only ctx.key is read.
function testContext(key: string): RemoetContext {
	return {
		db: {},
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key,
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve(key),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
	};
}

const context = testContext('remoet-test-key');
const KEY = 'remoet-test-key';

/** The error the client throws for a Remoet error response. */
function remoetError(status: number, message: string): RemoetAPIError {
	const cause = new ApiError(
		{ method: 'GET', url: '/user' },
		{
			url: 'https://api.remoet.dev/user',
			ok: false,
			status,
			statusText: '',
			body: { statusCode: status, message },
		},
		message,
	);
	return new RemoetAPIError(message, { cause });
}

const jobPosting = {
	id: '65f0000000000000000000a1',
	title: 'Senior Backend Engineer',
	company: 'Starburst',
	companySlug: 'starburst',
	url: 'https://remoet.dev/listings/starburst/jobs/senior-backend-engineer',
	applyUrl: 'https://job-boards.greenhouse.io/starburst/jobs/5432864008',
	companyUrl: 'https://starburst.io',
	location: 'Boston, MA',
	remotePolicy: 'remote',
	remoteRestrictions: null,
	experienceLevel: 'senior',
	salary: { from: 185000, to: 215000, currency: 'USD', period: 'year' },
	techStack: ['Java', 'TypeScript'],
	summary: 'Build the query engine.',
	firstSeenAt: '2026-09-23T19:42:05.197Z',
	lastVerifiedAt: '2026-09-24T01:00:00.000Z',
	duplicateCount: 1,
};

const jobsFixture: JobsSearchResponse = {
	jobs: [jobPosting],
	totalCount: 41,
	page: 2,
	pageSize: 20,
	totalPages: 3,
	hasNextPage: true,
};

const companySummary = {
	id: '65f0000000000000000000b1',
	name: 'Starburst',
	slug: 'starburst',
	url: 'https://starburst.io',
	nbrOfStars: 12,
	jobCount: 17,
	techStack: ['Java', 'TypeScript'],
	matchedTechStack: ['Java'],
	techStackCount: 40,
	experienceLevels: { junior: 0, mid: 3, senior: 14 },
	shortDescription: 'The data lakehouse company.',
	isStarred: false,
	jobPreview: ['Senior Backend Engineer'],
};

const companiesFixture: CompaniesSearchResponse = {
	listings: [companySummary],
	totalCount: 1,
	page: 1,
	pageSize: 20,
	totalPages: 1,
	hasNextPage: false,
};

const companyFixture: CompaniesGetResponse = {
	...companySummary,
	about: 'Starburst builds Trino.',
	careersUrl: 'https://starburst.io/careers',
	verified: true,
	urls: { linkedin: 'https://linkedin.com/company/starburst' },
	perks: [
		{
			id: 'p1',
			title: 'Remote stipend',
			tags: [],
			description: null,
			category: null,
		},
	],
	createdAt: '2025-01-01T00:00:00.000Z',
	updatedAt: '2026-09-01T00:00:00.000Z',
};

const starredJobsFixture: StarredJobsListResponse = {
	jobs: [
		{
			id: '65f0000000000000000000c1',
			title: 'Staff Engineer',
			url: 'https://example.com/jobs/1',
			createdAt: '2026-09-20T00:00:00.000Z',
			remotePolicy: 'hybrid',
			remoteRestrictions: null,
			techStack: ['Go'],
			salaryEnriched: null,
			experienceLevel: 'senior',
			benefits: [],
			summary: null,
			isOnPublishablePlatform: true,
			listing: {
				id: '65f0000000000000000000b1',
				name: 'Starburst',
				slug: 'starburst',
			},
			postingCount: 2,
			postingLocations: ['Boston', 'Remote'],
		},
	],
	totalCount: 1,
	totalPages: 1,
	page: 1,
	pageSize: 20,
	hasNextPage: false,
	starsOverCap: {
		surplusStars: 2,
		maxActiveStars: 10,
		starsPendingDeletionAt: '2026-10-01T00:00:00.000Z',
		note: 'Surface this to the user.',
	},
};

const savedJob: RemoetSavedJob = {
	id: '65f0000000000000000000d1',
	jobId: '65f0000000000000000000a1',
	jobType: 'ai_job',
	note: 'Great stack',
	savedAt: '2026-09-22T00:00:00.000Z',
	job: {
		title: 'Senior Backend Engineer',
		listingId: '65f0000000000000000000b1',
		techStack: ['Java'],
		remotePolicy: 'remote',
		experienceLevel: 'senior',
		salaryMin: 185000,
		salaryMax: null,
		salaryCurrency: 'USD',
		applicationUrl: null,
		isActive: true,
		deactivatedAt: null,
	},
};

// Shape of a row whose job the user can no longer see.
const lockedSavedJob = {
	id: '65f0000000000000000000d2',
	jobId: '65f0000000000000000000a2',
	jobType: 'ai_job',
	note: null,
	savedAt: '2026-09-21T00:00:00.000Z',
	job: null,
	locked: true,
	lockedReason: 'Star Starburst to see this job again.',
};

const savedJobsFixture: SavedJobsListResponse = {
	items: [savedJob, lockedSavedJob],
	totalCount: 2,
	page: 1,
	pageSize: 20,
	totalPages: 1,
	hasNextPage: false,
};

describe('Remoet discovery endpoints', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('jobs.search', () => {
		it('passes every list filter through as an array for repeated keys', async () => {
			mockRequest.mockResolvedValueOnce(jobsFixture);

			const response = await Jobs.search(context, {
				searchQuery: 'backend',
				techStack: ['Go', 'TypeScript'],
				techStackMatch: 'all',
				companySlug: ' Starburst ',
				remotePolicy: ['remote', 'hybrid'],
				experienceLevel: ['senior'],
				salaryMin: 150000,
				location: ['Portland, OR', 'Germany'],
				sortBy: 'salary',
				sortOrder: 'desc',
				page: 2,
				pageSize: 20,
			});

			expect(response.jobs[0]?.firstSeenAt).toBe('2026-09-23T19:42:05.197Z');
			expect(response.hasNextPage).toBe(true);
			expect(mockRequest).toHaveBeenCalledWith('/user/job-postings', KEY, {
				method: 'GET',
				query: {
					searchQuery: 'backend',
					techStack: ['Go', 'TypeScript'],
					techStackMatch: 'all',
					companySlug: 'starburst',
					remotePolicy: ['remote', 'hybrid'],
					experienceLevel: ['senior'],
					salaryMin: 150000,
					location: ['Portland, OR', 'Germany'],
					sortBy: 'salary',
					sortOrder: 'desc',
					page: 2,
					pageSize: 20,
				},
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.jobs.search',
				{ page: 2, resultCount: 1, totalCount: 41 },
				'completed',
			);
		});

		it('leaves unset filters undefined and passes an empty list through', async () => {
			mockRequest.mockResolvedValueOnce({
				...jobsFixture,
				jobs: [],
				totalCount: 0,
				hint: 'No public roles matched.',
			});

			const response = await Jobs.search(context, { techStack: [] });

			expect(response.hint).toBe('No public roles matched.');
			const query = mockRequest.mock.calls[0]?.[2]?.query ?? {};
			// The transport sends nothing for an empty array (see plugin.test.ts).
			expect(
				Object.entries(query).filter(([, value]) => value !== undefined),
			).toEqual([['techStack', []]]);
		});

		it('rejects out-of-range paging and bad enums before calling Remoet', async () => {
			await expect(Jobs.search(context, { pageSize: 51 })).rejects.toThrow();
			await expect(Jobs.search(context, { page: 0 })).rejects.toThrow();
			await expect(Jobs.search(context, { salaryMin: -1 })).rejects.toThrow();
			await expect(
				Jobs.search(context, {
					// @ts-expect-error: not a Remoet remote policy
					remotePolicy: ['anywhere'],
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('companies.search', () => {
		it('sends its filters and paging', async () => {
			mockRequest.mockResolvedValueOnce(companiesFixture);

			const response = await Companies.search(context, {
				searchQuery: 'data',
				techStack: ['Java', 'Trino'],
				experienceLevel: ['mid', 'senior'],
				sortBy: 'jobCount',
				page: 1,
				pageSize: 100,
			});

			expect(response.listings[0]?.matchedTechStack).toEqual(['Java']);
			expect(mockRequest).toHaveBeenCalledWith('/user/companies', KEY, {
				method: 'GET',
				query: {
					starred: undefined,
					searchQuery: 'data',
					techStack: ['Java', 'Trino'],
					techStackMatch: undefined,
					experienceLevel: ['mid', 'senior'],
					sortBy: 'jobCount',
					page: 1,
					pageSize: 100,
				},
			});
		});

		it('accepts the unpaginated starred mode', async () => {
			mockRequest.mockResolvedValueOnce({
				listings: [companySummary],
				totalCount: 1,
				starred: true,
			});

			const response = await Companies.search(context, { starred: true });

			expect(response.starred).toBe(true);
			expect(response.page).toBeUndefined();
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.companies.search',
				{ starred: true, resultCount: 1, totalCount: 1 },
				'completed',
			);
		});

		it('rejects a page size over 100', async () => {
			await expect(
				Companies.search(context, { pageSize: 101 }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('companies.get', () => {
		it('reads a company by encoded slug with checkTechStack as a list', async () => {
			mockRequest.mockResolvedValueOnce(companyFixture);

			const response = await Companies.get(context, {
				slug: 'Monday.com',
				checkTechStack: ['Java', 'Rust'],
			});

			expect(response.about).toBe('Starburst builds Trino.');
			expect(mockRequest).toHaveBeenCalledWith(
				'/user/companies/monday.com',
				KEY,
				{ method: 'GET', query: { checkTechStack: ['Java', 'Rust'] } },
			);
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.companies.get',
				{ id: companySummary.id, slug: 'starburst' },
				'completed',
			);
		});

		it('rejects more than 50 technologies to check', async () => {
			await expect(
				Companies.get(context, {
					slug: 'starburst',
					checkTechStack: Array.from({ length: 51 }, (_, i) => `t${i}`),
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('starredJobs.list', () => {
		it('sends its filters and reports the over-cap notice', async () => {
			mockRequest.mockResolvedValueOnce(starredJobsFixture);

			const response = await StarredJobs.list(context, {
				locationQuery: 'Boston',
				techStack: ['Go'],
				remotePolicy: ['hybrid', 'remote-restricted'],
				sortBy: 'salaryEnriched.from',
				page: 1,
				pageSize: 50,
			});

			expect(response.jobs[0]?.listing.slug).toBe('starburst');
			expect(response.starsOverCap?.surplusStars).toBe(2);
			expect(mockRequest).toHaveBeenCalledWith('/user/starred-jobs', KEY, {
				method: 'GET',
				query: {
					searchQuery: undefined,
					locationQuery: 'Boston',
					techStack: ['Go'],
					techStackMatch: undefined,
					remotePolicy: ['hybrid', 'remote-restricted'],
					experienceLevel: undefined,
					salaryMin: undefined,
					sortBy: 'salaryEnriched.from',
					sortOrder: undefined,
					page: 1,
					pageSize: 50,
				},
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.starredJobs.list',
				{ page: 1, resultCount: 1, totalCount: 1 },
				'completed',
			);
		});
	});

	describe('savedJobs', () => {
		it('lists saved jobs, including a locked row', async () => {
			mockRequest.mockResolvedValueOnce(savedJobsFixture);

			const response = await SavedJobs.list(context, { page: 1, pageSize: 20 });

			const [open, locked] = response.items;
			expect(open?.job?.title).toBe('Senior Backend Engineer');
			expect(open?.locked).toBeUndefined();
			expect(locked?.job).toBeNull();
			expect(locked?.locked).toBe(true);
			expect(locked?.lockedReason).toBe(
				'Star Starburst to see this job again.',
			);
			expect(mockRequest).toHaveBeenCalledWith('/user/saved-jobs', KEY, {
				method: 'GET',
				query: { page: 1, pageSize: 20 },
			});
		});

		it('creates a saved job', async () => {
			mockRequest.mockResolvedValueOnce(savedJob);

			const response = await SavedJobs.create(context, {
				jobId: savedJob.jobId,
				note: 'Great stack',
			});

			expect(response.id).toBe(savedJob.id);
			expect(mockRequest).toHaveBeenCalledWith('/user/saved-jobs', KEY, {
				method: 'POST',
				body: { jobId: savedJob.jobId, note: 'Great stack' },
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.savedJobs.create',
				{ id: savedJob.id, jobId: savedJob.jobId },
				'completed',
			);
		});

		it('surfaces a 404 when the job is unknown or not viewable', async () => {
			mockRequest.mockRejectedValueOnce(remoetError(404, 'Job not found'));

			await expect(
				SavedJobs.create(context, { jobId: '65f0000000000000000000ff' }),
			).rejects.toMatchObject({ status: 404, message: 'Job not found' });
			expect(mockLog).not.toHaveBeenCalled();
		});

		it('rejects a malformed job id before calling Remoet', async () => {
			await expect(
				SavedJobs.create(context, { jobId: 'not-an-id' }),
			).rejects.toThrow();
			await expect(
				SavedJobs.create(context, {
					jobId: savedJob.jobId,
					note: 'x'.repeat(501),
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('updates and clears the note by saved-job id', async () => {
			mockRequest.mockResolvedValueOnce({ ...savedJob, note: null });

			const response = await SavedJobs.update(context, {
				savedJobId: savedJob.id,
				note: null,
			});

			expect(response.note).toBeNull();
			expect(mockRequest).toHaveBeenCalledWith(
				`/user/saved-jobs/${savedJob.id}`,
				KEY,
				{ method: 'PATCH', body: { note: null } },
			);
		});

		it('deletes by saved-job id', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: true, id: savedJob.id });

			const response = await SavedJobs.delete(context, {
				savedJobId: savedJob.id,
			});

			expect(response).toEqual({ deleted: true, id: savedJob.id });
			expect(mockRequest).toHaveBeenCalledWith(
				`/user/saved-jobs/${savedJob.id}`,
				KEY,
				{ method: 'DELETE' },
			);
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.savedJobs.delete',
				{ id: savedJob.id },
				'completed',
			);
		});
	});

	describe('stars.delete', () => {
		it('unstars by encoded, lowercased slug', async () => {
			mockRequest.mockResolvedValueOnce({ company: 'Starburst' });

			const response = await Stars.delete(context, {
				companySlug: 'Starburst',
			});

			expect(response.company).toBe('Starburst');
			expect(mockRequest).toHaveBeenCalledWith('/user/stars/starburst', KEY, {
				method: 'DELETE',
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.stars.delete',
				{ companySlug: 'starburst', company: 'Starburst' },
				'completed',
			);
		});

		it('surfaces a 409 when the unstar budget is spent', async () => {
			mockRequest.mockRejectedValueOnce(
				remoetError(
					409,
					'You have used all 5 unstar operations for this period. Your budget resets on 2026-10-20T00:00:00.000Z.',
				),
			);

			await expect(
				Stars.delete(context, { companySlug: 'starburst' }),
			).rejects.toMatchObject({
				status: 409,
				message:
					'You have used all 5 unstar operations for this period. Your budget resets on 2026-10-20T00:00:00.000Z.',
			});
		});

		it('surfaces a 404 when the company is not starred', async () => {
			mockRequest.mockRejectedValueOnce(
				remoetError(404, 'You have not starred that company'),
			);

			await expect(
				Stars.delete(context, { companySlug: 'starburst' }),
			).rejects.toMatchObject({ status: 404 });
		});
	});
});
