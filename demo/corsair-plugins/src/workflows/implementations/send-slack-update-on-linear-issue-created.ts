import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function sendSlackUpdateOnLinearIssueCreated(params: {
	tenantId: string;
	event: any;
}) {
	const { tenantId, event: issueEvent } = params;
	const tenant = corsair.withTenant(tenantId);

	const issue = issueEvent.data;

	const slackChannel = await getSlackChannel(tenantId, 'sdk-test');

	let assignee = null;
	if (issue.assigneeId) {
		assignee = await tenant.linear.api.users.get({
			id: issue.assigneeId,
		});
	}

	const assigneeText = assignee
		? `Assigned to: ${assignee.name || assignee.displayName}`
		: 'Unassigned';
	const message = `*New Linear Issue Created*\n*Title:* ${issue.title || 'N/A'}\n*ID:* ${issue.identifier || 'N/A'}\n*Priority:* ${issue.priority || 'No priority'}\n${assigneeText}\n*URL:* ${issueEvent.url || 'N/A'}`;

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: message,
	});

	return {
		success: true,
		issueId: issue.id,
		identifier: issue.identifier,
		processedAt: new Date().toISOString(),
	};
}
