import { logEventFromContext } from 'corsair/core';
import { makeRemoetRequest } from './client';
import {
	Education,
	JobContext,
	LinkTrees,
	Profile,
	Projects,
	Stars,
	WorkExperience,
} from './endpoints';
import type {
	EducationListResponse,
	JobContextGetResponse,
	LinkTreesGetResponse,
	ProfileGetLinksResponse,
	ProfileGetResponse,
	ProjectsListResponse,
	RemoetContext,
	WorkExperienceListResponse,
} from './index';
import { remoet, remoetEndpointSchemas } from './index';
import { testContext } from './test-utils';

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
	// One otherwise-valid input per operation. Adding an operation without a
	// row here fails the coverage test below.
	const validInputs: Record<string, Record<string, unknown>> = {
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
	const endpoints = remoet().endpoints as unknown as Record<
		string,
		Record<string, (ctx: RemoetContext, input: unknown) => Promise<unknown>>
	>;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('has a row for every operation', () => {
		expect(Object.keys(validInputs).sort()).toEqual(
			Object.keys(remoetEndpointSchemas).sort(),
		);
	});

	it.each(Object.entries(validInputs))(
		'%s refuses an unknown key without sending a request',
		async (path, validInput) => {
			const [group, name] = path.split('.') as [string, string];
			const endpoint = endpoints[group]?.[name];
			expect(endpoint).toBeDefined();
			// The row is valid on its own, so the unknown key is the only reason
			// the call below fails.
			const schemas = remoetEndpointSchemas as Record<
				string,
				{ input: { safeParse: (value: unknown) => { success: boolean } } }
			>;
			expect(schemas[path]?.input.safeParse(validInput).success).toBe(true);
			await expect(
				endpoint!(context, { ...validInput, notAField: true }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		},
	);
});
