import { corsair } from '@/server/corsair';

export async function generateWeeklyReportDocument(params: {
	tenantId: string;
}) {
	const { tenantId } = params;
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - 7);
	const weekAgo = date.toISOString();

	const completed = await tenant.linear.api.issues.list({
		filter: { completedAt: { gte: weekAgo } },
	});
	const created = await tenant.linear.api.issues.list({
		filter: { createdAt: { gte: weekAgo } },
	});
	const linearStats = {
		completed: completed.nodes?.length || 0,
		created: created.nodes?.length || 0,
	};

	const repositories = process.env.GITHUB_REPOS?.split(',') || [];
	let totalPRs = 0;
	for (const repo of repositories) {
		const [owner, repoName] = repo.split('/');
		try {
			const prs = await tenant.github.api.pullRequests.list({
				owner,
				repo: repoName,
				state: 'all',
			});
			const recentPRs = prs.data?.filter((pr: any) => 
				new Date(pr.updated_at) >= new Date(weekAgo)
			) || [];
			totalPRs += recentPRs.length;
		} catch (error) {
			console.error(`Error fetching PRs for ${repo}:`, error);
		}
	}
	const githubStats = { prs: totalPRs };

	const events = await tenant.posthog.db.events.search({
		data: { created_at: { $gte: weekAgo } },
	});
	const distinctUsers = new Set(events.map((e: any) => e.distinct_id));
	const posthogStats = {
		events: events.length,
		uniqueUsers: distinctUsers.size,
	};

	const reportContent = `# Weekly Report - ${new Date().toLocaleDateString()}

## Linear Statistics
- Completed Issues: ${linearStats.completed}
- Created Issues: ${linearStats.created}

## GitHub Statistics
- Pull Requests: ${githubStats.prs}

## PostHog Statistics
- Total Events: ${posthogStats.events}
- Unique Users: ${posthogStats.uniqueUsers}

## Summary
This report covers the period from ${new Date(weekAgo).toLocaleDateString()} to ${new Date().toLocaleDateString()}.
`;

	const doc = await tenant.googledrive.api.files.create({
		requestBody: {
			name: `Weekly Report - ${new Date().toISOString().split('T')[0]}.md`,
			mimeType: 'text/markdown',
		},
	});

	await tenant.googledrive.api.files.update({
		fileId: doc.id!,
		media: {
			body: reportContent,
			mimeType: 'text/markdown',
		},
	});

	return {
		success: true,
		documentId: doc.id,
		linearStats,
		githubStats,
		posthogStats,
		processedAt: new Date().toISOString(),
	};
}
