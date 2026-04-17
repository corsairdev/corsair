import { z } from 'zod';
import {
	GithubBranch,
	GithubComment,
	GithubDiscussion,
	GithubFork,
	GithubIssue,
	GithubPullRequest,
	GithubRelease,
	GithubRepository,
	GithubUser,
	GithubWorkflow,
} from './database';

export const GithubCredentials = z.object({
	token: z.string(),
});

export type GithubCredentials = z.infer<typeof GithubCredentials>;

export const GithubSchema = {
	version: '1.0.0',
	entities: {
		users: GithubUser,
		repositories: GithubRepository,
		issues: GithubIssue,
		pullRequests: GithubPullRequest,
		releases: GithubRelease,
		workflows: GithubWorkflow,
		discussions: GithubDiscussion,
		branches: GithubBranch,
		forks: GithubFork,
		comments: GithubComment,
	},
} as const;
