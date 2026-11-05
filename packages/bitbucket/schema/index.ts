import {
	BitbucketBranchEntity,
	BitbucketCommitEntity,
	BitbucketIssueEntity,
	BitbucketPipelineEntity,
	BitbucketProjectEntity,
	BitbucketPullRequestEntity,
	BitbucketRepositoryEntity,
	BitbucketSnippetEntity,
	BitbucketTagEntity,
	BitbucketUserEntity,
	BitbucketWorkspaceEntity,
} from './database';

export const BitbucketSchema = {
	version: '1.0.0',
	entities: {
		workspaces: BitbucketWorkspaceEntity,
		repositories: BitbucketRepositoryEntity,
		projects: BitbucketProjectEntity,
		pullRequests: BitbucketPullRequestEntity,
		issues: BitbucketIssueEntity,
		users: BitbucketUserEntity,
		snippets: BitbucketSnippetEntity,
		pipelines: BitbucketPipelineEntity,
		commits: BitbucketCommitEntity,
		branches: BitbucketBranchEntity,
		tags: BitbucketTagEntity,
	},
} as const;

export * from './database';
export * from './primitives';
