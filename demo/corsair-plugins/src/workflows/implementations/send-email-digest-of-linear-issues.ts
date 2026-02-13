import { corsair } from '@/server/corsair';

export async function sendEmailDigestOfLinearIssues(params?: { tenantId?: string }) {
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

	const inProgressIssues = await tenant.linear.api.issues.list({
		filter: {
			state: { name: { neq: 'Done' } },
			updatedAt: { gte: weekAgo },
		},
	});

	const completedList = (completedIssues.nodes || []).slice(0, 10).map((issue: any) => 
		`  • ${issue.identifier}: ${issue.title}`
	).join('\n');
	const inProgressList = (inProgressIssues.nodes || []).slice(0, 10).map((issue: any) => 
		`  • ${issue.identifier}: ${issue.title}`
	).join('\n');

	const emailContent = {
		subject: `Weekly Linear Issues Digest - ${new Date().toLocaleDateString()}`,
		html: `<h2>Weekly Linear Issues Digest</h2><p><strong>Completed This Week:</strong> ${completedIssues.nodes?.length || 0}</p><pre>${completedList}</pre><p><strong>In Progress:</strong> ${inProgressIssues.nodes?.length || 0}</p><pre>${inProgressList}</pre>`,
		text: `Weekly Linear Issues Digest\n\nCompleted: ${completedIssues.nodes?.length || 0}\n${completedList}\n\nIn Progress: ${inProgressIssues.nodes?.length || 0}\n${inProgressList}`,
	};

	const recipients = process.env.EMAIL_DIGEST_RECIPIENTS?.split(',') || [];

	for (const recipient of recipients) {
		await tenant.resend.api.emails.send({
			from: process.env.EMAIL_FROM || 'noreply@example.com',
			to: recipient.trim(),
			subject: emailContent.subject,
			html: emailContent.html,
			text: emailContent.text,
		});
	}

	return {
		success: true,
		recipients: recipients.length,
		completedCount: completedIssues.nodes?.length || 0,
		inProgressCount: inProgressIssues.nodes?.length || 0,
		processedAt: new Date().toISOString(),
	};
}
