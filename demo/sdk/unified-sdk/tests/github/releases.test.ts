import { Github } from '../api';
import {
	generateTestId,
	getTestOwner,
	getTestRepo,
	handleRateLimit,
	sleep,
} from './setup';

describe('Github.Releases - Release Actions', () => {
	const owner = getTestOwner();
	const repo = getTestRepo();

	let createdReleaseId: number | undefined;
	let createdTagName: string | undefined;

	afterAll(async () => {
		if (createdReleaseId) {
			try {
				await Github.Releases.delete(owner, repo, createdReleaseId);
				console.log(`Cleanup: Deleted release ID ${createdReleaseId}`);
			} catch (e) {
				console.warn(`Cleanup failed for release ID ${createdReleaseId}`);
			}
		}
	});

	describe('create', () => {
		it('should create a release', async () => {
			try {
				const testId = generateTestId();
				createdTagName = `v0.0.0-${testId}`;

				const release = await Github.Releases.create(owner, repo, {
					tag_name: createdTagName,
					name: `Test Release ${testId}`,
					body: 'This is a test release created by automated tests. It will be cleaned up automatically.',
					draft: true,
					prerelease: true,
				});

				expect(release).toBeDefined();
				expect(release).toHaveProperty('id');
				expect(release).toHaveProperty('tag_name');
				expect(release.tag_name).toBe(createdTagName);
				expect(release.draft).toBe(true);

				createdReleaseId = release.id;
				console.log('Created release:', release.tag_name);
				console.log('Release ID:', release.id);
				console.log('Release name:', release.name);
				console.log('Draft:', release.draft);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('list', () => {
		it('should list releases for the repository', async () => {
			try {
				const releases = await Github.Releases.list(owner, repo, 10, 1);

				expect(Array.isArray(releases)).toBe(true);

				console.log('Found', releases.length, 'releases');
				releases.forEach((release) => {
					console.log(`  ${release.tag_name}: ${release.name || 'Unnamed'}`);
					console.log(
						`    Draft: ${release.draft}, Prerelease: ${release.prerelease}`,
					);
				});
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('get', () => {
		it('should get the created release by ID', async () => {
			if (!createdReleaseId) {
				console.warn('Skipping - no release was created');
				return;
			}

			try {
				const release = await Github.Releases.get(
					owner,
					repo,
					createdReleaseId,
				);

				expect(release).toBeDefined();
				expect(release.id).toBe(createdReleaseId);
				expect(release).toHaveProperty('tag_name');
				expect(release).toHaveProperty('name');

				console.log('Fetched release:', release.tag_name);
				console.log('Name:', release.name);
				console.log('Author:', release.author?.login);
			} catch (error) {
				await handleRateLimit(error);
			}
		});

		it('should get release by tag (non-draft only)', async () => {
			try {
				await sleep(1000);

				const releases = await Github.Releases.list(owner, repo, 10, 1);
				const publishedRelease = releases.find((r) => !r.draft);

				if (!publishedRelease) {
					console.log(
						'No published (non-draft) releases found to test getByTag',
					);
					return;
				}

				const release = await Github.Releases.getByTag(
					owner,
					repo,
					publishedRelease.tag_name,
				);

				expect(release).toBeDefined();
				expect(release.tag_name).toBe(publishedRelease.tag_name);

				console.log('Fetched release by tag:', publishedRelease.tag_name);
				console.log('Name:', release.name);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('update', () => {
		it('should update the release', async () => {
			if (!createdReleaseId) {
				console.warn('Skipping - no release was created');
				return;
			}

			try {
				await sleep(1000);

				const updated = await Github.Releases.update(
					owner,
					repo,
					createdReleaseId,
					{
						name: 'Updated Test Release',
						body: 'This release has been updated by automated tests.',
					},
				);

				expect(updated).toBeDefined();
				expect(updated.name).toBe('Updated Test Release');

				console.log('Updated release:', updated.tag_name);
				console.log('New name:', updated.name);
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('delete', () => {
		it('should delete the release', async () => {
			if (!createdReleaseId) {
				console.warn('Skipping - no release was created');
				return;
			}

			try {
				await sleep(1000);

				await Github.Releases.delete(owner, repo, createdReleaseId);

				console.log('Deleted release ID:', createdReleaseId);

				try {
					await Github.Releases.get(owner, repo, createdReleaseId);
					throw new Error('Release should have been deleted');
				} catch (error: any) {
					expect(error.status).toBe(404);
					console.log('Verified: Release no longer exists');
				}

				createdReleaseId = undefined;
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});
});
