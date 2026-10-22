import { logEventFromContext } from 'corsair/core';
import type { ZodType, z } from 'zod';
import { makeRemoetRequest } from './client';
import {
	Companies,
	Education,
	Feed,
	JobContext,
	Jobs,
	LinkTrees,
	Profile,
	Projects,
	SavedJobs,
	StarredJobs,
	Stars,
	WorkExperience,
} from './endpoints';
import type {
	CompaniesGetResponse,
	CompaniesSearchResponse,
	EducationCreateInput,
	EducationCreateResponse,
	EducationListResponse,
	FeedListResponse,
	JobContextGetResponse,
	JobsSearchResponse,
	LinkTreesGetResponse,
	ProfileGetLinksResponse,
	ProfileGetResponse,
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsListResponse,
	RemoetContext,
	RemoetSavedJob,
	SavedJobsListResponse,
	StarredJobsListResponse,
	WorkExperienceCreateInput,
	WorkExperienceCreateResponse,
	WorkExperienceListResponse,
} from './index';
import { remoet, remoetEndpointSchemas } from './index';
import { remoetError, TEST_KEY, testContext } from './test-utils';

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

const workExperienceFixture: WorkExperienceListResponse = [
	{
		id: '65f000000000000000000010',
		createdAt: '2025-01-01T00:00:00.000Z',
		updatedAt: '2025-02-01T00:00:00.000Z',
		userId: '65f000000000000000000001',
		title: 'Staff Engineer',
		startDate: '2024-03-01T00:00:00.000Z',
		endDate: null,
		isCurrent: true,
		isPublic: true,
		companyName: 'Example Co',
		technologies: ['TypeScript', 'Go'],
		description: 'Platform work.',
		isRemote: false,
		companyUrl: 'https://example.com',
		listingId: null,
	},
];

const projectsFixture: ProjectsListResponse = [
	{
		id: '65f000000000000000000011',
		title: 'corsair-remoet',
		shortDescription: 'A Corsair plugin',
		technologies: ['TypeScript'],
		isCurrent: true,
		isRemote: true,
		isOpenSource: true,
		description: null,
		role: 'Author',
		startDate: '2026-09-01T00:00:00.000Z',
		endDate: null,
		repoUrl: 'https://github.com/example/corsair',
		demoUrl: null,
		jobId: null,
	},
];

const educationFixture: EducationListResponse = [
	{
		id: '65f000000000000000000012',
		institution: 'Example University',
		institutionUrl: null,
		studyLevel: 'Bachelor',
		fieldOfStudy: 'Computer Science',
		startDate: '2012-09-01T00:00:00.000Z',
		endDate: '2015-06-01T00:00:00.000Z',
		isCurrent: false,
		description: null,
	},
];

const linkTreeFixture: LinkTreesGetResponse = {
	id: '65f000000000000000000002',
	title: 'My links',
	description: null,
	slug: 'my links',
	links: [
		{
			id: '65f000000000000000000003',
			label: 'GitHub',
			url: 'https://github.com/example',
		},
	],
	createdAt: '2026-01-01T00:00:00.000Z',
	updatedAt: '2026-01-02T00:00:00.000Z',
};

const field = (value: string | null, isPublic = true) => ({ value, isPublic });

const profileFixture: ProfileGetResponse = {
	createdAt: '2025-01-01T00:00:00.000Z',
	updatedAt: '2026-01-01T00:00:00.000Z',
	ghId: 1234567,
	email: 'dev@example.com',
	profile: {
		updatedAt: '2026-01-01T00:00:00.000Z',
		isPublic: true,
		slug: 'dev',
		name: field('Dev Example'),
		avatarUrl: field(null),
		phone: field('+46 70 000 00 00', false),
		url: field('https://example.com'),
		summary: field('Builds things.'),
		location: field('Stockholm'),
		githubUrl: field('https://github.com/example'),
		facebookUrl: field(null),
		twitterUrl: field(null),
		linkedinUrl: field('https://linkedin.com/in/example'),
		youtubeUrl: field(null),
	},
	jobs: workExperienceFixture,
	projects: projectsFixture,
	linkTrees: [linkTreeFixture],
	education: educationFixture,
};

const linksFixture: ProfileGetLinksResponse = {
	url: 'https://example.com',
	githubUrl: 'https://github.com/example',
	facebookUrl: null,
	twitterUrl: null,
	linkedinUrl: null,
	youtubeUrl: null,
};

// Shape captured from a live GET /user/job-context response.
const jobContextFixture: JobContextGetResponse = {
	match: {
		company: 'Starburst',
		companySlug: 'starburst',
		firstSeenAt: '2026-09-23T19:42:05.197Z',
		daysSinceFirstSeen: 0,
		firstSeenAtIsCensored: true,
		isActive: true,
		deactivatedAt: null,
		reposts: [],
		otherOpenRoles: 16,
		isStarred: false,
		techStack: ['Java', 'TypeScript'],
		remotePolicy: 'remote',
		remoteRestrictions: null,
		salary: { from: 185000, to: 215000, currency: 'USD', period: 'year' },
		experienceLevel: 'senior',
		summary: 'Build the query engine.',
	},
};

describe('Remoet endpoints', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('profile.get reads GET /user/full', async () => {
		mockRequest.mockResolvedValueOnce(profileFixture);

		const response = await Profile.get(context, {});

		expect(response.ghId).toBe(1234567);
		expect(response.profile.name?.value).toBe('Dev Example');
		expect(response.jobs[0]?.endDate).toBeNull();
		expect(mockRequest).toHaveBeenCalledWith('/user/full', 'remoet-test-key', {
			method: 'GET',
		});
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'remoet.profile.get',
			{ jobs: 1, projects: 1, education: 1, linkTrees: 1 },
			'completed',
		);
	});

	it('profile.get accepts a user without GitHub and extra DataField keys', async () => {
		const { ghId: _ghId, ...withoutGithub } = profileFixture;
		mockRequest.mockResolvedValueOnce({
			...withoutGithub,
			profile: {
				...profileFixture.profile,
				name: { value: 'Dev', isPublic: true, source: 'cv' },
			},
		});

		const response = await Profile.get(context, {});

		expect(response.ghId).toBeUndefined();
		expect(response.profile.name).toMatchObject({ value: 'Dev', source: 'cv' });
	});

	it('profile.getLinks reads GET /user/links', async () => {
		mockRequest.mockResolvedValueOnce(linksFixture);

		const response = await Profile.getLinks(context, {});

		expect(response.githubUrl).toBe('https://github.com/example');
		expect(response.linkedinUrl).toBeNull();
		expect(mockRequest).toHaveBeenCalledWith('/user/links', 'remoet-test-key', {
			method: 'GET',
		});
	});

	it('profile.update PATCHes only the provided, trimmed fields', async () => {
		mockRequest.mockResolvedValueOnce({ updated: ['phone', 'location'] });

		const response = await Profile.update(context, {
			phone: '  +46 70 000 00 00 ',
			location: 'Stockholm',
		});

		expect(response.updated).toEqual(['phone', 'location']);
		expect(mockRequest).toHaveBeenCalledWith(
			'/user/profile',
			'remoet-test-key',
			{
				method: 'PATCH',
				body: { phone: '+46 70 000 00 00', location: 'Stockholm' },
			},
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'remoet.profile.update',
			{ updated: ['phone', 'location'] },
			'completed',
		);
	});

	it('profile.update clears fields with null and sets visibility', async () => {
		mockRequest.mockResolvedValueOnce({
			updated: ['avatarUrl', 'summary', 'facebookUrl', 'visibility'],
		});

		const response = await Profile.update(context, {
			avatarUrl: null,
			summary: null,
			facebookUrl: null,
			twitterUrl: null,
			youtubeUrl: null,
			visibility: 'STARRED',
		});

		expect(response.updated).toEqual([
			'avatarUrl',
			'summary',
			'facebookUrl',
			'visibility',
		]);
		expect(mockRequest).toHaveBeenCalledWith(
			'/user/profile',
			'remoet-test-key',
			{
				method: 'PATCH',
				body: {
					avatarUrl: null,
					summary: null,
					facebookUrl: null,
					twitterUrl: null,
					youtubeUrl: null,
					visibility: 'STARRED',
				},
			},
		);
	});

	it('profile.update refuses a summary over 5000 characters without calling Remoet', async () => {
		await expect(
			Profile.update(context, { summary: 'x'.repeat(5001) }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('workExperience.list reads GET /user/jobs', async () => {
		mockRequest.mockResolvedValueOnce(workExperienceFixture);

		const response = await WorkExperience.list(context, {});

		expect(response[0]?.companyName).toBe('Example Co');
		expect(response[0]?.isCurrent).toBe(true);
		expect(mockRequest).toHaveBeenCalledWith('/user/jobs', 'remoet-test-key', {
			method: 'GET',
		});
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'remoet.workExperience.list',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('projects.list reads GET /user/projects', async () => {
		mockRequest.mockResolvedValueOnce(projectsFixture);

		const response = await Projects.list(context, {});

		expect(response[0]?.isOpenSource).toBe(true);
		expect(mockRequest).toHaveBeenCalledWith(
			'/user/projects',
			'remoet-test-key',
			{ method: 'GET' },
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'remoet.projects.list',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('education.list reads GET /user/education', async () => {
		mockRequest.mockResolvedValueOnce(educationFixture);

		const response = await Education.list(context, {});

		expect(response[0]?.institution).toBe('Example University');
		expect(mockRequest).toHaveBeenCalledWith(
			'/user/education',
			'remoet-test-key',
			{ method: 'GET' },
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'remoet.education.list',
			{ resultCount: 1 },
			'completed',
		);
	});

	it('linkTrees.list reads GET /user/linktrees', async () => {
		mockRequest.mockResolvedValueOnce([linkTreeFixture]);

		const response = await LinkTrees.list(context, {});

		expect(response[0]?.links[0]?.label).toBe('GitHub');
		expect(mockRequest).toHaveBeenCalledWith(
			'/user/linktrees',
			'remoet-test-key',
			{ method: 'GET' },
		);
	});

	it('linkTrees.get URL-encodes the slug', async () => {
		mockRequest.mockResolvedValueOnce(linkTreeFixture);

		const response = await LinkTrees.get(context, { slug: 'my links' });

		expect(response.id).toBe('65f000000000000000000002');
		expect(mockRequest).toHaveBeenCalledWith(
			'/user/linktrees/my%20links',
			'remoet-test-key',
			{ method: 'GET' },
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'remoet.linkTrees.get',
			{ id: '65f000000000000000000002', slug: 'my links' },
			'completed',
		);
	});

	it('jobContext.get passes the page url as a query parameter', async () => {
		mockRequest.mockResolvedValueOnce(jobContextFixture);
		const url = 'https://job-boards.greenhouse.io/starburst/jobs/5432864008';

		const response = await JobContext.get(context, { url });

		expect(response.match?.firstSeenAtIsCensored).toBe(true);
		expect(response.match?.salary?.currency).toBe('USD');
		expect(mockRequest).toHaveBeenCalledWith(
			'/user/job-context',
			'remoet-test-key',
			{ method: 'GET', query: { url } },
		);
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'remoet.jobContext.get',
			{ matched: true, companySlug: 'starburst' },
			'completed',
		);
	});

	it('jobContext.get treats an untracked page as a normal answer', async () => {
		mockRequest.mockResolvedValueOnce({ match: null });

		const response = await JobContext.get(context, {
			url: 'https://example.com/careers/1',
		});

		expect(response.match).toBeNull();
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'remoet.jobContext.get',
			{ matched: false, companySlug: null },
			'completed',
		);
	});

	it('jobContext.get rejects a missing or malformed url', async () => {
		await expect(JobContext.get(context, { url: '' })).rejects.toThrow();
		await expect(
			JobContext.get(context, { url: 'not a url' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('stars.create POSTs the company slug', async () => {
		mockRequest.mockResolvedValueOnce({ company: 'Starburst' });

		const response = await Stars.create(context, {
			companySlug: ' Starburst ',
		});

		expect(response.company).toBe('Starburst');
		expect(mockRequest).toHaveBeenCalledWith('/user/stars', 'remoet-test-key', {
			method: 'POST',
			body: { companySlug: 'starburst' },
		});
		expect(mockLog).toHaveBeenCalledWith(
			context,
			'remoet.stars.create',
			{ companySlug: 'starburst', company: 'Starburst' },
			'completed',
		);
	});

	it('stars.create rejects an empty slug before calling Remoet', async () => {
		await expect(
			Stars.create(context, { companySlug: '  ' }),
		).rejects.toThrow();
		await expect(
			Stars.create(context, { companySlug: 'x'.repeat(101) }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects provider payloads that fail output validation', async () => {
		mockRequest.mockResolvedValue({ unexpected: 'shape' });

		await expect(Profile.get(context, {})).rejects.toThrow();
		await expect(WorkExperience.list(context, {})).rejects.toThrow();
		await expect(
			JobContext.get(context, { url: 'https://example.com/jobs/1' }),
		).rejects.toThrow();
		expect(mockRequest).toHaveBeenCalledTimes(3);
		mockRequest.mockReset();
	});
});

describe('every endpoint validates its input before calling Remoet', () => {
	const ID = '65f0000000000000000000a1';
	// One otherwise-valid input per operation, each typed by its own schema,
	// so a missing, extra or malformed row fails the typecheck.
	const validInputs: {
		[K in keyof typeof remoetEndpointSchemas]: z.input<
			(typeof remoetEndpointSchemas)[K]['input']
		>;
	} = {
		'profile.get': {},
		'profile.getLinks': {},
		'profile.update': { phone: '1' },
		'workExperience.list': {},
		'workExperience.create': { title: 'Engineer', startDate: '2024-01-15' },
		'workExperience.update': { id: ID, title: 'Engineer' },
		'workExperience.delete': { id: ID },
		'projects.list': {},
		'projects.create': { title: 'Remoet', shortDescription: 'A job board' },
		'projects.update': { id: ID, title: 'Remoet' },
		'projects.delete': { id: ID },
		'education.list': {},
		'education.create': { institution: 'Lund University' },
		'education.update': { id: ID, institution: 'Lund University' },
		'education.delete': { id: ID },
		'linkTrees.list': {},
		'linkTrees.get': { slug: 'carl' },
		'jobContext.get': { url: 'https://boards.greenhouse.io/acme/jobs/1' },
		'stars.create': { companySlug: 'starburst' },
		'stars.delete': { companySlug: 'starburst' },
		'jobs.search': { pageSize: 20 },
		'companies.search': { searchQuery: 'data' },
		'companies.get': { slug: 'starburst' },
		'starredJobs.list': { pageSize: 20 },
		'savedJobs.list': {},
		'savedJobs.create': { jobId: ID },
		'savedJobs.update': { savedJobId: ID, note: 'kept' },
		'savedJobs.delete': { savedJobId: ID },
		'feed.list': {},
	};
	// Every endpoint, widened only in its input type: this test deliberately
	// passes an input the endpoint's type forbids, to prove the runtime check
	// rejects it.
	// Only the rejection is asserted, so the response is typed loosely as an
	// object, which every operation returns.
	type AnyInputEndpoint = (ctx: RemoetContext, input: never) => Promise<object>;
	const endpoints: Record<string, Record<string, AnyInputEndpoint>> = remoet()
		.endpoints ?? {};
	const schemas: Record<string, { input: ZodType }> = remoetEndpointSchemas;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it.each(Object.entries(validInputs))(
		'%s refuses an unknown key without sending a request',
		async (path, validInput) => {
			const [group = '', name = ''] = path.split('.');
			const endpoint = endpoints[group]?.[name];
			if (!endpoint) throw new Error(`no endpoint for ${path}`);
			// The row is valid on its own, so the unknown key is the only reason
			// the call below fails.
			expect(schemas[path]?.input.safeParse(validInput).success).toBe(true);
			// `as never`: the whole point is an input the endpoint's type forbids.
			const invalid = { ...validInput, notAField: true } as never;
			await expect(endpoint(context, invalid)).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		},
	);
});

// ── Discovery endpoints (jobs, companies, starred/saved jobs, stars) ─────────

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
			// The transport sends nothing for an empty array (see api.test.ts).
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
		it('sends every schema key through to the query', async () => {
			mockRequest.mockResolvedValueOnce(companiesFixture);

			const response = await Companies.search(context, {
				starred: false,
				searchQuery: 'data',
				techStack: ['Java', 'Trino'],
				techStackMatch: 'all',
				experienceLevel: ['mid', 'senior'],
				sortBy: 'jobCount',
				page: 1,
				pageSize: 100,
			});

			expect(response.listings[0]?.matchedTechStack).toEqual(['Java']);
			expect(mockRequest).toHaveBeenCalledWith('/user/companies', KEY, {
				method: 'GET',
				query: {
					starred: false,
					searchQuery: 'data',
					techStack: ['Java', 'Trino'],
					techStackMatch: 'all',
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
		it('sends every schema key through to the query', async () => {
			mockRequest.mockResolvedValueOnce(starredJobsFixture);

			const response = await StarredJobs.list(context, {
				searchQuery: 'engineer',
				locationQuery: 'Boston',
				techStack: ['Go'],
				techStackMatch: 'any',
				remotePolicy: ['hybrid', 'remote-restricted'],
				experienceLevel: ['senior'],
				salaryMin: 150000,
				sortBy: 'salaryEnriched.from',
				sortOrder: 'desc',
				page: 1,
				pageSize: 50,
			});

			expect(response.jobs[0]?.listing.slug).toBe('starburst');
			expect(response.starsOverCap?.surplusStars).toBe(2);
			expect(mockRequest).toHaveBeenCalledWith('/user/starred-jobs', KEY, {
				method: 'GET',
				query: {
					searchQuery: 'engineer',
					locationQuery: 'Boston',
					techStack: ['Go'],
					techStackMatch: 'any',
					remotePolicy: ['hybrid', 'remote-restricted'],
					experienceLevel: ['senior'],
					salaryMin: 150000,
					sortBy: 'salaryEnriched.from',
					sortOrder: 'desc',
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

// ── Feed ─────────────────────────────────────────────────────────────────────

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

// ── Profile item writes (work experience, projects, education) ──────────────

const ITEM_ID = '65f0000000000000000000e1';

const workExperience: WorkExperienceCreateResponse = {
	id: ITEM_ID,
	createdAt: '2026-09-20T00:00:00.000Z',
	updatedAt: '2026-09-20T00:00:00.000Z',
	userId: null,
	title: 'Staff Engineer',
	startDate: '2024-01-15',
	endDate: null,
	isCurrent: true,
	isPublic: true,
	companyName: 'Example Co',
	technologies: ['TypeScript'],
	description: null,
	isRemote: true,
	companyUrl: null,
	listingId: null,
};

const project: ProjectsCreateResponse = {
	id: ITEM_ID,
	title: 'corsair-remoet',
	shortDescription: 'A Corsair plugin',
	technologies: null,
	isCurrent: null,
	isRemote: null,
	isOpenSource: true,
	description: null,
	role: null,
	startDate: null,
	endDate: null,
	repoUrl: null,
	demoUrl: null,
	jobId: null,
};

const education: EducationCreateResponse = {
	id: ITEM_ID,
	institution: 'Example University',
	institutionUrl: null,
	studyLevel: 'BACHELOR',
	fieldOfStudy: null,
	startDate: null,
	endDate: null,
	isCurrent: false,
	description: null,
};

describe('Remoet profile item writes', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('workExperience', () => {
		it('creates a work experience entry', async () => {
			mockRequest.mockResolvedValueOnce(workExperience);

			const response = await WorkExperience.create(context, {
				title: 'Staff Engineer',
				startDate: '2024-01-15',
			});

			expect(response.id).toBe(ITEM_ID);
			expect(mockRequest).toHaveBeenCalledWith('/user/jobs', KEY, {
				method: 'POST',
				body: { title: 'Staff Engineer', startDate: '2024-01-15' },
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.workExperience.create',
				{ id: ITEM_ID },
				'completed',
			);
		});

		it('rejects null, an empty or unparseable date before calling Remoet', async () => {
			// Unknown-key strictness for create is covered once, below, in the
			// shared mutation contract.
			await expect(
				WorkExperience.create(context, {
					title: 'Staff Engineer',
					startDate: '2024-01-15',
					// @ts-expect-error: null is never accepted on create
					companyName: null,
				}),
			).rejects.toThrow();
			await expect(
				WorkExperience.create(context, {
					title: 'Staff Engineer',
					startDate: '',
				}),
			).rejects.toThrow();
			await expect(
				WorkExperience.create(context, {
					title: 'Staff Engineer',
					startDate: 'not-a-date',
				}),
			).rejects.toThrow('Must be a date');
			await expect(
				WorkExperience.create(context, {
					technologies: Array.from({ length: 51 }, (_, i) => `t${i}`),
					title: 'x',
					startDate: '2024-01-15',
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it("clears companyName with '' and empties technologies with []", async () => {
			mockRequest.mockResolvedValueOnce({
				...workExperience,
				companyName: '',
				technologies: [],
			});

			const response = await WorkExperience.update(context, {
				id: ITEM_ID,
				companyName: '',
				technologies: [],
			});

			expect(response.companyName).toBe('');
			expect(mockRequest).toHaveBeenCalledWith(`/user/jobs/${ITEM_ID}`, KEY, {
				method: 'PATCH',
				body: { companyName: '', technologies: [] },
			});
		});

		it('updates by id, sending only the changed fields', async () => {
			mockRequest.mockResolvedValueOnce({
				...workExperience,
				isCurrent: false,
			});

			const response = await WorkExperience.update(context, {
				id: ITEM_ID,
				isCurrent: false,
			});

			expect(response.isCurrent).toBe(false);
			expect(mockRequest).toHaveBeenCalledWith(`/user/jobs/${ITEM_ID}`, KEY, {
				method: 'PATCH',
				body: { isCurrent: false },
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.workExperience.update',
				{ id: ITEM_ID },
				'completed',
			);
		});

		it('deletes by id', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: true, id: ITEM_ID });

			const response = await WorkExperience.delete(context, { id: ITEM_ID });

			expect(response).toEqual({ deleted: true, id: ITEM_ID });
			expect(mockRequest).toHaveBeenCalledWith(`/user/jobs/${ITEM_ID}`, KEY, {
				method: 'DELETE',
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.workExperience.delete',
				{ id: ITEM_ID },
				'completed',
			);
		});
	});

	describe('projects', () => {
		it('creates a project, requiring title and shortDescription', async () => {
			mockRequest.mockResolvedValueOnce(project);

			const response = await Projects.create(context, {
				title: 'corsair-remoet',
				shortDescription: 'A Corsair plugin',
			});

			expect(response.id).toBe(ITEM_ID);
			expect(mockRequest).toHaveBeenCalledWith('/user/projects', KEY, {
				method: 'POST',
				body: { title: 'corsair-remoet', shortDescription: 'A Corsair plugin' },
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.projects.create',
				{ id: ITEM_ID },
				'completed',
			);
		});

		it('rejects a missing shortDescription and an empty startDate', async () => {
			await expect(
				// @ts-expect-error: shortDescription is required
				Projects.create(context, { title: 'corsair-remoet' }),
			).rejects.toThrow();
			await expect(
				Projects.create(context, {
					title: 'corsair-remoet',
					shortDescription: 'A Corsair plugin',
					startDate: '',
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it("clears role with '' and empties technologies with []", async () => {
			mockRequest.mockResolvedValueOnce({
				...project,
				role: '',
				technologies: [],
			});

			const response = await Projects.update(context, {
				id: ITEM_ID,
				role: '',
				technologies: [],
			});

			expect(response.role).toBe('');
			expect(mockRequest).toHaveBeenCalledWith(
				`/user/projects/${ITEM_ID}`,
				KEY,
				{
					method: 'PATCH',
					body: { role: '', technologies: [] },
				},
			);
		});

		it('updates by id', async () => {
			mockRequest.mockResolvedValueOnce({ ...project, isOpenSource: false });

			const response = await Projects.update(context, {
				id: ITEM_ID,
				isOpenSource: false,
			});

			expect(response.isOpenSource).toBe(false);
			expect(mockRequest).toHaveBeenCalledWith(
				`/user/projects/${ITEM_ID}`,
				KEY,
				{
					method: 'PATCH',
					body: { isOpenSource: false },
				},
			);
		});

		it('deletes by id', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: true, id: ITEM_ID });

			const response = await Projects.delete(context, { id: ITEM_ID });

			expect(response).toEqual({ deleted: true, id: ITEM_ID });
			expect(mockRequest).toHaveBeenCalledWith(
				`/user/projects/${ITEM_ID}`,
				KEY,
				{
					method: 'DELETE',
				},
			);
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.projects.delete',
				{ id: ITEM_ID },
				'completed',
			);
		});
	});

	describe('education', () => {
		it('creates an education entry, requiring institution', async () => {
			mockRequest.mockResolvedValueOnce(education);

			const response = await Education.create(context, {
				institution: 'Example University',
				studyLevel: 'BACHELOR',
			});

			expect(response.id).toBe(ITEM_ID);
			expect(mockRequest).toHaveBeenCalledWith('/user/education', KEY, {
				method: 'POST',
				body: { institution: 'Example University', studyLevel: 'BACHELOR' },
			});
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.education.create',
				{ id: ITEM_ID },
				'completed',
			);
		});

		it('rejects a missing institution and a bad studyLevel', async () => {
			await expect(
				// @ts-expect-error: institution is required
				Education.create(context, { studyLevel: 'BACHELOR' }),
			).rejects.toThrow();
			await expect(
				Education.create(context, {
					institution: 'Example University',
					// @ts-expect-error: not a Remoet study level
					studyLevel: 'PHD',
				}),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it("clears institutionUrl with ''", async () => {
			// Remoet answers null for an empty institutionUrl.
			mockRequest.mockResolvedValueOnce({ ...education, institutionUrl: null });

			const response = await Education.update(context, {
				id: ITEM_ID,
				institutionUrl: '',
			});

			expect(response.institutionUrl).toBeNull();
			expect(mockRequest).toHaveBeenCalledWith(
				`/user/education/${ITEM_ID}`,
				KEY,
				{
					method: 'PATCH',
					body: { institutionUrl: '' },
				},
			);
		});

		it('updates by id', async () => {
			mockRequest.mockResolvedValueOnce({ ...education, isCurrent: true });

			const response = await Education.update(context, {
				id: ITEM_ID,
				isCurrent: true,
			});

			expect(response.isCurrent).toBe(true);
			expect(mockRequest).toHaveBeenCalledWith(
				`/user/education/${ITEM_ID}`,
				KEY,
				{
					method: 'PATCH',
					body: { isCurrent: true },
				},
			);
		});

		it('deletes by id', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: true, id: ITEM_ID });

			const response = await Education.delete(context, { id: ITEM_ID });

			expect(response).toEqual({ deleted: true, id: ITEM_ID });
			expect(mockRequest).toHaveBeenCalledWith(
				`/user/education/${ITEM_ID}`,
				KEY,
				{
					method: 'DELETE',
				},
			);
			expect(mockLog).toHaveBeenCalledWith(
				context,
				'remoet.education.delete',
				{ id: ITEM_ID },
				'completed',
			);
		});
	});
});

// ── Shared mutation contract, checked identically for every item group ───────

// `any` here (test-only, not part of the package's public surface) sidesteps
// each group's distinct, stricter input type: this contract deliberately
// feeds malformed and unknown-key input.
type ItemGroupApi = {
	create: (ctx: RemoetContext, input: any) => Promise<{ id: string }>;
	update: (ctx: RemoetContext, input: any) => Promise<{ id: string }>;
	delete: (
		ctx: RemoetContext,
		input: any,
	) => Promise<{ deleted: boolean; id: string }>;
};

const GROUPS: Array<{
	name: 'workExperience' | 'projects' | 'education';
	api: ItemGroupApi;
	path: string;
	validCreateInput:
		| WorkExperienceCreateInput
		| ProjectsCreateInput
		| EducationCreateInput;
	fixture: { id: string };
}> = [
	{
		name: 'workExperience',
		api: WorkExperience,
		path: '/user/jobs',
		validCreateInput: { title: 'Staff Engineer', startDate: '2024-01-15' },
		fixture: workExperience,
	},
	{
		name: 'projects',
		api: Projects,
		path: '/user/projects',
		validCreateInput: {
			title: 'corsair-remoet',
			shortDescription: 'A Corsair plugin',
		},
		fixture: project,
	},
	{
		name: 'education',
		api: Education,
		path: '/user/education',
		validCreateInput: { institution: 'Example University' },
		fixture: education,
	},
];

describe.each(GROUPS)(
	'$name mutation contract',
	({ name, api, path, validCreateInput, fixture }) => {
		afterEach(() => {
			jest.clearAllMocks();
		});

		it('update requires at least one field besides id', async () => {
			await expect(api.update(context, { id: ITEM_ID })).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('update rejects a malformed id even with a valid field', async () => {
			await expect(
				api.update(context, { id: 'not-24-hex', isCurrent: true }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('delete rejects a malformed id', async () => {
			await expect(api.delete(context, { id: 'not-24-hex' })).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('logs the create, update and delete events under remoet.<group>.<op>', async () => {
			mockRequest.mockResolvedValueOnce(fixture);
			await api.create(context, validCreateInput);
			expect(mockLog).toHaveBeenCalledWith(
				context,
				`remoet.${name}.create`,
				{ id: fixture.id },
				'completed',
			);

			mockRequest.mockResolvedValueOnce(fixture);
			await api.update(context, { id: ITEM_ID, isCurrent: true });
			expect(mockLog).toHaveBeenCalledWith(
				context,
				`remoet.${name}.update`,
				{ id: fixture.id },
				'completed',
			);

			mockRequest.mockResolvedValueOnce({ deleted: true, id: ITEM_ID });
			await api.delete(context, { id: ITEM_ID });
			expect(mockLog).toHaveBeenCalledWith(
				context,
				`remoet.${name}.delete`,
				{ id: ITEM_ID },
				'completed',
			);
		});

		it('surfaces a 404 on update without logging a false success', async () => {
			mockRequest.mockRejectedValueOnce(remoetError(404, 'Not found'));

			await expect(
				api.update(context, { id: ITEM_ID, isCurrent: true }),
			).rejects.toMatchObject({ status: 404, message: 'Not found' });
			expect(mockLog).not.toHaveBeenCalled();
			expect(mockRequest).toHaveBeenCalledWith(`${path}/${ITEM_ID}`, KEY, {
				method: 'PATCH',
				body: { isCurrent: true },
			});
		});

		it('surfaces a 404 on delete without logging a false success', async () => {
			mockRequest.mockRejectedValueOnce(remoetError(404, 'Not found'));

			await expect(api.delete(context, { id: ITEM_ID })).rejects.toMatchObject({
				status: 404,
				message: 'Not found',
			});
			expect(mockLog).not.toHaveBeenCalled();
		});
	},
);
