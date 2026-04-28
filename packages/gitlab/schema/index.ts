import {
	GitlabUser,
	GitlabProject,
	GitlabIssue,
	GitlabMergeRequest,
	GitlabPipeline,
	GitlabGroup,
	GitlabBranch,
	GitlabCommit,
	GitlabLabel,
	GitlabMilestone,
	GitlabRelease,
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
