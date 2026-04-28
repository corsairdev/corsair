import {
	GitlabBranch,
	GitlabCommit,
	GitlabGroup,
	GitlabIssue,
	GitlabLabel,
	GitlabMergeRequest,
	GitlabMilestone,
	GitlabPipeline,
	GitlabProject,
	GitlabRelease,
	GitlabUser,
} from './database';

export const GitlabSchema = {
	version: '1.0.0',
	entities: {
		users: GitlabUser,
		projects: GitlabProject,
		issues: GitlabIssue,
		mergeRequests: GitlabMergeRequest,
		pipelines: GitlabPipeline,
		groups: GitlabGroup,
		branches: GitlabBranch,
		commits: GitlabCommit,
		labels: GitlabLabel,
		milestones: GitlabMilestone,
		releases: GitlabRelease,
	},
} as const;
