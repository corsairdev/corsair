import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function dailyLinearBurndownToSlack(params?: { tenantId?: string }) {
	const tenantId = params?.tenantId || 'default';
	const tenant = corsair.withTenant(tenantId);

	const projectsList = await tenant.linear.api.projects.list({
		filter: { state: { name: { eq: 'started' } } },
	});
	const projects = projectsList.nodes || [];

	const burndownData = [];
	for (const project of projects) {
		const issues = await tenant.linear.api.issues.list({
			filter: {
				project: { id: { eq: project.id } },
			},
		});
		const totalIssues = issues.nodes?.length || 0;
		const completedIssues = issues.nodes?.filter((i: any) => 
			i.completedAt !== null
		).length || 0;
		const remainingIssues = totalIssues - completedIssues;
		const completionRate = totalIssues > 0 ? (completedIssues / totalIssues) * 100 : 0;
		burndownData.push({
			name: project.name,
			total: totalIssues,
			completed: completedIssues,
			remaining: remainingIssues,
			completionRate: Math.round(completionRate),
		});
	}

	let message;
	if (burndownData.length === 0) {
		message = '📊 *Daily Burndown Report*\n\nNo active projects found.';
	} else {
		const projectReports = burndownData.map(p => 
			`  • *${p.name}:* ${p.completed}/${p.total} (${p.remaining} remaining, ${p.completionRate}% complete)`
		).join('\n');
		message = `📊 *Daily Linear Burndown Report*\n\n*Active Projects:* ${projects.length}\n\n*Project Status:*\n${projectReports}`;
	}

	const slackChannel = await getSlackChannel(tenantId, 'general');

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: message,
	});

	return {
		success: true,
		projects: projects.length,
		burndownData,
		processedAt: new Date().toISOString(),
	};
}
