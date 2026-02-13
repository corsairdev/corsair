import { corsair } from '@/server/corsair';

export async function createHubspotDealFromLinearMilestone(params: {
	tenantId: string;
	event: any;
}) {
	const { tenantId, event: milestoneEvent } = params;
	const tenant = corsair.withTenant(tenantId);

	const milestone = milestoneEvent.data;

	let project = null;
	if (milestone.projectId) {
		project = await tenant.linear.api.projects.get({ id: milestone.projectId });
	}

	let relatedIssues = [];
	if (milestone.id) {
		const issues = await tenant.linear.api.issues.list({
			filter: { projectMilestone: { id: { eq: milestone.id } } },
		});
		relatedIssues = issues.nodes || [];
	}

	const estimatedHours = relatedIssues.reduce((sum: number, issue: any) => {
		return sum + (issue.estimate || 0);
	}, 0);
	const dealValue = estimatedHours * 150;

	const dealData = {
		dealname: `${milestone.name || 'Milestone'} - ${project?.name || 'Project'}`,
		dealstage: 'closedwon',
		amount: dealValue.toString(),
		closedate: new Date().toISOString(),
		description: `Deal created from completed Linear milestone\n\n*Milestone:* ${milestone.name}\n*Project:* ${project?.name || 'N/A'}\n*Issues Completed:* ${relatedIssues.length}`,
	};

	const deal = await tenant.hubspot.api.deals.create({
		properties: dealData,
	});

	return {
		success: true,
		dealId: deal.id,
		milestoneId: milestone.id,
		dealValue,
		processedAt: new Date().toISOString(),
	};
}
