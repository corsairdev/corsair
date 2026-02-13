import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function weeklyGithubActivityReport(params?: { tenantId?: string }) {
	const tenantId = params?.tenantId || 'default';
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - 7);
	const weekAgo = date.toISOString();

	const repositories = process.env.GITHUB_REPOS?.split(',') || [];

	const prStats = [];
	for (const repo of repositories) {
		const [owner, repoName] = repo.split('/');
		try {
			const prs = await tenant.github.api.pullRequests.list({
				owner,
				repo: repoName,
				state: 'all',
				sort: 'updated',
				direction: 'desc',
			});
			const recentPRs = prs.data?.filter((pr: any) => 
				new Date(pr.updated_at) >= new Date(weekAgo)
			) || [];
			prStats.push({ repo, count: recentPRs.length });
		} catch (error) {
			console.error(`Error fetching PRs for ${repo}:`, error);
		}
	}

	let totalStars = 0;
	for (const repo of repositories) {
		const [owner, repoName] = repo.split('/');
		try {
			const repoData = await tenant.github.api.repositories.get({
				owner,
				repo: repoName,
			});
			totalStars += repoData.stargazers_count || 0;
		} catch (error) {
			console.error(`Error fetching stars for ${repo}:`, error);
		}
	}

	const prSummary = prStats.map(s => `  • ${s.repo}: ${s.count} PRs`).join('\n');
	const report = `📈 *Weekly GitHub Activity Report*\n\n*Repositories:* ${repositories.length}\n*Total Stars:* ${totalStars}\n\n*PRs This Week:*\n${prSummary}\n\n*Period:* Last 7 days`;

	const slackChannel = await getSlackChannel(tenantId, 'engineering');

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: report,
	});

	return {
		success: true,
		repositories: repositories.length,
		totalStars,
		prStats,
		processedAt: new Date().toISOString(),
	};
}
