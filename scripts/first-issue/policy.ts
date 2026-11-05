export const FIRST_ISSUE_LABEL = 'good first issue';
export const NOTICE_MARKER = '<!-- corsair-gfi-notice -->';
export const INTEGRATION_MARKER = '<!-- corsair-integration-request -->';

export const GFI_NOTICE = `${NOTICE_MARKER}
## First-time contributors only

This issue is reserved for **first-time contributors** to Corsair. If you have already had a pull request merged here, do not take this issue — we will not merge it.

**How to claim**
1. Comment \`/assign\` on this issue.
2. Wait until GitHub shows you as the assignee. Do not open a PR before that.
3. You may have only **one** assigned issue at a time, across integration requests, \`good first issue\`, and every other issue.

Pull requests that are not assigned, or that are opened by someone who is not a first-time contributor, will be closed and will not be merged.
`;

const FTC_ASSOCIATIONS = new Set([
	'FIRST_TIMER',
	'FIRST_TIME_CONTRIBUTOR',
	'NONE',
	'',
]);

const MAINTAINER_ASSOCIATIONS = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

export function isAssignCommand(body: string): boolean {
	return /^\s*\/assign(?:\s+me)?\s*$/i.test(body.trim());
}

export function isIntegrationIssue(body: string): boolean {
	return (
		body.includes(INTEGRATION_MARKER) ||
		body.includes('### What API or service would you like integrated?')
	);
}

export function parseLinkedIssueNumbers(text: string): number[] {
	const found = new Set<number>();
	const re = /(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?):?\s+#(\d+)/gi;
	for (const match of text.matchAll(re)) {
		found.add(Number(match[1]));
	}
	return [...found].sort((a, b) => a - b);
}

export function isMaintainer(association: string): boolean {
	return MAINTAINER_ASSOCIATIONS.has(association);
}

export function isFirstTimeContributor(
	association: string,
	mergedPrCount: number,
): boolean {
	if (mergedPrCount > 0) return false;
	return FTC_ASSOCIATIONS.has(association);
}

export function hasFirstIssueLabel(labels: string[]): boolean {
	return labels.some((label) => label.toLowerCase() === FIRST_ISSUE_LABEL);
}

export function oneIssueCapReply(login: string, otherIssue: number): string {
	return `@${login} you already have #${otherIssue} assigned. Finish or unassign that one first — one issue at a time, whether it is an integration, a \`good first issue\`, or anything else.`;
}

export type CapDecision =
	| { action: 'ok' }
	| { action: 'revert'; reply: string };

export function decideOneIssueCap(input: {
	login: string;
	maintainer: boolean;
	otherAssignedIssue: number | null;
}): CapDecision {
	if (input.maintainer || input.otherAssignedIssue == null) {
		return { action: 'ok' };
	}
	return {
		action: 'revert',
		reply: oneIssueCapReply(input.login, input.otherAssignedIssue),
	};
}

export type AssignDecision =
	| { action: 'ignore' }
	| { action: 'assign'; reply: string }
	| { action: 'reject'; reply: string };

export function decideAssign(input: {
	isPullRequest: boolean;
	commentBody: string;
	issueOpen: boolean;
	issueLabels: string[];
	assignees: string[];
	commenter: string;
	commenterAssociation: string;
	commenterMergedPrs: number;
	otherAssignedIssue: number | null;
	auto?: boolean;
}): AssignDecision {
	if (input.isPullRequest) {
		return { action: 'ignore' };
	}
	if (!input.auto && !isAssignCommand(input.commentBody)) {
		return { action: 'ignore' };
	}

	const commenter = input.commenter.toLowerCase();
	const assignees = input.assignees.map((login) => login.toLowerCase());
	const maintainer = isMaintainer(input.commenterAssociation);
	const firstIssue = hasFirstIssueLabel(input.issueLabels);

	if (!input.issueOpen) {
		return {
			action: 'reject',
			reply: 'This issue is closed, so it cannot be assigned.',
		};
	}

	if (assignees.includes(commenter)) {
		return {
			action: 'assign',
			reply: `@${input.commenter} you are already assigned to this issue.`,
		};
	}

	if (assignees.length > 0) {
		return {
			action: 'reject',
			reply: `This issue is already assigned to ${assignees.map((login) => `@${login}`).join(', ')}.`,
		};
	}

	const cap = decideOneIssueCap({
		login: input.commenter,
		maintainer,
		otherAssignedIssue: input.otherAssignedIssue,
	});
	if (cap.action === 'revert') {
		return { action: 'reject', reply: cap.reply };
	}

	if (
		firstIssue &&
		!maintainer &&
		!isFirstTimeContributor(
			input.commenterAssociation,
			input.commenterMergedPrs,
		)
	) {
		return {
			action: 'reject',
			reply: `@${input.commenter} this issue is marked \`${FIRST_ISSUE_LABEL}\` and is reserved for first-time contributors. We will not merge a PR from someone who already has a merged contribution here.`,
		};
	}

	return {
		action: 'assign',
		reply: `@${input.commenter} you are assigned. You can open a PR that links this issue (\`Fixes #…\`). Remember: one issue at a time.`,
	};
}

export type LinkedIssue = {
	number: number;
	open: boolean;
	labels: string[];
	assignees: string[];
};

export type PrGateDecision =
	| { action: 'ok' }
	| { action: 'close'; reason: string };

export function decidePrGate(input: {
	isDraft: boolean;
	author: string;
	authorAssociation: string;
	authorMergedPrs: number;
	prLabels: string[];
	linkedIssues: LinkedIssue[];
}): PrGateDecision {
	if (input.isDraft || isMaintainer(input.authorAssociation)) {
		return { action: 'ok' };
	}

	const author = input.author.toLowerCase();
	const firstTime = isFirstTimeContributor(
		input.authorAssociation,
		input.authorMergedPrs,
	);
	const prIsFirstIssue = hasFirstIssueLabel(input.prLabels);
	const firstIssues = input.linkedIssues.filter((issue) =>
		hasFirstIssueLabel(issue.labels),
	);

	if (prIsFirstIssue && firstIssues.length === 0) {
		if (!firstTime) {
			return {
				action: 'close',
				reason: `This pull request is marked \`${FIRST_ISSUE_LABEL}\`, which is reserved for first-time contributors. It will not be merged.`,
			};
		}
		return {
			action: 'close',
			reason: `This pull request is marked \`${FIRST_ISSUE_LABEL}\`. Link the issue with \`Fixes #…\` and comment \`/assign\` on that issue before opening a PR.`,
		};
	}

	for (const issue of firstIssues) {
		if (!firstTime) {
			return {
				action: 'close',
				reason: `#${issue.number} is marked \`${FIRST_ISSUE_LABEL}\` and is reserved for first-time contributors. This PR will not be merged.`,
			};
		}
		if (issue.assignees.length === 0) {
			return {
				action: 'close',
				reason: `#${issue.number} is a \`${FIRST_ISSUE_LABEL}\` and is not assigned. Comment \`/assign\` on the issue first, then reopen your PR.`,
			};
		}
		if (!issue.assignees.map((login) => login.toLowerCase()).includes(author)) {
			return {
				action: 'close',
				reason: `#${issue.number} is assigned to ${issue.assignees.map((login) => `@${login}`).join(', ')}, not @${input.author}.`,
			};
		}
	}

	for (const issue of input.linkedIssues) {
		if (issue.assignees.length === 0) {
			return {
				action: 'close',
				reason: `#${issue.number} is not assigned. Comment \`/assign\` on the issue first, then reopen your PR.`,
			};
		}
		if (!issue.assignees.map((login) => login.toLowerCase()).includes(author)) {
			return {
				action: 'close',
				reason: `#${issue.number} is already assigned to ${issue.assignees.map((login) => `@${login}`).join(', ')}.`,
			};
		}
	}

	return { action: 'ok' };
}
