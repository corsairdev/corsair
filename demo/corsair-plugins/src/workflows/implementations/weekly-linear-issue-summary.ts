import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function weeklyLinearIssueSummary(params?: { tenantId?: string }) {
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

	const createdIssues = await tenant.linear.api.issues.list({
		filter: {
			createdAt: { gte: weekAgo },
		},
	});

	const inProgressIssues = await tenant.linear.api.issues.list({
		filter: {
			state: { name: { neq: 'Done' } },
		},
	});

	const summary = `📋 *Weekly Linear Issue Summary*\n\n*Completed This Week:* ${completedIssues.nodes?.length || 0}\n*Created This Week:* ${createdIssues.nodes?.length || 0}\n*Currently In Progress:* ${inProgressIssues.nodes?.length || 0}\n\n*Top Completed:*\n${(completedIssues.nodes || []).slice(0, 5).map((issue: any) => `  • ${issue.identifier}: ${issue.title}`).join('\n')}\n\n*Top New:*\n${(createdIssues.nodes || []).slice(0, 5).map((issue: any) => `  • ${issue.identifier}: ${issue.title}`).join('\n')}`;

	const slackChannel = await getSlackChannel(tenantId, 'general');

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: summary,
	});

	return {
		success: true,
		completedCount: completedIssues.nodes?.length || 0,
		createdCount: createdIssues.nodes?.length || 0,
		inProgressCount: inProgressIssues.nodes?.length || 0,
		processedAt: new Date().toISOString(),
	};
}
