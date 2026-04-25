import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import type { GithubEndpointInputs, GithubEndpointOutputs } from './endpoints';
import {
	CommentsEndpoints,
	DiscussionsEndpoints,
	ForksEndpoints,
	IssuesEndpoints,
	PullRequestsEndpoints,
	ReleasesEndpoints,
	RepositoriesEndpoints,
	WorkflowsEndpoints,
} from './endpoints';
import {
	GithubEndpointInputSchemas,
	GithubEndpointOutputSchemas,
} from './endpoints/types';
import type { GithubCredentials } from './schema';
import { GithubSchema } from './schema';
import {
	BranchWebhooks,
	CheckRunWebhooks,
	CheckSuiteWebhooks,
	CommentWebhooks,
	DependabotAlertWebhooks,
	DeploymentStatusWebhooks,
	DeploymentWebhooks,
	DiscussionCommentWebhooks,
	DiscussionWebhooks,
	ForkWebhooks,
	IssueWebhooks,
	LabelWebhooks,
	MembershipWebhooks,
	MemberWebhooks,
	MilestoneWebhooks,
	PullRequestReviewCommentWebhooks,
	PullRequestReviewThreadWebhooks,
	PullRequestReviewWebhooks,
	PullRequestWebhooks,
	PushWebhooks,
	ReleaseWebhooks,
	RepositoryWebhooks,
	StarWebhooks,
	TagWebhooks,
	WatchWebhooks,
	WorkflowDispatchWebhooks,
	WorkflowJobWebhooks,
	WorkflowRunWebhooks,
} from './webhooks';
import type {
	BranchCreatedEvent,
	BranchDeletedEvent,
	CheckRunCompletedEvent,
	CheckRunCreatedEvent,
	CheckRunRerequestedEvent,
	CheckSuiteCompletedEvent,
	CheckSuiteRequestedEvent,
	CommentCreatedEvent,
	CommentDeletedEvent,
	CommentEditedEvent,
	DependabotAlertAutoDismissedEvent,
	DependabotAlertAutoReopenedEvent,
	DependabotAlertCreatedEvent,
	DependabotAlertDismissedEvent,
	DependabotAlertFixedEvent,
	DependabotAlertReopenedEvent,
	DeploymentCreatedEvent,
	DeploymentStatusCreatedEvent,
	DiscussionAnsweredEvent,
	DiscussionClosedEvent,
	DiscussionCommentCreatedEvent,
	DiscussionCommentDeletedEvent,
	DiscussionCommentEditedEvent,
	DiscussionCreatedEvent,
	DiscussionDeletedEvent,
	DiscussionEditedEvent,
	DiscussionReopenedEvent,
	ForkEvent,
	GithubWebhookEvent,
	GithubWebhookOutputs,
	GithubWebhookPayload,
	IssueAssignedEvent,
	IssueClosedEvent,
	IssueDeletedEvent,
	IssueEditedEvent,
	IssueLabeledEvent,
	IssueLockedEvent,
	IssueOpenedEvent,
	IssuePinnedEvent,
	IssueReopenedEvent,
	IssueTransferredEvent,
	IssueUnassignedEvent,
	IssueUnlabeledEvent,
	IssueUnlockedEvent,
	IssueUnpinnedEvent,
	LabelCreatedEvent,
	LabelDeletedEvent,
	LabelEditedEvent,
	MemberAddedEvent,
	MemberRemovedEvent,
	MembershipAddedEvent,
	MembershipRemovedEvent,
	MilestoneClosedEvent,
	MilestoneCreatedEvent,
	MilestoneDeletedEvent,
	MilestoneEditedEvent,
	MilestoneOpenedEvent,
	PullRequestClosedEvent,
	PullRequestConvertedToDraftEvent,
	PullRequestLabeledEvent,
	PullRequestOpenedEvent,
	PullRequestReadyForReviewEvent,
	PullRequestReopenedEvent,
	PullRequestReviewCommentCreatedEvent,
	PullRequestReviewCommentDeletedEvent,
	PullRequestReviewCommentEditedEvent,
	PullRequestReviewDismissedEvent,
	PullRequestReviewEditedEvent,
	PullRequestReviewRequestedEvent,
	PullRequestReviewSubmittedEvent,
	PullRequestReviewThreadResolvedEvent,
	PullRequestReviewThreadUnresolvedEvent,
	PullRequestSynchronizeEvent,
	PullRequestUnlabeledEvent,
	PushEventType,
	ReleaseCreatedEvent,
	ReleaseDeletedEvent,
	ReleaseEditedEvent,
	ReleasePrereleaseEvent,
	ReleasePublishedEvent,
	ReleaseReleasedEvent,
	ReleaseUnpublishedEvent,
	RepositoryArchivedEvent,
	RepositoryCreatedEvent,
	RepositoryDeletedEvent,
	RepositoryPrivatizedEvent,
	RepositoryPublicizedEvent,
	RepositoryRenamedEvent,
	RepositoryTransferredEvent,
	RepositoryUnarchivedEvent,
	StarCreatedEvent,
	StarDeletedEvent,
	TagCreatedEvent,
	TagDeletedEvent,
	WatchStartedEvent,
	WorkflowDispatchEvent,
	WorkflowJobCompletedEvent,
	WorkflowJobInProgressEvent,
	WorkflowJobQueuedEvent,
	WorkflowJobWaitingEvent,
	WorkflowRunCompletedEvent,
	WorkflowRunInProgressEvent,
	WorkflowRunRequestedEvent,
} from './webhooks/types';
import {
	BranchCreatedEventSchema,
	BranchDeletedEventSchema,
	CheckRunCompletedEventSchema,
	CheckRunCreatedEventSchema,
	CheckRunRerequestedEventSchema,
	CheckSuiteCompletedEventSchema,
	CheckSuiteRequestedEventSchema,
	CommentCreatedEventSchema,
	CommentDeletedEventSchema,
	CommentEditedEventSchema,
	DependabotAlertAutoDismissedEventSchema,
	DependabotAlertAutoReopenedEventSchema,
	DependabotAlertCreatedEventSchema,
	DependabotAlertDismissedEventSchema,
	DependabotAlertFixedEventSchema,
	DependabotAlertReopenedEventSchema,
	DeploymentCreatedEventSchema,
	DeploymentStatusCreatedEventSchema,
	DiscussionAnsweredEventSchema,
	DiscussionClosedEventSchema,
	DiscussionCommentCreatedEventSchema,
	DiscussionCommentDeletedEventSchema,
	DiscussionCommentEditedEventSchema,
	DiscussionCreatedEventSchema,
	DiscussionDeletedEventSchema,
	DiscussionEditedEventSchema,
	DiscussionReopenedEventSchema,
	ForkEventSchema,
	IssueAssignedEventSchema,
	IssueClosedEventSchema,
	IssueDeletedEventSchema,
	IssueEditedEventSchema,
	IssueLabeledEventSchema,
	IssueLockedEventSchema,
	IssueOpenedEventSchema,
	IssuePinnedEventSchema,
	IssueReopenedEventSchema,
	IssueTransferredEventSchema,
	IssueUnassignedEventSchema,
	IssueUnlabeledEventSchema,
	IssueUnlockedEventSchema,
	IssueUnpinnedEventSchema,
	LabelCreatedEventSchema,
	LabelDeletedEventSchema,
	LabelEditedEventSchema,
	MemberAddedEventSchema,
	MemberRemovedEventSchema,
	MembershipAddedEventSchema,
	MembershipRemovedEventSchema,
	MilestoneClosedEventSchema,
	MilestoneCreatedEventSchema,
	MilestoneDeletedEventSchema,
	MilestoneEditedEventSchema,
	MilestoneOpenedEventSchema,
	PullRequestClosedEventSchema,
	PullRequestConvertedToDraftEventSchema,
	PullRequestLabeledEventSchema,
	PullRequestOpenedEventSchema,
	PullRequestReadyForReviewEventSchema,
	PullRequestReopenedEventSchema,
	PullRequestReviewCommentCreatedEventSchema,
	PullRequestReviewCommentDeletedEventSchema,
	PullRequestReviewCommentEditedEventSchema,
	PullRequestReviewDismissedEventSchema,
	PullRequestReviewEditedEventSchema,
	PullRequestReviewRequestedEventSchema,
	PullRequestReviewSubmittedEventSchema,
	PullRequestReviewThreadResolvedEventSchema,
	PullRequestReviewThreadUnresolvedEventSchema,
	PullRequestSynchronizeEventSchema,
	PullRequestUnlabeledEventSchema,
	PushEventSchema,
	ReleaseCreatedEventSchema,
	ReleaseDeletedEventSchema,
	ReleaseEditedEventSchema,
	ReleasePrereleaseEventSchema,
	ReleasePublishedEventSchema,
	ReleaseReleasedEventSchema,
	ReleaseUnpublishedEventSchema,
	RepositoryArchivedEventSchema,
	RepositoryCreatedEventSchema,
	RepositoryDeletedEventSchema,
	RepositoryPrivatizedEventSchema,
	RepositoryPublicizedEventSchema,
	RepositoryRenamedEventSchema,
	RepositoryTransferredEventSchema,
	RepositoryUnarchivedEventSchema,
	StarCreatedEventSchema,
	StarDeletedEventSchema,
	TagCreatedEventSchema,
	TagDeletedEventSchema,
	WatchStartedEventSchema,
	WorkflowDispatchEventSchema,
	WorkflowJobCompletedEventSchema,
	WorkflowJobInProgressEventSchema,
	WorkflowJobQueuedEventSchema,
	WorkflowJobWaitingEventSchema,
	WorkflowRunCompletedEventSchema,
	WorkflowRunInProgressEventSchema,
	WorkflowRunRequestedEventSchema,
} from './webhooks/types';

export {
	createGithubEventMatch,
	type StarCreatedEvent,
	type StarDeletedEvent,
	verifyGithubWebhookSignature,
} from './webhooks/types';

export type GithubContext = CorsairPluginContext<
	typeof GithubSchema,
	GithubPluginOptions
>;

export type GithubKeyBuilderContext = KeyBuilderContext<GithubPluginOptions>;

type GithubEndpoint<K extends keyof GithubEndpointOutputs> = CorsairEndpoint<
	GithubContext,
	GithubEndpointInputs[K],
	GithubEndpointOutputs[K]
>;

export type GithubEndpoints = {
	issuesList: GithubEndpoint<'issuesList'>;
	issuesGet: GithubEndpoint<'issuesGet'>;
	issuesCreate: GithubEndpoint<'issuesCreate'>;
	issuesUpdate: GithubEndpoint<'issuesUpdate'>;
	issuesCreateComment: GithubEndpoint<'issuesCreateComment'>;
	pullRequestsList: GithubEndpoint<'pullRequestsList'>;
	pullRequestsGet: GithubEndpoint<'pullRequestsGet'>;
	pullRequestsListReviews: GithubEndpoint<'pullRequestsListReviews'>;
	pullRequestsCreateReview: GithubEndpoint<'pullRequestsCreateReview'>;
	repositoriesList: GithubEndpoint<'repositoriesList'>;
	repositoriesGet: GithubEndpoint<'repositoriesGet'>;
	repositoriesListBranches: GithubEndpoint<'repositoriesListBranches'>;
	repositoriesListCommits: GithubEndpoint<'repositoriesListCommits'>;
	repositoriesGetContent: GithubEndpoint<'repositoriesGetContent'>;
	releasesList: GithubEndpoint<'releasesList'>;
	releasesGet: GithubEndpoint<'releasesGet'>;
	releasesCreate: GithubEndpoint<'releasesCreate'>;
	releasesUpdate: GithubEndpoint<'releasesUpdate'>;
	workflowsList: GithubEndpoint<'workflowsList'>;
	workflowsGet: GithubEndpoint<'workflowsGet'>;
	workflowsListRuns: GithubEndpoint<'workflowsListRuns'>;
	discussionsList: GithubEndpoint<'discussionsList'>;
	discussionsGet: GithubEndpoint<'discussionsGet'>;
	forksList: GithubEndpoint<'forksList'>;
	commentsList: GithubEndpoint<'commentsList'>;
	commentsListForIssue: GithubEndpoint<'commentsListForIssue'>;
	commentsGet: GithubEndpoint<'commentsGet'>;
	commentsUpdate: GithubEndpoint<'commentsUpdate'>;
	commentsDelete: GithubEndpoint<'commentsDelete'>;
};

export type GithubBoundEndpoints = BindEndpoints<typeof githubEndpointsNested>;

type GithubWebhook<
	K extends keyof GithubWebhookOutputs,
	TEvent extends GithubWebhookEvent,
> = CorsairWebhook<
	GithubContext,
	GithubWebhookPayload<TEvent>,
	GithubWebhookOutputs[K]
>;

export type GithubWebhooks = {
	// Pull Requests
	pullRequestOpened: GithubWebhook<'pullRequestOpened', PullRequestOpenedEvent>;
	pullRequestClosed: GithubWebhook<'pullRequestClosed', PullRequestClosedEvent>;
	pullRequestSynchronize: GithubWebhook<
		'pullRequestSynchronize',
		PullRequestSynchronizeEvent
	>;
	pullRequestReopened: GithubWebhook<
		'pullRequestReopened',
		PullRequestReopenedEvent
	>;
	pullRequestLabeled: GithubWebhook<
		'pullRequestLabeled',
		PullRequestLabeledEvent
	>;
	pullRequestUnlabeled: GithubWebhook<
		'pullRequestUnlabeled',
		PullRequestUnlabeledEvent
	>;
	pullRequestReviewRequested: GithubWebhook<
		'pullRequestReviewRequested',
		PullRequestReviewRequestedEvent
	>;
	pullRequestReadyForReview: GithubWebhook<
		'pullRequestReadyForReview',
		PullRequestReadyForReviewEvent
	>;
	pullRequestConvertedToDraft: GithubWebhook<
		'pullRequestConvertedToDraft',
		PullRequestConvertedToDraftEvent
	>;
	// Pull Request Reviews
	pullRequestReviewSubmitted: GithubWebhook<
		'pullRequestReviewSubmitted',
		PullRequestReviewSubmittedEvent
	>;
	pullRequestReviewDismissed: GithubWebhook<
		'pullRequestReviewDismissed',
		PullRequestReviewDismissedEvent
	>;
	pullRequestReviewEdited: GithubWebhook<
		'pullRequestReviewEdited',
		PullRequestReviewEditedEvent
	>;
	// Pull Request Review Comments
	pullRequestReviewCommentCreated: GithubWebhook<
		'pullRequestReviewCommentCreated',
		PullRequestReviewCommentCreatedEvent
	>;
	pullRequestReviewCommentEdited: GithubWebhook<
		'pullRequestReviewCommentEdited',
		PullRequestReviewCommentEditedEvent
	>;
	pullRequestReviewCommentDeleted: GithubWebhook<
		'pullRequestReviewCommentDeleted',
		PullRequestReviewCommentDeletedEvent
	>;
	// Pull Request Review Threads
	pullRequestReviewThreadResolved: GithubWebhook<
		'pullRequestReviewThreadResolved',
		PullRequestReviewThreadResolvedEvent
	>;
	pullRequestReviewThreadUnresolved: GithubWebhook<
		'pullRequestReviewThreadUnresolved',
		PullRequestReviewThreadUnresolvedEvent
	>;
	// Push
	push: GithubWebhook<'push', PushEventType>;
	// Branches & Tags
	branchCreated: GithubWebhook<'branchCreated', BranchCreatedEvent>;
	branchDeleted: GithubWebhook<'branchDeleted', BranchDeletedEvent>;
	tagCreated: GithubWebhook<'tagCreated', TagCreatedEvent>;
	tagDeleted: GithubWebhook<'tagDeleted', TagDeletedEvent>;
	// Stars
	starCreated: GithubWebhook<'starCreated', StarCreatedEvent>;
	starDeleted: GithubWebhook<'starDeleted', StarDeletedEvent>;
	// Issues
	issueOpened: GithubWebhook<'issueOpened', IssueOpenedEvent>;
	issueClosed: GithubWebhook<'issueClosed', IssueClosedEvent>;
	issueReopened: GithubWebhook<'issueReopened', IssueReopenedEvent>;
	issueLabeled: GithubWebhook<'issueLabeled', IssueLabeledEvent>;
	issueUnlabeled: GithubWebhook<'issueUnlabeled', IssueUnlabeledEvent>;
	issueAssigned: GithubWebhook<'issueAssigned', IssueAssignedEvent>;
	issueUnassigned: GithubWebhook<'issueUnassigned', IssueUnassignedEvent>;
	issueEdited: GithubWebhook<'issueEdited', IssueEditedEvent>;
	issueDeleted: GithubWebhook<'issueDeleted', IssueDeletedEvent>;
	issueTransferred: GithubWebhook<'issueTransferred', IssueTransferredEvent>;
	issueLocked: GithubWebhook<'issueLocked', IssueLockedEvent>;
	issueUnlocked: GithubWebhook<'issueUnlocked', IssueUnlockedEvent>;
	issuePinned: GithubWebhook<'issuePinned', IssuePinnedEvent>;
	issueUnpinned: GithubWebhook<'issueUnpinned', IssueUnpinnedEvent>;
	// Comments (issue & pull request)
	commentCreated: GithubWebhook<'commentCreated', CommentCreatedEvent>;
	commentEdited: GithubWebhook<'commentEdited', CommentEditedEvent>;
	commentDeleted: GithubWebhook<'commentDeleted', CommentDeletedEvent>;
	// Releases
	releasePublished: GithubWebhook<'releasePublished', ReleasePublishedEvent>;
	releaseCreated: GithubWebhook<'releaseCreated', ReleaseCreatedEvent>;
	releaseEdited: GithubWebhook<'releaseEdited', ReleaseEditedEvent>;
	releaseDeleted: GithubWebhook<'releaseDeleted', ReleaseDeletedEvent>;
	releasePrereleased: GithubWebhook<
		'releasePrereleased',
		ReleasePrereleaseEvent
	>;
	releaseReleased: GithubWebhook<'releaseReleased', ReleaseReleasedEvent>;
	releaseUnpublished: GithubWebhook<
		'releaseUnpublished',
		ReleaseUnpublishedEvent
	>;
	// Deployments
	deploymentCreated: GithubWebhook<'deploymentCreated', DeploymentCreatedEvent>;
	deploymentStatusCreated: GithubWebhook<
		'deploymentStatusCreated',
		DeploymentStatusCreatedEvent
	>;
	// Workflows
	workflowRunCompleted: GithubWebhook<
		'workflowRunCompleted',
		WorkflowRunCompletedEvent
	>;
	workflowRunInProgress: GithubWebhook<
		'workflowRunInProgress',
		WorkflowRunInProgressEvent
	>;
	workflowRunRequested: GithubWebhook<
		'workflowRunRequested',
		WorkflowRunRequestedEvent
	>;
	workflowJobCompleted: GithubWebhook<
		'workflowJobCompleted',
		WorkflowJobCompletedEvent
	>;
	workflowJobQueued: GithubWebhook<'workflowJobQueued', WorkflowJobQueuedEvent>;
	workflowJobInProgress: GithubWebhook<
		'workflowJobInProgress',
		WorkflowJobInProgressEvent
	>;
	workflowJobWaiting: GithubWebhook<
		'workflowJobWaiting',
		WorkflowJobWaitingEvent
	>;
	workflowDispatched: GithubWebhook<
		'workflowDispatched',
		WorkflowDispatchEvent
	>;
	// Repositories
	repositoryCreated: GithubWebhook<'repositoryCreated', RepositoryCreatedEvent>;
	repositoryDeleted: GithubWebhook<'repositoryDeleted', RepositoryDeletedEvent>;
	repositoryArchived: GithubWebhook<
		'repositoryArchived',
		RepositoryArchivedEvent
	>;
	repositoryUnarchived: GithubWebhook<
		'repositoryUnarchived',
		RepositoryUnarchivedEvent
	>;
	repositoryRenamed: GithubWebhook<'repositoryRenamed', RepositoryRenamedEvent>;
	repositoryPublicized: GithubWebhook<
		'repositoryPublicized',
		RepositoryPublicizedEvent
	>;
	repositoryPrivatized: GithubWebhook<
		'repositoryPrivatized',
		RepositoryPrivatizedEvent
	>;
	repositoryTransferred: GithubWebhook<
		'repositoryTransferred',
		RepositoryTransferredEvent
	>;
	// Check Runs & Suites
	checkRunCompleted: GithubWebhook<'checkRunCompleted', CheckRunCompletedEvent>;
	checkRunCreated: GithubWebhook<'checkRunCreated', CheckRunCreatedEvent>;
	checkRunRerequested: GithubWebhook<
		'checkRunRerequested',
		CheckRunRerequestedEvent
	>;
	checkSuiteCompleted: GithubWebhook<
		'checkSuiteCompleted',
		CheckSuiteCompletedEvent
	>;
	checkSuiteRequested: GithubWebhook<
		'checkSuiteRequested',
		CheckSuiteRequestedEvent
	>;
	// Discussions
	discussionCreated: GithubWebhook<'discussionCreated', DiscussionCreatedEvent>;
	discussionEdited: GithubWebhook<'discussionEdited', DiscussionEditedEvent>;
	discussionClosed: GithubWebhook<'discussionClosed', DiscussionClosedEvent>;
	discussionReopened: GithubWebhook<
		'discussionReopened',
		DiscussionReopenedEvent
	>;
	discussionAnswered: GithubWebhook<
		'discussionAnswered',
		DiscussionAnsweredEvent
	>;
	discussionDeleted: GithubWebhook<'discussionDeleted', DiscussionDeletedEvent>;
	discussionCommentCreated: GithubWebhook<
		'discussionCommentCreated',
		DiscussionCommentCreatedEvent
	>;
	discussionCommentEdited: GithubWebhook<
		'discussionCommentEdited',
		DiscussionCommentEditedEvent
	>;
	discussionCommentDeleted: GithubWebhook<
		'discussionCommentDeleted',
		DiscussionCommentDeletedEvent
	>;
	// Security (Dependabot)
	dependabotAlertCreated: GithubWebhook<
		'dependabotAlertCreated',
		DependabotAlertCreatedEvent
	>;
	dependabotAlertDismissed: GithubWebhook<
		'dependabotAlertDismissed',
		DependabotAlertDismissedEvent
	>;
	dependabotAlertFixed: GithubWebhook<
		'dependabotAlertFixed',
		DependabotAlertFixedEvent
	>;
	dependabotAlertReopened: GithubWebhook<
		'dependabotAlertReopened',
		DependabotAlertReopenedEvent
	>;
	dependabotAlertAutoDismissed: GithubWebhook<
		'dependabotAlertAutoDismissed',
		DependabotAlertAutoDismissedEvent
	>;
	dependabotAlertAutoReopened: GithubWebhook<
		'dependabotAlertAutoReopened',
		DependabotAlertAutoReopenedEvent
	>;
	// Members
	memberAdded: GithubWebhook<'memberAdded', MemberAddedEvent>;
	memberRemoved: GithubWebhook<'memberRemoved', MemberRemovedEvent>;
	membershipAdded: GithubWebhook<'membershipAdded', MembershipAddedEvent>;
	membershipRemoved: GithubWebhook<'membershipRemoved', MembershipRemovedEvent>;
	// Milestones
	milestoneCreated: GithubWebhook<'milestoneCreated', MilestoneCreatedEvent>;
	milestoneClosed: GithubWebhook<'milestoneClosed', MilestoneClosedEvent>;
	milestoneOpened: GithubWebhook<'milestoneOpened', MilestoneOpenedEvent>;
	milestoneEdited: GithubWebhook<'milestoneEdited', MilestoneEditedEvent>;
	milestoneDeleted: GithubWebhook<'milestoneDeleted', MilestoneDeletedEvent>;
	// Labels
	labelCreated: GithubWebhook<'labelCreated', LabelCreatedEvent>;
	labelEdited: GithubWebhook<'labelEdited', LabelEditedEvent>;
	labelDeleted: GithubWebhook<'labelDeleted', LabelDeletedEvent>;
	// Fork & Watch
	forked: GithubWebhook<'forked', ForkEvent>;
	watchStarted: GithubWebhook<'watchStarted', WatchStartedEvent>;
};

export type GithubBoundWebhooks = BindWebhooks<GithubWebhooks>;

const githubEndpointsNested = {
	issues: {
		list: IssuesEndpoints.list,
		get: IssuesEndpoints.get,
		create: IssuesEndpoints.create,
		update: IssuesEndpoints.update,
		createComment: IssuesEndpoints.createComment,
	},
	pullRequests: {
		list: PullRequestsEndpoints.list,
		get: PullRequestsEndpoints.get,
		listReviews: PullRequestsEndpoints.listReviews,
		createReview: PullRequestsEndpoints.createReview,
	},
	repositories: {
		list: RepositoriesEndpoints.list,
		get: RepositoriesEndpoints.get,
		listBranches: RepositoriesEndpoints.listBranches,
		listCommits: RepositoriesEndpoints.listCommits,
		getContent: RepositoriesEndpoints.getContent,
	},
	releases: {
		list: ReleasesEndpoints.list,
		get: ReleasesEndpoints.get,
		create: ReleasesEndpoints.create,
		update: ReleasesEndpoints.update,
	},
	workflows: {
		list: WorkflowsEndpoints.list,
		get: WorkflowsEndpoints.get,
		listRuns: WorkflowsEndpoints.listRuns,
	},
	discussions: {
		list: DiscussionsEndpoints.list,
		get: DiscussionsEndpoints.get,
	},
	forks: {
		list: ForksEndpoints.list,
	},
	comments: {
		list: CommentsEndpoints.list,
		listForIssue: CommentsEndpoints.listForIssue,
		get: CommentsEndpoints.get,
		update: CommentsEndpoints.update,
		delete: CommentsEndpoints.delete,
	},
} as const;

export const githubEndpointSchemas = {
	'issues.list': {
		input: GithubEndpointInputSchemas.issuesList,
		output: GithubEndpointOutputSchemas.issuesList,
	},
	'issues.get': {
		input: GithubEndpointInputSchemas.issuesGet,
		output: GithubEndpointOutputSchemas.issuesGet,
	},
	'issues.create': {
		input: GithubEndpointInputSchemas.issuesCreate,
		output: GithubEndpointOutputSchemas.issuesCreate,
	},
	'issues.update': {
		input: GithubEndpointInputSchemas.issuesUpdate,
		output: GithubEndpointOutputSchemas.issuesUpdate,
	},
	'issues.createComment': {
		input: GithubEndpointInputSchemas.issuesCreateComment,
		output: GithubEndpointOutputSchemas.issuesCreateComment,
	},
	'pullRequests.list': {
		input: GithubEndpointInputSchemas.pullRequestsList,
		output: GithubEndpointOutputSchemas.pullRequestsList,
	},
	'pullRequests.get': {
		input: GithubEndpointInputSchemas.pullRequestsGet,
		output: GithubEndpointOutputSchemas.pullRequestsGet,
	},
	'pullRequests.listReviews': {
		input: GithubEndpointInputSchemas.pullRequestsListReviews,
		output: GithubEndpointOutputSchemas.pullRequestsListReviews,
	},
	'pullRequests.createReview': {
		input: GithubEndpointInputSchemas.pullRequestsCreateReview,
		output: GithubEndpointOutputSchemas.pullRequestsCreateReview,
	},
	'repositories.list': {
		input: GithubEndpointInputSchemas.repositoriesList,
		output: GithubEndpointOutputSchemas.repositoriesList,
	},
	'repositories.get': {
		input: GithubEndpointInputSchemas.repositoriesGet,
		output: GithubEndpointOutputSchemas.repositoriesGet,
	},
	'repositories.listBranches': {
		input: GithubEndpointInputSchemas.repositoriesListBranches,
		output: GithubEndpointOutputSchemas.repositoriesListBranches,
	},
	'repositories.listCommits': {
		input: GithubEndpointInputSchemas.repositoriesListCommits,
		output: GithubEndpointOutputSchemas.repositoriesListCommits,
	},
	'repositories.getContent': {
		input: GithubEndpointInputSchemas.repositoriesGetContent,
		output: GithubEndpointOutputSchemas.repositoriesGetContent,
	},
	'releases.list': {
		input: GithubEndpointInputSchemas.releasesList,
		output: GithubEndpointOutputSchemas.releasesList,
	},
	'releases.get': {
		input: GithubEndpointInputSchemas.releasesGet,
		output: GithubEndpointOutputSchemas.releasesGet,
	},
	'releases.create': {
		input: GithubEndpointInputSchemas.releasesCreate,
		output: GithubEndpointOutputSchemas.releasesCreate,
	},
	'releases.update': {
		input: GithubEndpointInputSchemas.releasesUpdate,
		output: GithubEndpointOutputSchemas.releasesUpdate,
	},
	'workflows.list': {
		input: GithubEndpointInputSchemas.workflowsList,
		output: GithubEndpointOutputSchemas.workflowsList,
	},
	'workflows.get': {
		input: GithubEndpointInputSchemas.workflowsGet,
		output: GithubEndpointOutputSchemas.workflowsGet,
	},
	'workflows.listRuns': {
		input: GithubEndpointInputSchemas.workflowsListRuns,
		output: GithubEndpointOutputSchemas.workflowsListRuns,
	},
	'discussions.list': {
		input: GithubEndpointInputSchemas.discussionsList,
		output: GithubEndpointOutputSchemas.discussionsList,
	},
	'discussions.get': {
		input: GithubEndpointInputSchemas.discussionsGet,
		output: GithubEndpointOutputSchemas.discussionsGet,
	},
	'forks.list': {
		input: GithubEndpointInputSchemas.forksList,
		output: GithubEndpointOutputSchemas.forksList,
	},
	'comments.list': {
		input: GithubEndpointInputSchemas.commentsList,
		output: GithubEndpointOutputSchemas.commentsList,
	},
	'comments.listForIssue': {
		input: GithubEndpointInputSchemas.commentsListForIssue,
		output: GithubEndpointOutputSchemas.commentsListForIssue,
	},
	'comments.get': {
		input: GithubEndpointInputSchemas.commentsGet,
		output: GithubEndpointOutputSchemas.commentsGet,
	},
	'comments.update': {
		input: GithubEndpointInputSchemas.commentsUpdate,
		output: GithubEndpointOutputSchemas.commentsUpdate,
	},
	'comments.delete': {
		input: GithubEndpointInputSchemas.commentsDelete,
		output: GithubEndpointOutputSchemas.commentsDelete,
	},
} as const;

const githubWebhooksNested = {
	// Pull Requests
	pullRequest: {
		opened: PullRequestWebhooks.opened,
		closed: PullRequestWebhooks.closed,
		synchronize: PullRequestWebhooks.synchronize,
		reopened: PullRequestWebhooks.reopened,
		labeled: PullRequestWebhooks.labeled,
		unlabeled: PullRequestWebhooks.unlabeled,
		reviewRequested: PullRequestWebhooks.reviewRequested,
		readyForReview: PullRequestWebhooks.readyForReview,
		convertedToDraft: PullRequestWebhooks.convertedToDraft,
	},
	// Pull Request Reviews
	pullRequestReview: {
		submitted: PullRequestReviewWebhooks.submitted,
		dismissed: PullRequestReviewWebhooks.dismissed,
		edited: PullRequestReviewWebhooks.edited,
	},
	pullRequestReviewComment: {
		created: PullRequestReviewCommentWebhooks.created,
		edited: PullRequestReviewCommentWebhooks.edited,
		deleted: PullRequestReviewCommentWebhooks.deleted,
	},
	pullRequestReviewThread: {
		resolved: PullRequestReviewThreadWebhooks.resolved,
		unresolved: PullRequestReviewThreadWebhooks.unresolved,
	},
	// Push
	push: PushWebhooks.push,
	// Branches & Tags
	branch: {
		created: BranchWebhooks.created,
		deleted: BranchWebhooks.deleted,
	},
	tag: {
		created: TagWebhooks.created,
		deleted: TagWebhooks.deleted,
	},
	// Stars
	star: {
		created: StarWebhooks.created,
		deleted: StarWebhooks.deleted,
	},
	// Issues
	issue: {
		opened: IssueWebhooks.opened,
		closed: IssueWebhooks.closed,
		reopened: IssueWebhooks.reopened,
		labeled: IssueWebhooks.labeled,
		unlabeled: IssueWebhooks.unlabeled,
		assigned: IssueWebhooks.assigned,
		unassigned: IssueWebhooks.unassigned,
		edited: IssueWebhooks.edited,
		deleted: IssueWebhooks.deleted,
		transferred: IssueWebhooks.transferred,
		locked: IssueWebhooks.locked,
		unlocked: IssueWebhooks.unlocked,
		pinned: IssueWebhooks.pinned,
		unpinned: IssueWebhooks.unpinned,
	},
	comment: {
		created: CommentWebhooks.created,
		edited: CommentWebhooks.edited,
		deleted: CommentWebhooks.deleted,
	},
	// Releases
	release: {
		published: ReleaseWebhooks.published,
		created: ReleaseWebhooks.created,
		edited: ReleaseWebhooks.edited,
		deleted: ReleaseWebhooks.deleted,
		prereleased: ReleaseWebhooks.prereleased,
		released: ReleaseWebhooks.released,
		unpublished: ReleaseWebhooks.unpublished,
	},
	// Deployments
	deployment: {
		created: DeploymentWebhooks.created,
	},
	deploymentStatus: {
		created: DeploymentStatusWebhooks.created,
	},
	// Workflows
	workflowRun: {
		completed: WorkflowRunWebhooks.completed,
		inProgress: WorkflowRunWebhooks.inProgress,
		requested: WorkflowRunWebhooks.requested,
	},
	workflowJob: {
		completed: WorkflowJobWebhooks.completed,
		queued: WorkflowJobWebhooks.queued,
		inProgress: WorkflowJobWebhooks.inProgress,
		waiting: WorkflowJobWebhooks.waiting,
	},
	workflowDispatch: {
		dispatched: WorkflowDispatchWebhooks.dispatched,
	},
	// Repositories
	repository: {
		created: RepositoryWebhooks.created,
		deleted: RepositoryWebhooks.deleted,
		archived: RepositoryWebhooks.archived,
		unarchived: RepositoryWebhooks.unarchived,
		renamed: RepositoryWebhooks.renamed,
		publicized: RepositoryWebhooks.publicized,
		privatized: RepositoryWebhooks.privatized,
		transferred: RepositoryWebhooks.transferred,
	},
	// Checks
	checkRun: {
		completed: CheckRunWebhooks.completed,
		created: CheckRunWebhooks.created,
		rerequested: CheckRunWebhooks.rerequested,
	},
	checkSuite: {
		completed: CheckSuiteWebhooks.completed,
		requested: CheckSuiteWebhooks.requested,
	},
	// Discussions
	discussion: {
		created: DiscussionWebhooks.created,
		edited: DiscussionWebhooks.edited,
		closed: DiscussionWebhooks.closed,
		reopened: DiscussionWebhooks.reopened,
		answered: DiscussionWebhooks.answered,
		deleted: DiscussionWebhooks.deleted,
	},
	discussionComment: {
		created: DiscussionCommentWebhooks.created,
		edited: DiscussionCommentWebhooks.edited,
		deleted: DiscussionCommentWebhooks.deleted,
	},
	// Security (Dependabot)
	dependabotAlert: {
		created: DependabotAlertWebhooks.created,
		dismissed: DependabotAlertWebhooks.dismissed,
		fixed: DependabotAlertWebhooks.fixed,
		reopened: DependabotAlertWebhooks.reopened,
		autoDismissed: DependabotAlertWebhooks.autoDismissed,
		autoReopened: DependabotAlertWebhooks.autoReopened,
	},
	// Members
	member: {
		added: MemberWebhooks.added,
		removed: MemberWebhooks.removed,
	},
	membership: {
		added: MembershipWebhooks.added,
		removed: MembershipWebhooks.removed,
	},
	// Milestones
	milestone: {
		created: MilestoneWebhooks.created,
		closed: MilestoneWebhooks.closed,
		opened: MilestoneWebhooks.opened,
		edited: MilestoneWebhooks.edited,
		deleted: MilestoneWebhooks.deleted,
	},
	// Labels
	label: {
		created: LabelWebhooks.created,
		edited: LabelWebhooks.edited,
		deleted: LabelWebhooks.deleted,
	},
	// Fork & Watch
	fork: {
		forked: ForkWebhooks.forked,
	},
	watch: {
		started: WatchWebhooks.started,
	},
} as const;

const githubWebhookSchemas = {
	// Pull Requests
	'pullRequest.opened': {
		description: 'A pull request was opened',
		payload: PullRequestOpenedEventSchema,
		response: PullRequestOpenedEventSchema,
	},
	'pullRequest.closed': {
		description: 'A pull request was closed or merged',
		payload: PullRequestClosedEventSchema,
		response: PullRequestClosedEventSchema,
	},
	'pullRequest.synchronize': {
		description: 'New commits were pushed to a pull request',
		payload: PullRequestSynchronizeEventSchema,
		response: PullRequestSynchronizeEventSchema,
	},
	'pullRequest.reopened': {
		description: 'A pull request was reopened',
		payload: PullRequestReopenedEventSchema,
		response: PullRequestReopenedEventSchema,
	},
	'pullRequest.labeled': {
		description: 'A label was added to a pull request',
		payload: PullRequestLabeledEventSchema,
		response: PullRequestLabeledEventSchema,
	},
	'pullRequest.unlabeled': {
		description: 'A label was removed from a pull request',
		payload: PullRequestUnlabeledEventSchema,
		response: PullRequestUnlabeledEventSchema,
	},
	'pullRequest.reviewRequested': {
		description: 'A review was requested on a pull request',
		payload: PullRequestReviewRequestedEventSchema,
		response: PullRequestReviewRequestedEventSchema,
	},
	'pullRequest.readyForReview': {
		description: 'A draft pull request was marked as ready for review',
		payload: PullRequestReadyForReviewEventSchema,
		response: PullRequestReadyForReviewEventSchema,
	},
	'pullRequest.convertedToDraft': {
		description: 'A pull request was converted to a draft',
		payload: PullRequestConvertedToDraftEventSchema,
		response: PullRequestConvertedToDraftEventSchema,
	},
	// Pull Request Reviews
	'pullRequestReview.submitted': {
		description: 'A pull request review was submitted',
		payload: PullRequestReviewSubmittedEventSchema,
		response: PullRequestReviewSubmittedEventSchema,
	},
	'pullRequestReview.dismissed': {
		description: 'A pull request review was dismissed',
		payload: PullRequestReviewDismissedEventSchema,
		response: PullRequestReviewDismissedEventSchema,
	},
	'pullRequestReview.edited': {
		description: 'A pull request review was edited',
		payload: PullRequestReviewEditedEventSchema,
		response: PullRequestReviewEditedEventSchema,
	},
	// Pull Request Review Comments
	'pullRequestReviewComment.created': {
		description: 'A comment on a pull request diff was created',
		payload: PullRequestReviewCommentCreatedEventSchema,
		response: PullRequestReviewCommentCreatedEventSchema,
	},
	'pullRequestReviewComment.edited': {
		description: 'A comment on a pull request diff was edited',
		payload: PullRequestReviewCommentEditedEventSchema,
		response: PullRequestReviewCommentEditedEventSchema,
	},
	'pullRequestReviewComment.deleted': {
		description: 'A comment on a pull request diff was deleted',
		payload: PullRequestReviewCommentDeletedEventSchema,
		response: PullRequestReviewCommentDeletedEventSchema,
	},
	// Pull Request Review Threads
	'pullRequestReviewThread.resolved': {
		description: 'A pull request review thread was resolved',
		payload: PullRequestReviewThreadResolvedEventSchema,
		response: PullRequestReviewThreadResolvedEventSchema,
	},
	'pullRequestReviewThread.unresolved': {
		description: 'A pull request review thread was unresolved',
		payload: PullRequestReviewThreadUnresolvedEventSchema,
		response: PullRequestReviewThreadUnresolvedEventSchema,
	},
	// Push
	push: {
		description: 'Commits were pushed to a branch',
		payload: PushEventSchema,
		response: PushEventSchema,
	},
	// Branches & Tags
	'branch.created': {
		description: 'A branch was created',
		payload: BranchCreatedEventSchema,
		response: BranchCreatedEventSchema,
	},
	'branch.deleted': {
		description: 'A branch was deleted',
		payload: BranchDeletedEventSchema,
		response: BranchDeletedEventSchema,
	},
	'tag.created': {
		description: 'A tag was created',
		payload: TagCreatedEventSchema,
		response: TagCreatedEventSchema,
	},
	'tag.deleted': {
		description: 'A tag was deleted',
		payload: TagDeletedEventSchema,
		response: TagDeletedEventSchema,
	},
	// Stars
	'star.created': {
		description: 'A repository was starred',
		payload: StarCreatedEventSchema,
		response: StarCreatedEventSchema,
	},
	'star.deleted': {
		description: 'A star was removed from a repository',
		payload: StarDeletedEventSchema,
		response: StarDeletedEventSchema,
	},
	// Issues
	'issue.opened': {
		description: 'An issue was opened',
		payload: IssueOpenedEventSchema,
		response: IssueOpenedEventSchema,
	},
	'issue.closed': {
		description: 'An issue was closed',
		payload: IssueClosedEventSchema,
		response: IssueClosedEventSchema,
	},
	'issue.reopened': {
		description: 'An issue was reopened',
		payload: IssueReopenedEventSchema,
		response: IssueReopenedEventSchema,
	},
	'issue.labeled': {
		description: 'A label was added to an issue',
		payload: IssueLabeledEventSchema,
		response: IssueLabeledEventSchema,
	},
	'issue.unlabeled': {
		description: 'A label was removed from an issue',
		payload: IssueUnlabeledEventSchema,
		response: IssueUnlabeledEventSchema,
	},
	'issue.assigned': {
		description: 'An issue was assigned',
		payload: IssueAssignedEventSchema,
		response: IssueAssignedEventSchema,
	},
	'issue.unassigned': {
		description: 'An issue was unassigned',
		payload: IssueUnassignedEventSchema,
		response: IssueUnassignedEventSchema,
	},
	'issue.edited': {
		description: 'An issue was edited',
		payload: IssueEditedEventSchema,
		response: IssueEditedEventSchema,
	},
	'issue.deleted': {
		description: 'An issue was deleted',
		payload: IssueDeletedEventSchema,
		response: IssueDeletedEventSchema,
	},
	'issue.transferred': {
		description: 'An issue was transferred to another repository',
		payload: IssueTransferredEventSchema,
		response: IssueTransferredEventSchema,
	},
	'issue.locked': {
		description: 'An issue was locked',
		payload: IssueLockedEventSchema,
		response: IssueLockedEventSchema,
	},
	'issue.unlocked': {
		description: 'An issue was unlocked',
		payload: IssueUnlockedEventSchema,
		response: IssueUnlockedEventSchema,
	},
	'issue.pinned': {
		description: 'An issue was pinned',
		payload: IssuePinnedEventSchema,
		response: IssuePinnedEventSchema,
	},
	'issue.unpinned': {
		description: 'An issue was unpinned',
		payload: IssueUnpinnedEventSchema,
		response: IssueUnpinnedEventSchema,
	},
	// Comments (issue & pull request)
	'comment.created': {
		description: 'A comment was added to an issue or pull request',
		payload: CommentCreatedEventSchema,
		response: CommentCreatedEventSchema,
	},
	'comment.edited': {
		description: 'A comment on an issue or pull request was edited',
		payload: CommentEditedEventSchema,
		response: CommentEditedEventSchema,
	},
	'comment.deleted': {
		description: 'A comment on an issue or pull request was deleted',
		payload: CommentDeletedEventSchema,
		response: CommentDeletedEventSchema,
	},
	// Releases
	'release.published': {
		description: 'A release was published',
		payload: ReleasePublishedEventSchema,
		response: ReleasePublishedEventSchema,
	},
	'release.created': {
		description: 'A release draft was saved',
		payload: ReleaseCreatedEventSchema,
		response: ReleaseCreatedEventSchema,
	},
	'release.edited': {
		description: 'A release was edited',
		payload: ReleaseEditedEventSchema,
		response: ReleaseEditedEventSchema,
	},
	'release.deleted': {
		description: 'A release was deleted',
		payload: ReleaseDeletedEventSchema,
		response: ReleaseDeletedEventSchema,
	},
	'release.prereleased': {
		description: 'A pre-release was published',
		payload: ReleasePrereleaseEventSchema,
		response: ReleasePrereleaseEventSchema,
	},
	'release.released': {
		description: 'A release was released',
		payload: ReleaseReleasedEventSchema,
		response: ReleaseReleasedEventSchema,
	},
	'release.unpublished': {
		description: 'A release was unpublished',
		payload: ReleaseUnpublishedEventSchema,
		response: ReleaseUnpublishedEventSchema,
	},
	// Deployments
	'deployment.created': {
		description: 'A deployment was created',
		payload: DeploymentCreatedEventSchema,
		response: DeploymentCreatedEventSchema,
	},
	'deploymentStatus.created': {
		description: 'A deployment status was updated',
		payload: DeploymentStatusCreatedEventSchema,
		response: DeploymentStatusCreatedEventSchema,
	},
	// Workflows
	'workflowRun.completed': {
		description: 'A workflow run completed',
		payload: WorkflowRunCompletedEventSchema,
		response: WorkflowRunCompletedEventSchema,
	},
	'workflowRun.inProgress': {
		description: 'A workflow run started',
		payload: WorkflowRunInProgressEventSchema,
		response: WorkflowRunInProgressEventSchema,
	},
	'workflowRun.requested': {
		description: 'A workflow run was requested',
		payload: WorkflowRunRequestedEventSchema,
		response: WorkflowRunRequestedEventSchema,
	},
	'workflowJob.completed': {
		description: 'A workflow job completed',
		payload: WorkflowJobCompletedEventSchema,
		response: WorkflowJobCompletedEventSchema,
	},
	'workflowJob.queued': {
		description: 'A workflow job was queued',
		payload: WorkflowJobQueuedEventSchema,
		response: WorkflowJobQueuedEventSchema,
	},
	'workflowJob.inProgress': {
		description: 'A workflow job started',
		payload: WorkflowJobInProgressEventSchema,
		response: WorkflowJobInProgressEventSchema,
	},
	'workflowJob.waiting': {
		description: 'A workflow job is waiting for approval',
		payload: WorkflowJobWaitingEventSchema,
		response: WorkflowJobWaitingEventSchema,
	},
	'workflowDispatch.dispatched': {
		description: 'A workflow was manually triggered',
		payload: WorkflowDispatchEventSchema,
		response: WorkflowDispatchEventSchema,
	},
	// Repositories
	'repository.created': {
		description: 'A repository was created',
		payload: RepositoryCreatedEventSchema,
		response: RepositoryCreatedEventSchema,
	},
	'repository.deleted': {
		description: 'A repository was deleted',
		payload: RepositoryDeletedEventSchema,
		response: RepositoryDeletedEventSchema,
	},
	'repository.archived': {
		description: 'A repository was archived',
		payload: RepositoryArchivedEventSchema,
		response: RepositoryArchivedEventSchema,
	},
	'repository.unarchived': {
		description: 'A repository was unarchived',
		payload: RepositoryUnarchivedEventSchema,
		response: RepositoryUnarchivedEventSchema,
	},
	'repository.renamed': {
		description: 'A repository was renamed',
		payload: RepositoryRenamedEventSchema,
		response: RepositoryRenamedEventSchema,
	},
	'repository.publicized': {
		description: 'A repository was made public',
		payload: RepositoryPublicizedEventSchema,
		response: RepositoryPublicizedEventSchema,
	},
	'repository.privatized': {
		description: 'A repository was made private',
		payload: RepositoryPrivatizedEventSchema,
		response: RepositoryPrivatizedEventSchema,
	},
	'repository.transferred': {
		description: 'A repository was transferred',
		payload: RepositoryTransferredEventSchema,
		response: RepositoryTransferredEventSchema,
	},
	// Checks
	'checkRun.completed': {
		description: 'A check run completed',
		payload: CheckRunCompletedEventSchema,
		response: CheckRunCompletedEventSchema,
	},
	'checkRun.created': {
		description: 'A check run was created',
		payload: CheckRunCreatedEventSchema,
		response: CheckRunCreatedEventSchema,
	},
	'checkRun.rerequested': {
		description: 'A check run was re-requested',
		payload: CheckRunRerequestedEventSchema,
		response: CheckRunRerequestedEventSchema,
	},
	'checkSuite.completed': {
		description: 'A check suite completed',
		payload: CheckSuiteCompletedEventSchema,
		response: CheckSuiteCompletedEventSchema,
	},
	'checkSuite.requested': {
		description: 'A check suite was requested',
		payload: CheckSuiteRequestedEventSchema,
		response: CheckSuiteRequestedEventSchema,
	},
	// Discussions
	'discussion.created': {
		description: 'A discussion was created',
		payload: DiscussionCreatedEventSchema,
		response: DiscussionCreatedEventSchema,
	},
	'discussion.edited': {
		description: 'A discussion was edited',
		payload: DiscussionEditedEventSchema,
		response: DiscussionEditedEventSchema,
	},
	'discussion.closed': {
		description: 'A discussion was closed',
		payload: DiscussionClosedEventSchema,
		response: DiscussionClosedEventSchema,
	},
	'discussion.reopened': {
		description: 'A discussion was reopened',
		payload: DiscussionReopenedEventSchema,
		response: DiscussionReopenedEventSchema,
	},
	'discussion.answered': {
		description: 'A discussion was answered',
		payload: DiscussionAnsweredEventSchema,
		response: DiscussionAnsweredEventSchema,
	},
	'discussion.deleted': {
		description: 'A discussion was deleted',
		payload: DiscussionDeletedEventSchema,
		response: DiscussionDeletedEventSchema,
	},
	'discussionComment.created': {
		description: 'A discussion comment was created',
		payload: DiscussionCommentCreatedEventSchema,
		response: DiscussionCommentCreatedEventSchema,
	},
	'discussionComment.edited': {
		description: 'A discussion comment was edited',
		payload: DiscussionCommentEditedEventSchema,
		response: DiscussionCommentEditedEventSchema,
	},
	'discussionComment.deleted': {
		description: 'A discussion comment was deleted',
		payload: DiscussionCommentDeletedEventSchema,
		response: DiscussionCommentDeletedEventSchema,
	},
	// Security (Dependabot)
	'dependabotAlert.created': {
		description: 'A Dependabot alert was created',
		payload: DependabotAlertCreatedEventSchema,
		response: DependabotAlertCreatedEventSchema,
	},
	'dependabotAlert.dismissed': {
		description: 'A Dependabot alert was dismissed',
		payload: DependabotAlertDismissedEventSchema,
		response: DependabotAlertDismissedEventSchema,
	},
	'dependabotAlert.fixed': {
		description: 'A Dependabot alert was fixed',
		payload: DependabotAlertFixedEventSchema,
		response: DependabotAlertFixedEventSchema,
	},
	'dependabotAlert.reopened': {
		description: 'A Dependabot alert was reopened',
		payload: DependabotAlertReopenedEventSchema,
		response: DependabotAlertReopenedEventSchema,
	},
	'dependabotAlert.autoDismissed': {
		description: 'A Dependabot alert was auto-dismissed',
		payload: DependabotAlertAutoDismissedEventSchema,
		response: DependabotAlertAutoDismissedEventSchema,
	},
	'dependabotAlert.autoReopened': {
		description: 'A Dependabot alert was auto-reopened',
		payload: DependabotAlertAutoReopenedEventSchema,
		response: DependabotAlertAutoReopenedEventSchema,
	},
	// Members
	'member.added': {
		description: 'A collaborator was added to a repository',
		payload: MemberAddedEventSchema,
		response: MemberAddedEventSchema,
	},
	'member.removed': {
		description: 'A collaborator was removed from a repository',
		payload: MemberRemovedEventSchema,
		response: MemberRemovedEventSchema,
	},
	'membership.added': {
		description: 'A user was added to a team',
		payload: MembershipAddedEventSchema,
		response: MembershipAddedEventSchema,
	},
	'membership.removed': {
		description: 'A user was removed from a team',
		payload: MembershipRemovedEventSchema,
		response: MembershipRemovedEventSchema,
	},
	// Milestones
	'milestone.created': {
		description: 'A milestone was created',
		payload: MilestoneCreatedEventSchema,
		response: MilestoneCreatedEventSchema,
	},
	'milestone.closed': {
		description: 'A milestone was closed',
		payload: MilestoneClosedEventSchema,
		response: MilestoneClosedEventSchema,
	},
	'milestone.opened': {
		description: 'A milestone was opened',
		payload: MilestoneOpenedEventSchema,
		response: MilestoneOpenedEventSchema,
	},
	'milestone.edited': {
		description: 'A milestone was edited',
		payload: MilestoneEditedEventSchema,
		response: MilestoneEditedEventSchema,
	},
	'milestone.deleted': {
		description: 'A milestone was deleted',
		payload: MilestoneDeletedEventSchema,
		response: MilestoneDeletedEventSchema,
	},
	// Labels
	'label.created': {
		description: 'A label was created',
		payload: LabelCreatedEventSchema,
		response: LabelCreatedEventSchema,
	},
	'label.edited': {
		description: 'A label was edited',
		payload: LabelEditedEventSchema,
		response: LabelEditedEventSchema,
	},
	'label.deleted': {
		description: 'A label was deleted',
		payload: LabelDeletedEventSchema,
		response: LabelDeletedEventSchema,
	},
	// Fork & Watch
	'fork.forked': {
		description: 'A repository was forked',
		payload: ForkEventSchema,
		response: ForkEventSchema,
	},
	'watch.started': {
		description: 'A user started watching a repository',
		payload: WatchStartedEventSchema,
		response: WatchStartedEventSchema,
	},
} as const;

const defaultAuthType = 'api_key' as const;

/**
 * Risk-level metadata for each GitHub endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 * Keys are validated against the endpoint tree — invalid paths are type errors.
 */
const githubEndpointMeta = {
	'issues.list': {
		riskLevel: 'read',
		description: 'List issues in a repository',
	},
	'issues.get': { riskLevel: 'read', description: 'Get a specific issue' },
	'issues.create': { riskLevel: 'write', description: 'Create a new issue' },
	'issues.update': {
		riskLevel: 'write',
		description: 'Update an existing issue',
	},
	'issues.createComment': {
		riskLevel: 'write',
		description: 'Post a comment on an issue',
	},
	'pullRequests.list': { riskLevel: 'read', description: 'List pull requests' },
	'pullRequests.get': {
		riskLevel: 'read',
		description: 'Get a specific pull request',
	},
	'pullRequests.listReviews': {
		riskLevel: 'read',
		description: 'List reviews on a pull request',
	},
	'pullRequests.createReview': {
		riskLevel: 'write',
		description: 'Submit a pull request review',
	},
	'repositories.list': {
		riskLevel: 'read',
		description: 'List repositories for the authenticated user',
	},
	'repositories.get': {
		riskLevel: 'read',
		description: 'Get a specific repository',
	},
	'repositories.listBranches': {
		riskLevel: 'read',
		description: 'List branches in a repository',
	},
	'repositories.listCommits': {
		riskLevel: 'read',
		description: 'List commits in a repository',
	},
	'repositories.getContent': {
		riskLevel: 'read',
		description: 'Get file or directory content from a repository',
	},
	'releases.list': {
		riskLevel: 'read',
		description: 'List releases in a repository',
	},
	'releases.get': { riskLevel: 'read', description: 'Get a specific release' },
	'releases.create': {
		riskLevel: 'write',
		description: 'Create a new release',
	},
	'releases.update': {
		riskLevel: 'write',
		description: 'Update an existing release',
	},
	'workflows.list': {
		riskLevel: 'read',
		description: 'List workflows in a repository',
	},
	'workflows.get': {
		riskLevel: 'read',
		description: 'Get a specific workflow',
	},
	'workflows.listRuns': {
		riskLevel: 'read',
		description: 'List workflow runs',
	},
	'discussions.list': {
		riskLevel: 'read',
		description: 'List discussions in a repository',
	},
	'discussions.get': {
		riskLevel: 'read',
		description: 'Get a specific discussion',
	},
	'forks.list': {
		riskLevel: 'read',
		description: 'List forks of a repository',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List all comments in a repository',
	},
	'comments.listForIssue': {
		riskLevel: 'read',
		description: 'List comments on a specific issue or pull request',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Get a specific comment',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'Update a comment',
	},
	'comments.delete': {
		riskLevel: 'write',
		description: 'Delete a comment',
	},
} satisfies RequiredPluginEndpointMeta<typeof githubEndpointsNested>;

export type GithubPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	credentials?: GithubCredentials;
	webhookSecret?: string;
	hooks?: InternalGithubPlugin['hooks'];
	webhookHooks?: InternalGithubPlugin['webhookHooks'];
	/**
	 * Permission configuration for the GitHub plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the GitHub endpoint tree — invalid paths are type errors.
	 *
	 * @example
	 * ```ts
	 * github({
	 *   permissions: {
	 *     mode: 'cautious',
	 *     overrides: { 'releases.create': 'require_approval' },
	 *   },
	 * })
	 * ```
	 */
	permissions?: PluginPermissionsConfig<typeof githubEndpointsNested>;
};

export type BaseGithubPlugin<PluginOptions extends GithubPluginOptions> =
	CorsairPlugin<
		'github',
		typeof GithubSchema,
		typeof githubEndpointsNested,
		typeof githubWebhooksNested,
		PluginOptions,
		typeof defaultAuthType
	>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalGithubPlugin = BaseGithubPlugin<GithubPluginOptions>;

export type ExternalGithubPlugin<PluginOptions extends GithubPluginOptions> =
	BaseGithubPlugin<PluginOptions>;

export function github<const PluginOptions extends GithubPluginOptions>(
	incomingOptions: GithubPluginOptions &
		PluginOptions = {} as GithubPluginOptions & PluginOptions,
): ExternalGithubPlugin<PluginOptions> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'github',
		schema: GithubSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: githubEndpointsNested,
		webhooks: githubWebhooksNested,
		endpointMeta: githubEndpointMeta,
		endpointSchemas: githubEndpointSchemas,
		webhookSchemas: githubWebhookSchemas,
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const hasGithubEvent = headers['x-github-event'] !== undefined;
			const hasGithubSignature = headers['x-hub-signature-256'] !== undefined;
			return hasGithubEvent && hasGithubSignature;
		},
		keyBuilder: async (ctx: GithubKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint') {
				if (ctx.authType === 'api_key') {
					const res = await ctx.keys.get_api_key();

					if (!res) {
						return '';
					}

					return res;
				} else if (ctx.authType === 'oauth_2') {
					const res = await ctx.keys.get_access_token();

					if (!res) {
						return '';
					}

					return res;
				}
			}

			return '';
		},
	} satisfies InternalGithubPlugin;
}
