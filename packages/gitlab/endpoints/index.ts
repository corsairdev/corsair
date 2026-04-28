import { getCurrentUser, getUser, list as listUsers } from './users';
import {
	list as listProjects,
	get as getProject,
	create as createProject,
	update as updateProject,
	deleteProject,
	fork,
} from './projects';
import {
	list as listIssues,
	get as getIssue,
	create as createIssue,
	update as updateIssue,
	deleteIssue,
	listNotes as listIssueNotes,
	createNote as createIssueNote,
} from './issues';
import {
	list as listMergeRequests,
	get as getMergeRequest,
	create as createMergeRequest,
	update as updateMergeRequest,
	deleteMr,
	merge,
	approve,
	listNotes as listMrNotes,
	createNote as createMrNote,
} from './merge-requests';
import {
	list as listBranches,
	get as getBranch,
	create as createBranch,
	deleteBranch,
} from './branches';
import {
	list as listCommits,
	get as getCommit,
	getDiff,
} from './commits';
import {
	list as listPipelines,
	get as getPipeline,
	create as createPipeline,
	retry,
	cancel,
	deletePipeline,
	listJobs,
} from './pipelines';
import {
	list as listGroups,
	get as getGroup,
	create as createGroup,
	update as updateGroup,
	deleteGroup,
	listProjects as listGroupProjects,
} from './groups';
import {
	list as listLabels,
	create as createLabel,
	update as updateLabel,
	deleteLabel,
} from './labels';
import {
	list as listMilestones,
	get as getMilestone,
	create as createMilestone,
	update as updateMilestone,
	deleteMilestone,
} from './milestones';
import {
	list as listReleases,
	get as getRelease,
	create as createRelease,
	update as updateRelease,
	deleteRelease,
} from './releases';
import { getTree, getFile, compare } from './repository';

export const Users = {
	getCurrentUser,
	getUser,
	list: listUsers,
};

export const Projects = {
	list: listProjects,
	get: getProject,
	create: createProject,
	update: updateProject,
	delete: deleteProject,
	fork,
};

export const Issues = {
	list: listIssues,
	get: getIssue,
	create: createIssue,
	update: updateIssue,
	delete: deleteIssue,
	listNotes: listIssueNotes,
	createNote: createIssueNote,
};

export const MergeRequests = {
	list: listMergeRequests,
	get: getMergeRequest,
	create: createMergeRequest,
	update: updateMergeRequest,
	delete: deleteMr,
	merge,
	approve,
	listNotes: listMrNotes,
	createNote: createMrNote,
};

export const Branches = {
	list: listBranches,
	get: getBranch,
	create: createBranch,
	delete: deleteBranch,
};

export const Commits = {
	list: listCommits,
	get: getCommit,
	getDiff,
};

export const Pipelines = {
	list: listPipelines,
	get: getPipeline,
	create: createPipeline,
	retry,
	cancel,
	delete: deletePipeline,
	listJobs,
};

export const Groups = {
	list: listGroups,
	get: getGroup,
	create: createGroup,
	update: updateGroup,
	delete: deleteGroup,
	listProjects: listGroupProjects,
};

export const Labels = {
	list: listLabels,
	create: createLabel,
	update: updateLabel,
	delete: deleteLabel,
};

export const Milestones = {
	list: listMilestones,
	get: getMilestone,
	create: createMilestone,
	update: updateMilestone,
	delete: deleteMilestone,
};

export const Releases = {
	list: listReleases,
	get: getRelease,
	create: createRelease,
	update: updateRelease,
	delete: deleteRelease,
};

export const Repository = {
	getTree,
	getFile,
	compare,
};

export * from './types';
