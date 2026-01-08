import {
	createErrorResponse,
	createSuccessResponse,
	validateCredentials,
} from '../../base';
import type {
	GitHubClient,
	GitHubPlugin,
	GitHubPluginContext,
	ListRepositoriesResponse,
} from '../types';

export const listRepositories = async ({
	config,
	client,
	options,
	ctx,
}: {
	config: GitHubPlugin;
	client: GitHubClient;
	options?: {
		type?: 'all' | 'owner' | 'member';
		sort?: 'created' | 'updated' | 'pushed' | 'full_name';
		direction?: 'asc' | 'desc';
		page?: number;
		perPage?: number;
	};
	ctx: GitHubPluginContext;
}): Promise<ListRepositoriesResponse> => {
	// Validate credentials
	const credentialCheck = validateCredentials(config, ['token'], 'github');
	if (!credentialCheck.valid) {
		return createErrorResponse(
			new Error(credentialCheck.error),
			credentialCheck.error,
		) as ListRepositoriesResponse;
	}

	try {
		const result = await client.listRepositories(options);

		const responseData = {
			repositories: result.map((repo) => ({
				id: repo.id,
				name: repo.name,
				fullName: repo.full_name,
				description: repo.description,
				private: repo.private,
				owner: repo.owner.login,
				url: repo.html_url,
				createdAt: repo.created_at,
				updatedAt: repo.updated_at,
			})),
		};

		// Database hook: Save repositories to database if repositories table exists
		if (
			ctx.db.repositories &&
			typeof ctx.db.repositories.insert === 'function'
		) {
			try {
				for (const repo of result) {
					await ctx.db.repositories.insert({
						id: repo.id.toString(),
						name: repo.name,
						full_name: repo.full_name,
						description: repo.description,
						private: repo.private,
						owner: repo.owner.login,
						url: repo.html_url,
						created_at: repo.created_at,
						updated_at: repo.updated_at,
					});
				}
			} catch (dbError: unknown) {
				console.warn('Failed to save repositories to database:', dbError);
			}
		}

		return createSuccessResponse(responseData) as ListRepositoriesResponse;
	} catch (error) {
		return createErrorResponse(error) as ListRepositoriesResponse;
	}
};
