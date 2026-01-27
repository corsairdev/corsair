export type AuthorAssociation =
	| 'COLLABORATOR'
	| 'CONTRIBUTOR'
	| 'FIRST_TIMER'
	| 'FIRST_TIME_CONTRIBUTOR'
	| 'MANNEQUIN'
	| 'MEMBER'
	| 'NONE'
	| 'OWNER';

export interface InstallationLite {
	id: number;
	node_id: string;
}

export interface Organization {
	login: string;
	id: number;
	node_id: string;
	url: string;
	html_url?: string;
	repos_url: string;
	events_url: string;
	hooks_url: string;
	issues_url: string;
	members_url: string;
	public_members_url: string;
	avatar_url: string;
	description: string | null;
}

export interface User {
	login: string;
	id: number;
	node_id: string;
	name?: string;
	email?: string | null;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: 'Bot' | 'User' | 'Organization';
	site_admin: boolean;
}

export interface License {
	key: string;
	name: string;
	spdx_id: string;
	url: string | null;
	node_id: string;
}

export interface Repository {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: User;
	html_url: string;
	description: string | null;
	fork: boolean;
	url: string;
	forks_url: string;
	keys_url: string;
	collaborators_url: string;
	teams_url: string;
	hooks_url: string;
	issue_events_url: string;
	events_url: string;
	assignees_url: string;
	branches_url: string;
	tags_url: string;
	blobs_url: string;
	git_tags_url: string;
	git_refs_url: string;
	trees_url: string;
	statuses_url: string;
	languages_url: string;
	stargazers_url: string;
	contributors_url: string;
	subscribers_url: string;
	subscription_url: string;
	commits_url: string;
	git_commits_url: string;
	comments_url: string;
	issue_comment_url: string;
	contents_url: string;
	compare_url: string;
	merges_url: string;
	archive_url: string;
	downloads_url: string;
	issues_url: string;
	pulls_url: string;
	milestones_url: string;
	notifications_url: string;
	labels_url: string;
	releases_url: string;
	deployments_url: string;
	created_at: number | string;
	updated_at: string;
	pushed_at: number | string | null;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	svn_url: string;
	homepage: string | null;
	size: number;
	stargazers_count: number;
	watchers_count: number;
	language: string | null;
	has_issues: boolean;
	has_projects: boolean;
	has_downloads: boolean;
	has_wiki: boolean;
	has_pages: boolean;
	has_discussions?: boolean;
	forks_count: number;
	mirror_url: string | null;
	archived: boolean;
	disabled?: boolean;
	open_issues_count: number;
	license: License | null;
	forks: number;
	open_issues: number;
	watchers: number;
	stargazers?: number;
	default_branch: string;
	allow_squash_merge?: boolean;
	allow_merge_commit?: boolean;
	allow_rebase_merge?: boolean;
	allow_auto_merge?: boolean;
	allow_forking?: boolean;
	allow_update_branch?: boolean;
	use_squash_pr_title_as_default?: boolean;
	squash_merge_commit_message?: string;
	squash_merge_commit_title?: string;
	merge_commit_message?: string;
	merge_commit_title?: string;
	is_template: boolean;
	web_commit_signoff_required: boolean;
	topics: string[];
	visibility: 'public' | 'private' | 'internal';
	delete_branch_on_merge?: boolean;
	master_branch?: string;
	permissions?: {
		pull: boolean;
		push: boolean;
		admin: boolean;
		maintain?: boolean;
		triage?: boolean;
	};
	public?: boolean;
	organization?: string;
	custom_properties: {
		[k: string]: null | string | string[];
	};
}

export interface Team {
	name: string;
	id: number;
	node_id: string;
	slug: string;
	description: string | null;
	privacy: 'open' | 'closed' | 'secret';
	url: string;
	html_url: string;
	members_url: string;
	repositories_url: string;
	permission: string;
	parent?: {
		name: string;
		id: number;
		node_id: string;
		slug: string;
		description: string | null;
		privacy: 'open' | 'closed' | 'secret';
		url: string;
		html_url: string;
		members_url: string;
		repositories_url: string;
		permission: string;
		notification_setting?: 'notifications_enabled' | 'notifications_disabled';
	} | null;
	notification_setting?: 'notifications_enabled' | 'notifications_disabled';
}

export interface Label {
	id: number;
	node_id: string;
	url: string;
	name: string;
	description: string | null;
	color: string;
	default: boolean;
}

export interface Milestone {
	url: string;
	html_url: string;
	labels_url: string;
	id: number;
	node_id: string;
	number: number;
	title: string;
	description: string | null;
	creator: User;
	open_issues: number;
	closed_issues: number;
	state: 'open' | 'closed';
	created_at: string;
	updated_at: string;
	due_on: string | null;
	closed_at: string | null;
}

export interface Link {
	href: string;
}

export interface PullRequestAutoMerge {
	enabled_by: User | null;
	merge_method: 'merge' | 'squash' | 'rebase';
	commit_title: string | null;
	commit_message: string | null;
}

export interface Committer {
	name: string;
	email: string | null;
	date?: string;
	username?: string;
}

export interface App {
	id: number;
	slug?: string;
	node_id: string;
	owner: User;
	name: string;
	description: string | null;
	external_url: string;
	html_url: string;
	created_at: string;
	updated_at: string;
	permissions?: {
		actions?: 'read' | 'write';
		administration?: 'read' | 'write';
		checks?: 'read' | 'write';
		contents?: 'read' | 'write';
		deployments?: 'read' | 'write';
		issues?: 'read' | 'write';
		members?: 'read' | 'write';
		metadata?: 'read' | 'write';
		packages?: 'read' | 'write';
		pages?: 'read' | 'write';
		pull_requests?: 'read' | 'write';
		statuses?: 'read' | 'write';
		[k: string]: 'read' | 'write' | undefined;
	};
	events?: string[];
}

export interface Workflow {
	badge_url: string;
	created_at: string;
	html_url: string;
	id: number;
	name: string;
	node_id: string;
	path: string;
	state: string;
	updated_at: string;
	url: string;
}

export interface Deployment {
	url: string;
	id: number;
	node_id: string;
	sha: string;
	ref: string;
	task: string;
	payload: {
		[k: string]: unknown;
	};
	original_environment: string;
	environment: string;
	transient_environment?: boolean;
	production_environment?: boolean;
	description: string | null;
	creator: User;
	created_at: string;
	updated_at: string;
	statuses_url: string;
	repository_url: string;
	performed_via_github_app?: App | null;
}

export interface PullRequest {
	url: string;
	id: number;
	node_id: string;
	html_url: string;
	diff_url: string;
	patch_url: string;
	issue_url: string;
	number: number;
	state: 'open' | 'closed';
	locked: boolean;
	title: string;
	user: User;
	body: string | null;
	created_at: string;
	updated_at: string;
	closed_at: string | null;
	merged_at: string | null;
	merge_commit_sha: string | null;
	assignee: User | null;
	assignees: User[];
	requested_reviewers: (User | Team)[];
	requested_teams: Team[];
	labels: Label[];
	milestone: Milestone | null;
	commits_url: string;
	review_comments_url: string;
	review_comment_url: string;
	comments_url: string;
	statuses_url: string;
	head: {
		label: string;
		ref: string;
		sha: string;
		user: User;
		repo: Repository | null;
	};
	base: {
		label: string;
		ref: string;
		sha: string;
		user: User;
		repo: Repository;
	};
	_links: {
		self: Link;
		html: Link;
		issue: Link;
		comments: Link;
		review_comments: Link;
		review_comment: Link;
		commits: Link;
		statuses: Link;
	};
	author_association: AuthorAssociation;
	auto_merge: PullRequestAutoMerge | null;
	active_lock_reason: 'resolved' | 'off-topic' | 'too heated' | 'spam' | null;
	draft: boolean;
	merged: boolean | null;
	mergeable: boolean | null;
	rebaseable: boolean | null;
	mergeable_state: string;
	merged_by: User | null;
	comments: number;
	review_comments: number;
	maintainer_can_modify: boolean;
	commits: number;
	additions: number;
	deletions: number;
	changed_files: number;
}

export interface Commit {
	id: string;
	tree_id: string;
	distinct: boolean;
	message: string;
	timestamp: string;
	url: string;
	author: Committer;
	committer: Committer;
	added: string[];
	modified: string[];
	removed: string[];
}

export interface CommitCommentCreatedEvent {
	action: 'created';
	comment: {
		url: string;
		html_url: string;
		id: number;
		node_id: string;
		user: User;
		position: number | null;
		line: number | null;
		path: string | null;
		commit_id: string;
		created_at: string;
		updated_at: string;
		author_association: AuthorAssociation;
		body: string;
	};
	repository: Repository;
	sender: User;
	installation?: InstallationLite;
	organization?: Organization;
}

export type CommitCommentEvent = CommitCommentCreatedEvent;

export interface DeploymentCreatedEvent {
	action: 'created';
	deployment: Deployment;
	workflow: Workflow | null;
	workflow_run: {
		id: number;
		name: string;
		path?: string;
		display_title?: string;
		node_id: string;
		head_branch: string;
		head_sha: string;
		run_number: number;
		event: string;
		status: 'requested' | 'in_progress' | 'completed' | 'queued';
		conclusion:
			| 'success'
			| 'failure'
			| 'neutral'
			| 'cancelled'
			| 'timed_out'
			| 'action_required'
			| 'stale'
			| null;
		workflow_id: number;
		check_suite_id: number;
		check_suite_node_id: string;
		url: string;
		html_url: string;
		pull_requests: {
			url: string;
			id: number;
			number: number;
			head: {
				ref: string;
				sha: string;
				repo: {
					id: number;
					url: string;
					name: string;
				};
			};
			base: {
				ref: string;
				sha: string;
				repo: {
					id: number;
					url: string;
					name: string;
				};
			};
		}[];
		created_at: string;
		updated_at: string;
		actor: User;
		triggering_actor: User;
		run_attempt: number;
		run_started_at: string;
		referenced_workflows?: {
			path: string;
			sha: string;
			ref?: string;
		}[];
	} | null;
	repository: Repository;
	sender: User;
	installation?: InstallationLite;
	organization?: Organization;
}

export type DeploymentEvent = DeploymentCreatedEvent;

export type PullRequestEvent =
	| PullRequestAssignedEvent
	| PullRequestAutoMergeDisabledEvent
	| PullRequestAutoMergeEnabledEvent
	| PullRequestClosedEvent
	| PullRequestConvertedToDraftEvent
	| PullRequestDemilestonedEvent
	| PullRequestDequeuedEvent
	| PullRequestEditedEvent
	| PullRequestEnqueuedEvent
	| PullRequestLabeledEvent
	| PullRequestLockedEvent
	| PullRequestMilestonedEvent
	| PullRequestOpenedEvent
	| PullRequestReadyForReviewEvent
	| PullRequestReopenedEvent
	| PullRequestReviewRequestRemovedEvent
	| PullRequestReviewRequestedEvent
	| PullRequestSynchronizeEvent
	| PullRequestUnassignedEvent
	| PullRequestUnlabeledEvent
	| PullRequestUnlockedEvent;

export interface PullRequestAssignedEvent {
	action: 'assigned';
	number: number;
	pull_request: PullRequest;
	assignee: User;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestAutoMergeDisabledEvent {
	action: 'auto_merge_disabled';
	number: number;
	pull_request: PullRequest;
	reason: string;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestAutoMergeEnabledEvent {
	action: 'auto_merge_enabled';
	number: number;
	pull_request: PullRequest;
	reason: string;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestClosedEvent {
	action: 'closed';
	number: number;
	pull_request: PullRequest & {
		state: 'closed';
		closed_at: string;
		merged: boolean;
	};
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestConvertedToDraftEvent {
	action: 'converted_to_draft';
	number: number;
	pull_request: PullRequest & {
		closed_at: null;
		merged_at: null;
		draft: true;
		merged: false;
		merged_by: null;
	};
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestDemilestonedEvent {
	action: 'demilestoned';
	number: number;
	pull_request: PullRequest & {
		milestone: Milestone;
	};
	milestone: Milestone;
	repository: Repository;
	sender: User;
	installation?: InstallationLite;
	organization?: Organization;
}

export interface PullRequestDequeuedEvent {
	action: 'dequeued';
	number: number;
	reason: string;
	pull_request: PullRequest;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestEditedEvent {
	action: 'edited';
	number: number;
	changes: {
		body?: {
			from: string;
		};
		title?: {
			from: string;
		};
		base?: {
			ref: {
				from: string;
			};
			sha: {
				from: string;
			};
		};
	};
	pull_request: PullRequest;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestEnqueuedEvent {
	action: 'enqueued';
	number: number;
	pull_request: PullRequest;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestLabeledEvent {
	action: 'labeled';
	number: number;
	pull_request: PullRequest;
	label: Label;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestLockedEvent {
	action: 'locked';
	number: number;
	pull_request: PullRequest;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestMilestonedEvent {
	action: 'milestoned';
	number: number;
	pull_request: PullRequest & {
		milestone: Milestone;
	};
	milestone: Milestone;
	repository: Repository;
	sender: User;
	installation?: InstallationLite;
	organization?: Organization;
}

export interface PullRequestOpenedEvent {
	action: 'opened';
	number: number;
	pull_request: PullRequest & {
		state: 'open';
		closed_at: null;
		merged_at: null;
		active_lock_reason: null;
		merged_by: null;
	};
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestReadyForReviewEvent {
	action: 'ready_for_review';
	number: number;
	pull_request: PullRequest & {
		state: 'open';
		closed_at: null;
		merged_at: null;
		draft: false;
		merged: boolean;
		merged_by: null;
	};
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestReopenedEvent {
	action: 'reopened';
	number: number;
	pull_request: PullRequest & {
		state: 'open';
		closed_at: null;
		merged_at: null;
		merged: boolean;
		merged_by: null;
	};
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export type PullRequestReviewRequestRemovedEvent =
	| {
			action: 'review_request_removed';
			number: number;
			pull_request: PullRequest;
			requested_reviewer: User;
			repository: Repository;
			installation?: InstallationLite;
			organization?: Organization;
			sender: User;
	  }
	| {
			action: 'review_request_removed';
			number: number;
			pull_request: PullRequest;
			requested_team: Team;
			repository: Repository;
			installation?: InstallationLite;
			organization?: Organization;
			sender: User;
	  };

export type PullRequestReviewRequestedEvent =
	| {
			action: 'review_requested';
			number: number;
			pull_request: PullRequest;
			requested_reviewer: User;
			repository: Repository;
			installation?: InstallationLite;
			organization?: Organization;
			sender: User;
	  }
	| {
			action: 'review_requested';
			number: number;
			pull_request: PullRequest;
			requested_team: Team;
			repository: Repository;
			installation?: InstallationLite;
			organization?: Organization;
			sender: User;
	  };

export interface PullRequestSynchronizeEvent {
	action: 'synchronize';
	number: number;
	before: string;
	after: string;
	pull_request: PullRequest;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestUnassignedEvent {
	action: 'unassigned';
	number: number;
	pull_request: PullRequest;
	assignee: User;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestUnlabeledEvent {
	action: 'unlabeled';
	number: number;
	pull_request: PullRequest;
	label: Label;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PullRequestUnlockedEvent {
	action: 'unlocked';
	number: number;
	pull_request: PullRequest;
	repository: Repository;
	installation?: InstallationLite;
	organization?: Organization;
	sender: User;
}

export interface PushEvent {
	ref: string;
	before: string;
	after: string;
	created: boolean;
	deleted: boolean;
	forced: boolean;
	base_ref: string | null;
	compare: string;
	commits: Commit[];
	head_commit: Commit | null;
	repository: Repository;
	pusher: Committer;
	sender: User;
	installation?: InstallationLite;
	organization?: Organization;
}

export type StarEvent = StarCreatedEvent | StarDeletedEvent;

export interface StarCreatedEvent {
	action: 'created';
	starred_at: string;
	repository: Repository;
	sender: User;
	organization?: Organization;
	installation?: InstallationLite;
}

export interface StarDeletedEvent {
	action: 'deleted';
	starred_at: null;
	repository: Repository;
	sender: User;
	organization?: Organization;
	installation?: InstallationLite;
}

export interface TeamAddEvent {
	team: Team;
	repository: Repository;
	sender: User;
	installation?: InstallationLite;
	organization: Organization;
}

export type WatchEvent = WatchStartedEvent;

export interface WatchStartedEvent {
	action: 'started';
	repository: Repository;
	sender: User;
	installation?: InstallationLite;
	organization?: Organization;
}
