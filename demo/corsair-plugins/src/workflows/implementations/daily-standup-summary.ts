import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function dailyStandupSummary(params?: { tenantId?: string }) {
	const tenantId = params?.tenantId || 'default';
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - 1);
	const yesterday = date.toISOString().split('T')[0];

	const completedIssues = await tenant.linear.api.issues.list({
		filter: {
			completedAt: { gte: `${yesterday}T00:00:00Z`, lte: `${yesterday}T23:59:59Z` },
		},
	});

	const createdIssues = await tenant.linear.api.issues.list({
		filter: {
			createdAt: { gte: `${yesterday}T00:00:00Z`, lte: `${yesterday}T23:59:59Z` },
		},
	});

	const summary = `📊 *Daily Standup Summary - ${yesterday}*\n\n*Completed Issues:* ${completedIssues.nodes?.length || 0}\n*New Issues:* ${createdIssues.nodes?.length || 0}\n\n*Completed:*\n${(completedIssues.nodes || []).slice(0, 5).map((issue: any) => `  • ${issue.identifier}: ${issue.title}`).join('\n')}\n\n*New:*\n${(createdIssues.nodes || []).slice(0, 5).map((issue: any) => `  • ${issue.identifier}: ${issue.title}`).join('\n')}`;

	const slackChannel = await getSlackChannel(tenantId, 'standup');

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: summary,
	});

	return {
		success: true,
		date: yesterday,
		completedCount: completedIssues.nodes?.length || 0,
		createdCount: createdIssues.nodes?.length || 0,
		processedAt: new Date().toISOString(),
	};
}
