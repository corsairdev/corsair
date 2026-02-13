import { corsair } from '@/server/corsair';

export async function archiveCompletedLinearIssues(params: {
	tenantId: string;
	daysAgo?: number;
}) {
	const { tenantId, daysAgo = 90 } = params;
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	const timeRange = date.toISOString();

	const issues = await tenant.linear.api.issues.list({
		filter: {
			completedAt: { lte: timeRange },
			state: { name: { eq: 'Done' } },
		},
	});
	const completedIssues = issues.nodes || [];

	// Group issues by team to cache canceled state IDs
	const teamCanceledStates = new Map<string, string | null>();
	let archivedCount = 0;

	for (const issue of completedIssues.slice(0, 100)) {
		try {
			const teamId = issue.team.id;

			// Get or cache the canceled state ID for this team
			if (!teamCanceledStates.has(teamId)) {
				const canceledStateId = await tenant.linear.api.states.getCanceled({
					teamId,
				});
				teamCanceledStates.set(teamId, canceledStateId);
			}

			const canceledStateId = teamCanceledStates.get(teamId);

			if (!canceledStateId) {
				continue;
			}

			await tenant.linear.api.issues.update({
				id: issue.id,
				input: {
					stateId: canceledStateId,
				},
			});
			archivedCount++;
		} catch (error) {
			console.error(`Error archiving issue ${issue.identifier}:`, error);
		}
	}

	return {
		success: true,
		issuesFound: completedIssues.length,
		issuesArchived: archivedCount,
		timeRange,
		processedAt: new Date().toISOString(),
	};
}
