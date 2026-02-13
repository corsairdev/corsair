import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function notifyTeamOfNewGithubPRs(params: {
	tenantId: string;
	event: any;
}) {
	const { tenantId, event: prEvent } = params;
	const tenant = corsair.withTenant(tenantId);

	const prData = {
		title: prEvent.pull_request?.title || 'Untitled PR',
		number: prEvent.pull_request?.number || 0,
		author: prEvent.pull_request?.user?.login || 'Unknown',
		url: prEvent.pull_request?.html_url || '',
		repo: prEvent.repository?.full_name || '',
	};

	const slackChannel = await getSlackChannel(tenantId, 'sdk-test');

	let prDetails = null;
	if (prData.repo && prData.number) {
		const [owner, repo] = prData.repo.split('/');
		prDetails = await tenant.github.api.pullRequests.get({
			owner,
			repo,
			pullNumber: prData.number,
		});
	}

	const status = prDetails?.state || 'open';
	const additions = prDetails?.additions || 0;
	const deletions = prDetails?.deletions || 0;
	const message = `*New Pull Request Opened*\n*Repository:* ${prData.repo}\n*Title:* ${prData.title}\n*Author:* ${prData.author}\n*PR #${prData.number}*\n*Changes:* +${additions} -${deletions}\n*Status:* ${status}\n*URL:* ${prData.url}`;

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: message,
	});

	return {
		success: true,
		prNumber: prData.number,
		repository: prData.repo,
		processedAt: new Date().toISOString(),
	};
}
