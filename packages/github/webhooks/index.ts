import {
	branchCreated,
	branchDeleted,
	tagCreated,
	tagDeleted,
} from './branches';
import {
	checkRunCompleted,
	checkRunCreated,
	checkRunRerequested,
	checkSuiteCompleted,
	checkSuiteRequested,
} from './checks';
import { commentCreated, commentDeleted, commentEdited } from './comments';
import { deploymentCreated, deploymentStatusCreated } from './deployments';
import {
	discussionAnswered,
	discussionClosed,
	discussionCommentCreated,
	discussionCommentDeleted,
	discussionCommentEdited,
	discussionCreated,
	discussionDeleted,
	discussionEdited,
	discussionReopened,
} from './discussions';
import { forked } from './fork';
import {
	issueAssigned,
	issueClosed,
	issueDeleted,
	issueEdited,
	issueLabeled,
	issueLocked,
	issueOpened,
	issuePinned,
	issueReopened,
	issueTransferred,
	issueUnassigned,
	issueUnlabeled,
	issueUnlocked,
	issueUnpinned,
} from './issues';
import { labelCreated, labelDeleted, labelEdited } from './labels';
import {
	memberAdded,
	memberRemoved,
	membershipAdded,
	membershipRemoved,
} from './members';
import {
	milestoneClosed,
	milestoneCreated,
	milestoneDeleted,
	milestoneEdited,
	milestoneOpened,
} from './milestones';
import {
	pullRequestReviewCommentCreated,
	pullRequestReviewCommentDeleted,
	pullRequestReviewCommentEdited,
	pullRequestReviewDismissed,
	pullRequestReviewEdited,
	pullRequestReviewSubmitted,
	pullRequestReviewThreadResolved,
	pullRequestReviewThreadUnresolved,
} from './pull-request-reviews';
import {
	pullRequestClosed,
	pullRequestConvertedToDraft,
	pullRequestLabeled,
	pullRequestOpened,
	pullRequestReadyForReview,
	pullRequestReopened,
	pullRequestReviewRequested,
	pullRequestSynchronize,
	pullRequestUnlabeled,
} from './pull-requests';
import { push } from './push';
import {
	releaseCreated,
	releaseDeleted,
	releaseEdited,
	releasePrereleased,
	releasePublished,
	releaseReleased,
	releaseUnpublished,
} from './releases';
import {
	repositoryArchived,
	repositoryCreated,
	repositoryDeleted,
	repositoryPrivatized,
	repositoryPublicized,
	repositoryRenamed,
	repositoryTransferred,
	repositoryUnarchived,
} from './repositories';
import {
	dependabotAlertAutoDismissed,
	dependabotAlertAutoReopened,
	dependabotAlertCreated,
	dependabotAlertDismissed,
	dependabotAlertFixed,
	dependabotAlertReopened,
} from './security';
import { starCreated, starDeleted } from './stars';
import { watchStarted } from './watch';
import {
	workflowDispatched,
	workflowJobCompleted,
	workflowJobInProgress,
	workflowJobQueued,
	workflowJobWaiting,
	workflowRunCompleted,
	workflowRunInProgress,
	workflowRunRequested,
} from './workflows';

// ─────────────────────────────────────────────────────────────────────────────
// Pull Request webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const PullRequestWebhooks = {
	opened: pullRequestOpened,
	closed: pullRequestClosed,
	synchronize: pullRequestSynchronize,
	reopened: pullRequestReopened,
	labeled: pullRequestLabeled,
	unlabeled: pullRequestUnlabeled,
	reviewRequested: pullRequestReviewRequested,
	readyForReview: pullRequestReadyForReview,
	convertedToDraft: pullRequestConvertedToDraft,
};

// ─────────────────────────────────────────────────────────────────────────────
// Pull Request Review webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const PullRequestReviewWebhooks = {
	submitted: pullRequestReviewSubmitted,
	dismissed: pullRequestReviewDismissed,
	edited: pullRequestReviewEdited,
};

export const PullRequestReviewCommentWebhooks = {
	created: pullRequestReviewCommentCreated,
	edited: pullRequestReviewCommentEdited,
	deleted: pullRequestReviewCommentDeleted,
};

export const PullRequestReviewThreadWebhooks = {
	resolved: pullRequestReviewThreadResolved,
	unresolved: pullRequestReviewThreadUnresolved,
};

// ─────────────────────────────────────────────────────────────────────────────
// Push webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const PushWebhooks = {
	push,
};

// ─────────────────────────────────────────────────────────────────────────────
// Branch & Tag webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const BranchWebhooks = {
	created: branchCreated,
	deleted: branchDeleted,
};

export const TagWebhooks = {
	created: tagCreated,
	deleted: tagDeleted,
};

// ─────────────────────────────────────────────────────────────────────────────
// Star webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const StarWebhooks = {
	created: starCreated,
	deleted: starDeleted,
};

// ─────────────────────────────────────────────────────────────────────────────
// Issue webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const IssueWebhooks = {
	opened: issueOpened,
	closed: issueClosed,
	reopened: issueReopened,
	labeled: issueLabeled,
	unlabeled: issueUnlabeled,
	assigned: issueAssigned,
	unassigned: issueUnassigned,
	edited: issueEdited,
	deleted: issueDeleted,
	transferred: issueTransferred,
	locked: issueLocked,
	unlocked: issueUnlocked,
	pinned: issuePinned,
	unpinned: issueUnpinned,
};

export const CommentWebhooks = {
	created: commentCreated,
	edited: commentEdited,
	deleted: commentDeleted,
};

// ─────────────────────────────────────────────────────────────────────────────
// Release webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const ReleaseWebhooks = {
	published: releasePublished,
	created: releaseCreated,
	edited: releaseEdited,
	deleted: releaseDeleted,
	prereleased: releasePrereleased,
	released: releaseReleased,
	unpublished: releaseUnpublished,
};

// ─────────────────────────────────────────────────────────────────────────────
// Deployment webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const DeploymentWebhooks = {
	created: deploymentCreated,
};

export const DeploymentStatusWebhooks = {
	created: deploymentStatusCreated,
};

// ─────────────────────────────────────────────────────────────────────────────
// Workflow webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const WorkflowRunWebhooks = {
	completed: workflowRunCompleted,
	inProgress: workflowRunInProgress,
	requested: workflowRunRequested,
};

export const WorkflowJobWebhooks = {
	completed: workflowJobCompleted,
	queued: workflowJobQueued,
	inProgress: workflowJobInProgress,
	waiting: workflowJobWaiting,
};

export const WorkflowDispatchWebhooks = {
	dispatched: workflowDispatched,
};

// ─────────────────────────────────────────────────────────────────────────────
// Repository webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const RepositoryWebhooks = {
	created: repositoryCreated,
	deleted: repositoryDeleted,
	archived: repositoryArchived,
	unarchived: repositoryUnarchived,
	renamed: repositoryRenamed,
	publicized: repositoryPublicized,
	privatized: repositoryPrivatized,
	transferred: repositoryTransferred,
};

// ─────────────────────────────────────────────────────────────────────────────
// Check webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const CheckRunWebhooks = {
	completed: checkRunCompleted,
	created: checkRunCreated,
	rerequested: checkRunRerequested,
};

export const CheckSuiteWebhooks = {
	completed: checkSuiteCompleted,
	requested: checkSuiteRequested,
};

// ─────────────────────────────────────────────────────────────────────────────
// Discussion webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const DiscussionWebhooks = {
	created: discussionCreated,
	edited: discussionEdited,
	closed: discussionClosed,
	reopened: discussionReopened,
	answered: discussionAnswered,
	deleted: discussionDeleted,
};

export const DiscussionCommentWebhooks = {
	created: discussionCommentCreated,
	edited: discussionCommentEdited,
	deleted: discussionCommentDeleted,
};

// ─────────────────────────────────────────────────────────────────────────────
// Security (Dependabot) webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const DependabotAlertWebhooks = {
	created: dependabotAlertCreated,
	dismissed: dependabotAlertDismissed,
	fixed: dependabotAlertFixed,
	reopened: dependabotAlertReopened,
	autoDismissed: dependabotAlertAutoDismissed,
	autoReopened: dependabotAlertAutoReopened,
};

// ─────────────────────────────────────────────────────────────────────────────
// Member & Membership webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const MemberWebhooks = {
	added: memberAdded,
	removed: memberRemoved,
};

export const MembershipWebhooks = {
	added: membershipAdded,
	removed: membershipRemoved,
};

// ─────────────────────────────────────────────────────────────────────────────
// Milestone webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const MilestoneWebhooks = {
	created: milestoneCreated,
	closed: milestoneClosed,
	opened: milestoneOpened,
	edited: milestoneEdited,
	deleted: milestoneDeleted,
};

// ─────────────────────────────────────────────────────────────────────────────
// Label webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const LabelWebhooks = {
	created: labelCreated,
	edited: labelEdited,
	deleted: labelDeleted,
};

// ─────────────────────────────────────────────────────────────────────────────
// Fork & Watch webhooks
// ─────────────────────────────────────────────────────────────────────────────

export const ForkWebhooks = {
	forked,
};

export const WatchWebhooks = {
	started: watchStarted,
};

export * from './types';
