import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import type { LinkedIssue } from './policy.ts';
import {
	decideAssign,
	decideOneIssueCap,
	decidePrGate,
	FIRST_ISSUE_LABEL,
	GFI_NOTICE,
	hasFirstIssueLabel,
	isIntegrationIssue,
	NOTICE_MARKER,
	parseLinkedIssueNumbers,
} from './policy.ts';

function gh(args: string[]): string {
	return execFileSync('gh', args, {
		encoding: 'utf8',
		maxBuffer: 8 * 1024 * 1024,
	}).trim();
}

function labelNames(labels: unknown): string[] {
	if (!Array.isArray(labels)) return [];
	return labels
		.map((label) => {
			if (typeof label === 'string') return label;
			if (label && typeof label === 'object' && 'name' in label) {
				return String((label as { name: string }).name);
			}
			return '';
		})
		.filter(Boolean);
}

function assigneeLogins(assignees: unknown): string[] {
	if (!Array.isArray(assignees)) return [];
	return assignees
		.map((assignee) => {
			if (typeof assignee === 'string') return assignee;
			if (assignee && typeof assignee === 'object' && 'login' in assignee) {
				return String((assignee as { login: string }).login);
			}
			return '';
		})
		.filter(Boolean);
}

function commentOnIssue(repo: string, number: number, body: string): void {
	gh(['issue', 'comment', String(number), '--repo', repo, '--body', body]);
}

function alreadyHasNotice(repo: string, number: number): boolean {
	const comments = JSON.parse(
		gh(['api', `repos/${repo}/issues/${number}/comments`, '--paginate']),
	) as { body?: string }[];
	return comments.some((comment) => comment.body?.includes(NOTICE_MARKER));
}

function mergedPrCount(repo: string, user: string): number {
	const rows = JSON.parse(
		gh([
			'pr',
			'list',
			'--repo',
			repo,
			'--author',
			user,
			'--state',
			'merged',
			'--limit',
			'1',
			'--json',
			'number',
		]),
	) as unknown[];
	return rows.length;
}

function otherAssignedIssue(
	repo: string,
	user: string,
	currentIssue: number,
): number | null {
	const rows = JSON.parse(
		gh([
			'issue',
			'list',
			'--repo',
			repo,
			'--assignee',
			user,
			'--state',
			'open',
			'--limit',
			'20',
			'--json',
			'number',
		]),
	) as { number: number }[];
	const other = rows.find((row) => row.number !== currentIssue);
	return other?.number ?? null;
}

function assigneeHasWrite(repo: string, user: string): boolean {
	try {
		const data = JSON.parse(
			gh(['api', `repos/${repo}/collaborators/${user}/permission`]),
		) as { permission?: string };
		return (
			data.permission === 'admin' ||
			data.permission === 'maintain' ||
			data.permission === 'write'
		);
	} catch {
		return false;
	}
}

function loadIssue(repo: string, number: number): LinkedIssue {
	const issue = JSON.parse(
		gh([
			'issue',
			'view',
			String(number),
			'--repo',
			repo,
			'--json',
			'number,state,labels,assignees',
		]),
	) as {
		number: number;
		state: string;
		labels: { name: string }[];
		assignees: { login: string }[];
	};
	return {
		number: issue.number,
		open: issue.state.toLowerCase() === 'open',
		labels: labelNames(issue.labels),
		assignees: assigneeLogins(issue.assignees),
	};
}

type IssuePayload = {
	number: number;
	state: string;
	labels?: unknown;
	assignees?: unknown;
	pull_request?: unknown;
	body?: string | null;
	user?: { login?: string };
};

function applyAssign(
	repo: string,
	issue: IssuePayload,
	commenter: string,
	association: string,
	auto: boolean,
	commentBody: string,
): void {
	const decision = decideAssign({
		isPullRequest: issue.pull_request != null,
		commentBody,
		issueOpen: issue.state === 'open',
		issueLabels: labelNames(issue.labels),
		assignees: assigneeLogins(issue.assignees),
		commenter,
		commenterAssociation: association,
		commenterMergedPrs: mergedPrCount(repo, commenter),
		otherAssignedIssue: otherAssignedIssue(repo, commenter, issue.number),
		auto,
	});

	if (decision.action === 'ignore') return;

	const alreadyAssigned = assigneeLogins(issue.assignees)
		.map((login) => login.toLowerCase())
		.includes(commenter.toLowerCase());
	if (decision.action === 'assign' && !alreadyAssigned) {
		try {
			gh([
				'issue',
				'edit',
				String(issue.number),
				'--repo',
				repo,
				'--add-assignee',
				commenter,
			]);
		} catch (error) {
			commentOnIssue(
				repo,
				issue.number,
				`@${commenter} I could not assign you automatically (${
					error instanceof Error ? error.message.split('\n')[0] : error
				}). A maintainer may need to assign you.`,
			);
			return;
		}
	}

	commentOnIssue(repo, issue.number, decision.reply);
}

function handleAssign(
	repo: string,
	event: {
		issue?: IssuePayload;
		comment?: { body?: string; user?: { login?: string } };
	},
	association: string,
): void {
	const issue = event.issue;
	const commenter = event.comment?.user?.login;
	if (!issue || !commenter) return;
	applyAssign(
		repo,
		issue,
		commenter,
		association,
		false,
		event.comment?.body ?? '',
	);
}

function postNoticeIfNeeded(repo: string, number: number): void {
	if (alreadyHasNotice(repo, number)) return;
	commentOnIssue(repo, number, GFI_NOTICE);
}

function handleIssueEvent(
	repo: string,
	event: {
		action?: string;
		label?: { name?: string };
		assignee?: { login?: string };
		issue?: IssuePayload;
	},
	association: string,
): void {
	const issue = event.issue;
	if (!issue || issue.pull_request) return;

	const labels =
		event.action === 'opened'
			? labelNames(issue.labels)
			: [event.label?.name ?? ''];
	if (hasFirstIssueLabel(labels)) {
		postNoticeIfNeeded(repo, issue.number);
	}

	if (event.action === 'assigned') {
		const assignee = event.assignee?.login;
		if (!assignee) return;
		const cap = decideOneIssueCap({
			login: assignee,
			maintainer: assigneeHasWrite(repo, assignee),
			otherAssignedIssue: otherAssignedIssue(repo, assignee, issue.number),
		});
		if (cap.action !== 'revert') return;
		gh([
			'issue',
			'edit',
			String(issue.number),
			'--repo',
			repo,
			'--remove-assignee',
			assignee,
		]);
		commentOnIssue(repo, issue.number, cap.reply);
		return;
	}

	if (event.action !== 'opened') return;
	const author = issue.user?.login;
	if (!author || !isIntegrationIssue(issue.body ?? '')) return;
	applyAssign(repo, issue, author, association, true, '/assign');
}

function handleBackfill(repo: string): void {
	const rows = JSON.parse(
		gh([
			'issue',
			'list',
			'--repo',
			repo,
			'--label',
			FIRST_ISSUE_LABEL,
			'--state',
			'open',
			'--limit',
			'100',
			'--json',
			'number',
		]),
	) as { number: number }[];
	for (const row of rows) {
		postNoticeIfNeeded(repo, row.number);
	}
}

function handlePullRequest(
	repo: string,
	event: {
		pull_request?: {
			number: number;
			draft?: boolean;
			body?: string | null;
			title?: string;
			user?: { login?: string };
			labels?: unknown;
		};
	},
	association: string,
): void {
	const pr = event.pull_request;
	const author = pr?.user?.login;
	if (!pr || !author) return;

	const linkedNumbers = parseLinkedIssueNumbers(
		`${pr.title ?? ''}\n${pr.body ?? ''}`,
	);
	const linkedIssues = linkedNumbers.map((number) => loadIssue(repo, number));

	const decision = decidePrGate({
		isDraft: Boolean(pr.draft),
		author,
		authorAssociation: association,
		authorMergedPrs: mergedPrCount(repo, author),
		prLabels: labelNames(pr.labels),
		linkedIssues,
	});

	if (decision.action === 'ok') return;

	gh([
		'pr',
		'close',
		String(pr.number),
		'--repo',
		repo,
		'--comment',
		decision.reason,
	]);
}

const event = JSON.parse(
	fs.readFileSync(process.env.GITHUB_EVENT_PATH ?? '', 'utf8'),
) as {
	action?: string;
	label?: { name?: string };
	assignee?: { login?: string };
	issue?: IssuePayload;
	comment?: { body?: string; user?: { login?: string } };
	pull_request?: {
		number: number;
		draft?: boolean;
		body?: string | null;
		title?: string;
		user?: { login?: string };
		labels?: unknown;
	};
};

const repo = process.env.GITHUB_REPOSITORY ?? '';
const eventName = process.env.GITHUB_EVENT_NAME ?? '';
const association =
	process.env.COMMENTER_ASSOCIATION || process.env.AUTHOR_ASSOCIATION || '';

if (eventName === 'workflow_dispatch') {
	handleBackfill(repo);
} else if (eventName === 'issue_comment') {
	handleAssign(repo, event, association);
} else if (eventName === 'issues') {
	handleIssueEvent(repo, event, association);
} else if (
	eventName === 'pull_request' ||
	eventName === 'pull_request_target'
) {
	handlePullRequest(repo, event, association);
} else {
	console.log(`Nothing to do for ${eventName}`);
}
