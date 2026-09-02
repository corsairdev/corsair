import { SourcegraphAPIError, sourcegraphGraphql } from './client';
import {
	compareCommits,
	getCommitDetails,
	getFileContents,
	list,
	listFiles,
	listLanguages,
} from './endpoints/repository';
import { checkSettingsEditPermission } from './endpoints/site';
import { getCurrent } from './endpoints/user';

const LIVE_KEY = process.env.SOURCEGRAPH_ACCESS_TOKEN;
const describeIfKey = LIVE_KEY ? describe : describe.skip;
const ctx = {
	key: LIVE_KEY,
	options: {},
	$getAccountId: async () => 'live',
} as never;
async function firstRepoName(): Promise<string> {
	const listed = await list(ctx, { first: 1 });
	const name = listed.repositories.nodes?.[0]?.name;
	if (!name) {
		throw new Error('Sourcegraph instance returned no repositories');
	}
	return name;
}

describeIfKey('Sourcegraph live GraphQL API', () => {
	it('rejects an invalid access token', async () => {
		const err = await sourcegraphGraphql(
			'sgp_invalid-live-check',
			'query { currentUser { username } }',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(SourcegraphAPIError);
	});
});

describeIfKey('Sourcegraph live GraphQL API (authenticated)', () => {
	it('gets the current user', async () => {
		const data = await getCurrent(ctx, {});
		expect(data.currentUser?.username).toEqual(expect.any(String));
	});

	it('checks site settings edit permission', async () => {
		const data = await checkSettingsEditPermission(ctx, {});
		expect(typeof data.canEditSiteSettings).toBe('boolean');
	});

	it('lists repositories', async () => {
		const data = await list(ctx, { first: 1 });
		expect(Array.isArray(data.repositories.nodes)).toBe(true);
	});

	it('gets file contents', async () => {
		const repo = await firstRepoName();
		const data = await getFileContents(ctx, {
			repo_name: repo,
			file_path: 'README.md',
		});
		expect(data.repository).not.toBeNull();
	});

	it('lists repository files', async () => {
		const data = await listFiles(ctx, {
			repo_name: await firstRepoName(),
			path: '',
			recursive: false,
		});
		expect(data.repository).not.toBeNull();
	});

	it('lists repository languages', async () => {
		const data = await listLanguages(ctx, { repoName: await firstRepoName() });
		expect(data.repository).not.toBeNull();
	});

	it('gets commit details for HEAD', async () => {
		const data = await getCommitDetails(ctx, {
			repo: await firstRepoName(),
			rev: 'HEAD',
		});
		expect(data.repository).not.toBeNull();
	});

	it('compares HEAD~1 and HEAD', async () => {
		const data = await compareCommits(ctx, {
			repo: await firstRepoName(),
			base: 'HEAD~1',
			head: 'HEAD',
		});
		expect(data.repository).not.toBeNull();
	});
});
