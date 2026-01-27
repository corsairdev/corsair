import { Github } from '../api';
import { getTestOwner, getTestRepo, handleRateLimit } from './setup';

describe('Github.Repos - Extended Repository Operations', () => {
	const owner = getTestOwner();
	const repo = getTestRepo();

	describe('get', () => {
		it('should get repository information', async () => {
			try {
				const repoInfo = await Github.Repos.get(owner, repo);

				expect(repoInfo).toBeDefined();
				expect(repoInfo).toHaveProperty('id');
				expect(repoInfo).toHaveProperty('name');
				expect(repoInfo).toHaveProperty('full_name');
				expect(repoInfo.full_name).toBe(`${owner}/${repo}`);

				console.log('Repository:', repoInfo.full_name);
				console.log('Description:', repoInfo.description || 'N/A');
				console.log('Stars:', repoInfo.stargazers_count);
				console.log('Forks:', repoInfo.forks_count);
				console.log('Language:', repoInfo.language || 'N/A');
				console.log('Default branch:', repoInfo.default_branch);

				if (repoInfo.license) {
					console.log('License:', repoInfo.license.name);
					console.log('License key:', repoInfo.license.key);
				} else {
					console.log('License: None');
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('listCommits', () => {
		it('should list commits for the repository', async () => {
			try {
				const commits = await Github.Repos.listCommits(
					owner,
					repo,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					undefined,
					10,
					1,
				);

				expect(Array.isArray(commits)).toBe(true);
				expect(commits.length).toBeGreaterThan(0);

				console.log(`Found ${commits.length} commits`);

				commits.slice(0, 5).forEach((commit) => {
					console.log(
						`  ${commit.sha?.substring(0, 7)}: ${commit.commit?.message?.split('\n')[0]}`,
					);
					console.log(`    Author: ${commit.commit?.author?.name}`);
					console.log(`    Date: ${commit.commit?.author?.date}`);
				});
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('listBranches', () => {
		it('should list branches for the repository', async () => {
			try {
				const branches = await Github.Repos.listBranches(
					owner,
					repo,
					undefined,
					10,
					1,
				);

				expect(Array.isArray(branches)).toBe(true);
				expect(branches.length).toBeGreaterThan(0);

				console.log(`Found ${branches.length} branches`);

				branches.forEach((branch) => {
					console.log(`  ${branch.name} (protected: ${branch.protected})`);
				});
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('getTopPaths', () => {
		it('should get popular paths', async () => {
			try {
				const paths = await Github.Repos.getTopPaths(owner, repo);

				expect(Array.isArray(paths)).toBe(true);

				console.log('Popular paths:');
				paths
					.slice(0, 10)
					.forEach(
						(
							pathInfo: { path: string; count: number; uniques: number },
							idx: number,
						) => {
							console.log(`  ${idx + 1}. ${pathInfo.path}`);
							console.log(
								`     Views: ${pathInfo.count}, Uniques: ${pathInfo.uniques}`,
							);
						},
					);
			} catch (error: any) {
				if (error.status === 403) {
					console.log('Traffic data requires push access to the repository');
				} else {
					await handleRateLimit(error);
				}
			}
		});
	});

	describe('getTopReferrers', () => {
		it('should get top referrers', async () => {
			try {
				const referrers = await Github.Repos.getTopReferrers(owner, repo);

				expect(Array.isArray(referrers)).toBe(true);

				console.log('Top referrers:');
				referrers
					.slice(0, 10)
					.forEach(
						(
							referrer: { referrer: string; count: number; uniques: number },
							idx: number,
						) => {
							console.log(`  ${idx + 1}. ${referrer.referrer}`);
							console.log(
								`     Views: ${referrer.count}, Uniques: ${referrer.uniques}`,
							);
						},
					);
			} catch (error: any) {
				if (error.status === 403) {
					console.log('Traffic data requires push access to the repository');
				} else {
					await handleRateLimit(error);
				}
			}
		});
	});

	describe('getCodeFrequencyStats', () => {
		it('should get code frequency statistics', async () => {
			try {
				const stats = await Github.Repos.getCodeFrequencyStats(owner, repo);

				expect(stats).toBeDefined();

				if (Array.isArray(stats)) {
					console.log('Code frequency stats (last 5 weeks):');
					stats.slice(-5).forEach((week: number[]) => {
						if (Array.isArray(week) && week.length >= 3) {
							const date = new Date(week[0] * 1000);
							console.log(
								`  Week of ${date.toLocaleDateString()}: +${week[1]} / ${week[2]}`,
							);
						}
					});
				} else {
					console.log('Stats are being computed, try again later');
				}
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});

	describe('getPullRequest', () => {
		it('should get a specific pull request', async () => {
			try {
				const pr = await Github.PullRequests.get(owner, repo, 1);

				expect(pr).toBeDefined();
				console.log('PR #1:', pr.title);
				console.log('State:', pr.state);
				console.log('Author:', pr.user?.login);
			} catch (error: any) {
				if (error.status === 404) {
					console.log('No pull request #1 found');
				} else {
					await handleRateLimit(error);
				}
			}
		});
	});

	describe('listPullRequests', () => {
		it('should list pull requests for the repository', async () => {
			try {
				const pulls = await Github.PullRequests.list(
					owner,
					repo,
					'all',
					undefined,
					undefined,
					'updated',
					'desc',
					10,
					1,
				);

				expect(Array.isArray(pulls)).toBe(true);

				console.log(`Found ${pulls.length} pull requests`);

				pulls.slice(0, 5).forEach((pr) => {
					console.log(`  #${pr.number}: ${pr.title}`);
					console.log(`    State: ${pr.state}, Author: ${pr.user?.login}`);
				});
			} catch (error) {
				await handleRateLimit(error);
			}
		});
	});
});
