import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function dailyGithubStarCountToSlack(params?: { tenantId?: string }) {
	const tenantId = params?.tenantId || 'default';
	const tenant = corsair.withTenant(tenantId);

	const repositories = process.env.GITHUB_REPOS?.split(',') || [];

	const starCounts = [];
	for (const repo of repositories) {
		const [owner, repoName] = repo.split('/');
		try {
			const repoData = await tenant.github.api.repositories.get({
				owner,
				repo: repoName,
			});
			starCounts.push({
				repo,
				stars: repoData.stargazers_count || 0,
				forks: repoData.forks_count || 0,
			});
		} catch (error) {
			console.error(`Error fetching stars for ${repo}:`, error);
			starCounts.push({ repo, stars: 0, forks: 0 });
		}
	}

	const totalStars = starCounts.reduce((sum, repo) => sum + repo.stars, 0);

	const repoList = starCounts.map(r => `  • ${r.repo}: ⭐ ${r.stars} (🍴 ${r.forks} forks)`).join('\n');
	const message = `⭐ *Daily GitHub Star Count*\n\n*Total Stars:* ${totalStars}\n*Repositories:* ${repositories.length}\n\n*Breakdown:*\n${repoList}`;

	const slackChannel = await getSlackChannel(tenantId, 'engineering');

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: message,
	});

	return {
		success: true,
		totalStars,
		repositories: repositories.length,
		starCounts,
		processedAt: new Date().toISOString(),
	};
}
