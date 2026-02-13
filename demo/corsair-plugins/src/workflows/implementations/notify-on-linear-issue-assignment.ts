import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function notifyOnLinearIssueAssignment(params: {
	tenantId: string;
	event: any;
}) {
	const { tenantId, event: issueEvent } = params;
	const tenant = corsair.withTenant(tenantId);

	const issue = issueEvent.data;

	const wasAssigned = issue.assigneeId !== null && issue.assigneeId !== undefined;

	if (!wasAssigned) {
		return { skipped: true, reason: 'Issue not assigned' };
	}

	const assignee = await tenant.linear.api.users.get({ id: issue.assigneeId! });

	const slackChannel = await getSlackChannel(tenantId, 'sdk-test');

	const users = await tenant.slack.api.users.list({
		cursor: '',
		limit: 1000,
	});
	const slackUser = users.members?.find(
		(u: any) => u.profile?.email === assignee.email || 
				   u.name === assignee.name
	);
	const userLookup = slackUser?.id || null;

	const mention = userLookup ? `<@${userLookup}>` : assignee.name;
	const message = `*New Issue Assignment*\n${mention} has been assigned to issue *${issue.identifier}*\n*Title:* ${issue.title}\n*Priority:* ${issue.priority || 'No priority'}\n*URL:* ${issueEvent.url || 'N/A'}`;

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: message,
	});

	return {
		success: true,
		issueId: issue.id,
		assigneeId: issue.assigneeId,
		processedAt: new Date().toISOString(),
	};
}
