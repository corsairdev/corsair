import { corsair } from '@/server/corsair';
import type { MessageEvent } from 'corsair';

export async function createLinearIssueFromSlackMessage(params: {
	tenantId: string;
	event: MessageEvent;
}) {
	const { tenantId, event: messageEvent } = params;
	const tenant = corsair.withTenant(tenantId);
	if (messageEvent.type !== 'message' || !('text' in messageEvent)) {
		throw new Error('Not a valid message event');
	}
	const messageData = {
		text: messageEvent.text || '',
		user: messageEvent.user || '',
		channel: messageEvent.channel || '',
		ts: messageEvent.ts || '',
	};

	const teamId = process.env.LINEAR_TEAM_ID || '';

	const lines = messageData.text.split('\n');
	const titleLine = lines.find((line: string) => 
		line.toLowerCase().includes('title:') || 
		line.toLowerCase().includes('issue:')
	);
	const issueTitle = titleLine 
		? titleLine.split(':').slice(1).join(':').trim() 
		: messageData.text.substring(0, 100);

	const issueDescription = `Created from Slack message\nChannel: ${messageData.channel}\nUser: ${messageData.user}\nOriginal message: ${messageData.text}`;

	const issue = await tenant.linear.api.issues.create({
		title: issueTitle,
		description: issueDescription,
		teamId,
	});

	return {
		success: true,
		issueId: issue.id,
		identifier: issue.identifier,
		processedAt: new Date().toISOString(),
	};
}
