import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function alertOnGithubSecurityAlerts(params: {
	tenantId: string;
	event: any;
}) {
	const { tenantId, event: securityEvent } = params;
	const tenant = corsair.withTenant(tenantId);

	const alertData = {
		alertType: securityEvent.alert?.type || 'unknown',
		severity: securityEvent.alert?.severity || 'unknown',
		repository: securityEvent.repository?.full_name || '',
		package: securityEvent.alert?.package?.name || '',
		url: securityEvent.alert?.html_url || '',
	};

	const slackChannel = await getSlackChannel(tenantId, 'security');

	const severity = alertData.severity.toLowerCase();
	const severityLevel = severity === 'critical' || severity === 'high' ? 'critical' : severity === 'medium' ? 'warning' : 'info';

	const emoji = severityLevel === 'critical' ? '🔴' : severityLevel === 'warning' ? '🟡' : '🔵';
	const message = `${emoji} *GitHub Security Alert*\n*Type:* ${alertData.alertType}\n*Severity:* ${alertData.severity}\n*Repository:* ${alertData.repository}\n*Package:* ${alertData.package}\n*URL:* ${alertData.url}`;

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: message,
	});

	let linearIssue = null;
	if (severityLevel === 'critical') {
		const teamId = process.env.LINEAR_TEAM_ID || '';
		linearIssue = await tenant.linear.api.issues.create({
			title: `[Security] ${alertData.alertType} in ${alertData.repository}`,
			description: `Security alert detected\n\n*Type:* ${alertData.alertType}\n*Severity:* ${alertData.severity}\n*Package:* ${alertData.package}\n*Repository:* ${alertData.repository}\n*URL:* ${alertData.url}`,
			teamId,
			priority: 1,
		});
	}

	return {
		success: true,
		alertType: alertData.alertType,
		severity: alertData.severity,
		linearIssueId: linearIssue?.id || null,
		processedAt: new Date().toISOString(),
	};
}
