import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function weeklyTeamProductivityReport(params?: { tenantId?: string }) {
	const tenantId = params?.tenantId || 'default';
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - 7);
	const weekAgo = date.toISOString();

	const completedIssues = await tenant.linear.api.issues.list({
		filter: {
			completedAt: { gte: weekAgo },
		},
	});

	const repositories = process.env.GITHUB_REPOS?.split(',') || [];
	let totalPRs = 0;
	let mergedPRs = 0;
	for (const repo of repositories) {
		const [owner, repoName] = repo.split('/');
		try {
			const prs = await tenant.github.api.pullRequests.list({
				owner: owner || '',
				repo: repoName || '',
				state: 'all',
				sort: 'updated',
				direction: 'desc',
			});
			const recentPRs = prs.filter((pr: any) => 
				new Date(pr.updatedAt) >= new Date(weekAgo)
			) || [];
			totalPRs += recentPRs.length;
			mergedPRs += recentPRs.filter((pr: any) => pr.mergedAt).length;
		} catch (error) {
			console.error(`Error fetching PRs for ${repo}:`, error);
		}
	}
	const prStats = { total: totalPRs, merged: mergedPRs };

	const events = await tenant.posthog.db.events.search({
		data: {
			createdAt: { between: [new Date(weekAgo), new Date()] },
		},
	});
	const eventCount = events.length;

	const report = `📊 *Weekly Team Productivity Report*\n\n*Linear Issues Completed:* ${completedIssues.nodes?.length || 0}\n*GitHub PRs:* ${prStats.total} (${prStats.merged} merged)\n*PostHog Events:* ${eventCount}\n\n*Top Completed Issues:*\n${(completedIssues.nodes || []).slice(0, 5).map((issue: any) => `  • ${issue.identifier}: ${issue.title}`).join('\n')}`;

	const slackChannel = await getSlackChannel(tenantId, 'sdk-test');

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: report,
	});

	return {
		success: true,
		completedIssues: completedIssues.nodes?.length || 0,
		prStats,
		eventCount,
		processedAt: new Date().toISOString(),
	};
}
