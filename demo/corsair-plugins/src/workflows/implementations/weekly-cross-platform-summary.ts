import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function weeklyCrossPlatformSummary(params?: { tenantId?: string }) {
	const tenantId = params?.tenantId || 'default';
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - 7);
	const weekAgo = date.toISOString();

	const completed = await tenant.linear.api.issues.list({
		filter: { completedAt: { gte: weekAgo } },
	});
	const created = await tenant.linear.api.issues.list({
		filter: { createdAt: { gte: weekAgo } },
	});
	const linearStats = {
		completed: completed.nodes?.length || 0,
		created: created.nodes?.length || 0,
	};

	const repositories = process.env.GITHUB_REPOS?.split(',') || [];
	let totalPRs = 0;
	let totalStars = 0;
	for (const repo of repositories) {
		const [owner, repoName] = repo.split('/');
		try {
			const prs = await tenant.github.api.pullRequests.list({
				owner,
				repo: repoName,
				state: 'all',
			});
			const recentPRs = prs.data?.filter((pr: any) => 
				new Date(pr.updated_at) >= new Date(weekAgo)
			) || [];
			totalPRs += recentPRs.length;
			const repoData = await tenant.github.api.repositories.get({
				owner,
				repo: repoName,
			});
			totalStars += repoData.stargazers_count || 0;
		} catch (error) {
			console.error(`Error fetching stats for ${repo}:`, error);
		}
	}
	const githubStats = { prs: totalPRs, stars: totalStars };

	const events = await tenant.posthog.db.events.search({
		data: { created_at: { $gte: weekAgo } },
	});
	const distinctUsers = new Set(events.map((e: any) => e.distinct_id));
	const posthogStats = {
		events: events.length,
		uniqueUsers: distinctUsers.size,
	};

	const summary = `🌐 *Weekly Cross-Platform Summary*\n\n*Linear:*\n  • Completed: ${linearStats.completed}\n  • Created: ${linearStats.created}\n\n*GitHub:*\n  • PRs: ${githubStats.prs}\n  • Total Stars: ${githubStats.stars}\n\n*PostHog:*\n  • Events: ${posthogStats.events}\n  • Unique Users: ${posthogStats.uniqueUsers}\n\n*Period:* Last 7 days`;

	const slackChannel = await getSlackChannel(tenantId, 'general');

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: summary,
	});

	return {
		success: true,
		linearStats,
		githubStats,
		posthogStats,
		processedAt: new Date().toISOString(),
	};
}
