import {
	create as createBranch,
	deleteBranch,
	get as getBranch,
	list as listBranches,
} from './branches';
import { get as getCommit, getDiff, list as listCommits } from './commits';
import {
	create as createGroup,
	deleteGroup,
	get as getGroup,
	listProjects as listGroupProjects,
	list as listGroups,
	update as updateGroup,
} from './groups';
import {
	create as createIssue,
	createNote as createIssueNote,
	deleteIssue,
	get as getIssue,
	listNotes as listIssueNotes,
	list as listIssues,
	update as updateIssue,
} from './issues';
import {
	create as createLabel,
	deleteLabel,
	list as listLabels,
	update as updateLabel,
} from './labels';
import {
	approve,
	create as createMergeRequest,
	createNote as createMrNote,
	deleteMr,
	get as getMergeRequest,
	list as listMergeRequests,
	listNotes as listMrNotes,
	merge,
	update as updateMergeRequest,
} from './merge-requests';
import {
	create as createMilestone,
	deleteMilestone,
	get as getMilestone,
	list as listMilestones,
	update as updateMilestone,
} from './milestones';
import {
	cancel,
	create as createPipeline,
	deletePipeline,
	get as getPipeline,
	listJobs,
	list as listPipelines,
	retry,
} from './pipelines';
import {
	create as createProject,
	deleteProject,
	fork,
	get as getProject,
	list as listProjects,
	update as updateProject,
} from './projects';
import {
	create as createRelease,
	deleteRelease,
	get as getRelease,
	list as listReleases,
	update as updateRelease,
} from './releases';
import { compare, getFile, getTree } from './repository';
import { getCurrentUser, getUser, list as listUsers } from './users';

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
