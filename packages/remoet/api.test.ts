import { createCorsair } from 'corsair/core';
import { remoet } from './index';

// Live tests run only when a real key is provided via the environment.
// Nothing is hardcoded here, so CI without a key skips this suite (R6).
// Only read endpoints are exercised: the star, saved-job and profile.update
// writes would change the real account behind the key. Every call goes
// through the assembled plugin, so each response is parsed by the endpoint's
// zod schema.
const API_KEY = process.env.REMOET_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;

function liveApi() {
	const key = process.env.REMOET_API_KEY;
	if (!key) {
		throw new Error('REMOET_API_KEY is required for live tests');
	}
	return createCorsair({ plugins: [remoet({ key })] }).remoet.api;
}

// A job page Remoet tracks, used to exercise a non-null job-context match.
const TRACKED_JOB_URL =
	'https://job-boards.greenhouse.io/starburst/jobs/5432864008';

describeLive('Remoet live API', () => {
	it('profile.get', async () => {
		const profile = await liveApi().profile.get({});
		expect(Array.isArray(profile.jobs)).toBe(true);
	});

	it('profile.getLinks', async () => {
		const links = await liveApi().profile.getLinks({});
		expect(links).toHaveProperty('githubUrl');
	});

	it('workExperience.list', async () => {
		expect(Array.isArray(await liveApi().workExperience.list({}))).toBe(true);
	});

	it('projects.list', async () => {
		expect(Array.isArray(await liveApi().projects.list({}))).toBe(true);
	});

	it('education.list', async () => {
		expect(Array.isArray(await liveApi().education.list({}))).toBe(true);
	});

	it('linkTrees.list and linkTrees.get', async () => {
		const api = liveApi();
		const trees = await api.linkTrees.list({});
		expect(Array.isArray(trees)).toBe(true);
		const first = trees[0];
		if (!first) return;
		const tree = await api.linkTrees.get({ slug: first.slug });
		expect(tree.id).toBe(first.id);
	});

	it('jobContext.get for a tracked page', async () => {
		const context = await liveApi().jobContext.get({ url: TRACKED_JOB_URL });
		expect(context.match).not.toBeNull();
		expect(context.match?.companySlug).toEqual(expect.any(String));
	});

	it('jobs.search', async () => {
		const result = await liveApi().jobs.search({ pageSize: 5 });
		expect(Array.isArray(result.jobs)).toBe(true);
		expect(typeof result.totalCount).toBe('number');
	});

	it('companies.search', async () => {
		const result = await liveApi().companies.search({ pageSize: 5 });
		expect(Array.isArray(result.listings)).toBe(true);
		expect(typeof result.totalCount).toBe('number');
	});

	it('companies.get for a slug returned by jobs.search', async () => {
		const api = liveApi();
		const { jobs } = await api.jobs.search({ pageSize: 1 });
		const slug = jobs[0]?.companySlug;
		expect(slug).toEqual(expect.any(String));
		if (!slug) return;
		const company = await api.companies.get({ slug });
		expect(company.slug).toBe(slug);
	});

	it('starredJobs.list', async () => {
		const result = await liveApi().starredJobs.list({ pageSize: 5 });
		expect(Array.isArray(result.jobs)).toBe(true);
		expect(typeof result.totalCount).toBe('number');
	});

	it('savedJobs.list', async () => {
		const result = await liveApi().savedJobs.list({ pageSize: 5 });
		expect(Array.isArray(result.items)).toBe(true);
		expect(typeof result.totalCount).toBe('number');
	});
});
