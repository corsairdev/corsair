import { corsair } from '@/server/corsair';

export async function createGithubIssuesFromLinearBacklog(params: {
	tenantId: string;
	repository?: string;
}) {
	const { tenantId, repository: providedRepo } = params;
	const tenant = corsair.withTenant(tenantId);

	const repository = providedRepo || process.env.GITHUB_REPOS?.split(',')[0] || '';

	if (!repository) {
		throw new Error('Repository not specified');
	}

	const [owner, repo] = repository.split('/');

	const issues = await tenant.linear.api.issues.list({
		filter: {
			state: { name: { eq: 'Backlog' } },
		},
	});
	const backlogIssues = issues.nodes || [];

	const createdIssues = [];
	for (const linearIssue of backlogIssues.slice(0, 20)) {
		try {
			const githubIssue = await tenant.github.api.issues.create({
				owner: owner || '',
				repo: repo || '',
				title: `[Linear ${linearIssue.identifier}] ${linearIssue.title}`,
				body: `Created from Linear issue ${linearIssue.identifier}\n\n*Description:*\n${linearIssue.description || 'No description'}\n\n*Linear URL:* ${linearIssue.url || 'N/A'}`,
				labels: linearIssue.labels?.map((l: any) => l.name) || [],
			});
			createdIssues.push(githubIssue);
		} catch (error) {
			console.error(`Error creating GitHub issue for ${linearIssue.identifier}:`, error);
		}
	}

	return {
		success: true,
		linearIssuesProcessed: backlogIssues.length,
		githubIssuesCreated: createdIssues.length,
		repository,
		processedAt: new Date().toISOString(),
	};
}
