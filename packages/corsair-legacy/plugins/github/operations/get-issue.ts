import {
	createErrorResponse,
	createSuccessResponse,
	executeDatabaseHook,
	validateCredentials,
	type BaseOperationParams,
} from '../../base';
import type {
	GetIssueResponse,
	GitHubClient,
	GitHubPlugin,
	GitHubPluginContext,
} from '../types';

export const getIssue = async ({
	config,
	client,
	owner,
	repo,
	issueNumber,
	ctx,
}: {
	config: GitHubPlugin;
	client: GitHubClient;
	owner: string;
	repo: string;
	issueNumber: number;
	ctx: GitHubPluginContext;
}): Promise<GetIssueResponse> => {
	// Validate credentials
	const credentialCheck = validateCredentials(config, ['token'], 'github');
	if (!credentialCheck.valid) {
		return createErrorResponse(
			new Error(credentialCheck.error),
			credentialCheck.error,
		) as GetIssueResponse;
	}

	try {
		const result = await client.getIssue({
			owner,
			repo,
			issueNumber,
		});

		const responseData = {
			id: result.id,
			number: result.number,
			title: result.title,
			body: result.body,
			state: result.state,
			author: result.user.login,
			createdAt: result.created_at,
			updatedAt: result.updated_at,
			closedAt: result.closed_at,
		};

		// Database hook: Save issue to database if issues table exists
		await executeDatabaseHook(
			ctx,
			{
				tableName: 'issues',
				transform: () => ({
					id: result.id.toString(),
					number: result.number,
					title: result.title,
					body: result.body,
					state: result.state,
					repo: `${owner}/${repo}`,
					author: result.user.login,
					created_at: result.created_at,
					updated_at: result.updated_at,
					closed_at: result.closed_at || '',
				}),
			},
			responseData,
		);

		return createSuccessResponse(responseData) as GetIssueResponse;
	} catch (error) {
		return createErrorResponse(error) as GetIssueResponse;
	}
};
