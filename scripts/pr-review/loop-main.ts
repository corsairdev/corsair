import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import {
	ASSERTION_WARN_FLOOR,
	countTestFilesByPlugin,
	detectPlugin,
	PR_FILES_JQ,
	parsePrFileRows,
	renderScorecard,
	runGate,
	touchedPlugins,
} from './gate.ts';
import {
	buildEscalationComment,
	buildResolvedComment,
	buildRoundOneComment,
	currentRound,
	decide,
	reviewSupersededByCleanSummary,
} from './loop.ts';
import type { ReviewComment } from './parse-greptile.ts';
import { parseFindings } from './parse-greptile.ts';

function gh(args: string[]): string {
	return execFileSync('gh', args, {
		encoding: 'utf8',
		maxBuffer: 64 * 1024 * 1024,
	});
}

const event = JSON.parse(
	fs.readFileSync(process.env.GITHUB_EVENT_PATH ?? '', 'utf8'),
);
const repo = process.env.GITHUB_REPOSITORY ?? '';

// Triggered either by pull_request_review (same-repo PRs) or issue_comment
// (Greptile edits its summary comment each review; this event runs with
// base-repo permissions even for fork PRs). Normalize to a PR object.
if (!event.pull_request && event.issue?.pull_request) {
	event.pull_request = JSON.parse(
		gh(['api', `repos/${repo}/pulls/${event.issue.number}`]),
	);
}
if (!event.pull_request) {
	console.log('No pull request in event — skipped.');
	process.exit(0);
}
if (!event.review) {
	const latest = JSON.parse(
		gh([
			'api',
			`repos/${repo}/pulls/${event.pull_request.number}/reviews`,
			'--paginate',
		]),
	)
		.filter(
			(r: { user: { login: string } }) => r.user.login === 'greptile-apps[bot]',
		)
		.pop();
	if (!latest) {
		console.log('No greptile review yet — skipped.');
		process.exit(0);
	}
	event.review = latest;
}
// Fail closed: fork-triggered runs don't receive repo variables, so an
// unset flag must mean dry-run, never live.
const dryRun = process.env.PR_BOT_DRY_RUN !== 'false';
const pr = event.pull_request.number as number;
const reviewId = event.review.id as number;
const author = event.pull_request.user.login as string;

const { changedFiles, addedFiles } = parsePrFileRows(
	gh([
		'api',
		`repos/${repo}/pulls/${pr}/files`,
		'--paginate',
		'--jq',
		PR_FILES_JQ,
	]),
);
// Read live, as in the gate job, so a team multi-plugin PR gets the same
// verdict here as in the required check.
const labels = gh([
	'api',
	`repos/${repo}/issues/${pr}/labels`,
	'--paginate',
	'--jq',
	'.[].name',
])
	.trim()
	.split('\n')
	.filter(Boolean);
// The triage job checks out the base branch, so plugin content signals come
// from the PR head via the contents API. Assertion counting only inspects
// changed test files — the gate job (full PR checkout) is authoritative.
const headRepo = event.pull_request.head.repo.full_name as string;
const headSha = event.pull_request.head.sha as string;

function headFile(filePath: string): string | null {
	try {
		return gh([
			'api',
			`repos/${headRepo}/contents/${filePath}?ref=${headSha}`,
			'--jq',
			'.content',
		]);
	} catch {
		return null;
	}
}

const plugin = detectPlugin(changedFiles);

// Test existence comes from the head tree (update PRs need not touch
// tests); assertion depth only inspects changed test files — the gate job
// (full checkout) is authoritative for depth. One recursive tree call
// counts tests for every touched plugin (team multi-plugin PRs need all).
let testFileCounts: Record<string, number> = {};
const touched = touchedPlugins(changedFiles);
if (touched.length > 0) {
	try {
		const testPaths = gh([
			'api',
			`repos/${headRepo}/git/trees/${headSha}?recursive=1`,
			'--jq',
			'.tree[] | select(.path | startswith("packages/") and endswith(".test.ts")) | .path',
		])
			.trim()
			.split('\n')
			.filter(Boolean);
		testFileCounts = countTestFilesByPlugin(testPaths, touched);
	} catch {
		testFileCounts = {};
	}
}
const testFileCount = plugin ? (testFileCounts[plugin] ?? 0) : 0;
let assertionCount = testFileCount > 0 ? ASSERTION_WARN_FLOOR : 0;
for (const f of changedFiles) {
	if (plugin && f.startsWith(`packages/${plugin}/`) && f.endsWith('.test.ts')) {
		const b64 = headFile(f);
		if (b64) {
			const content = Buffer.from(b64, 'base64').toString('utf8');
			assertionCount += content.match(/\b(expect|assert)\s*\(/g)?.length ?? 0;
		}
	}
}

const gate = runGate({
	changedFiles,
	prBody: (event.pull_request.body as string) ?? '',
	isDraft: event.pull_request.draft as boolean,
	testFileCount,
	assertionCount,
	labels,
	authorAssociation: event.pull_request.author_association as string,
	addedFiles,
	testFileCounts,
});
if (!gate.isPluginPr) {
	console.log('Not a plugin PR (or draft) — loop skipped.');
	process.exit(0);
}

// Fork PRs: the pull_request-triggered gate job has a read-only token and
// cannot post; this workflow runs in base context, so it owns the scorecard
// comment and the gate:failed label on every review.
if (!dryRun) {
	upsert('<!-- corsair-pr-gate -->', renderScorecard(gate));
	if (gate.failures.length > 0) {
		label('gate:failed');
	} else {
		unlabel('gate:failed');
	}
}

const reviewComments = JSON.parse(
	gh(['api', `repos/${repo}/pulls/${pr}/comments`, '--paginate']),
) as ReviewComment[];

const issueComments = JSON.parse(
	gh(['api', `repos/${repo}/issues/${pr}/comments`, '--paginate']),
) as { body: string; updated_at?: string; user?: { login: string } }[];

// A clean Greptile re-review edits its summary and creates no review object,
// so the latest review can belong to an older commit whose findings are
// already fixed. Trust the newer summary when it raises nothing serious.
const greptileSummary = issueComments
	.filter(
		(c) =>
			c.user?.login === 'greptile-apps[bot]' &&
			/Last reviewed commit/.test(c.body),
	)
	.pop();
const staleReview = reviewSupersededByCleanSummary(
	greptileSummary
		? {
				body: greptileSummary.body,
				updatedAt: greptileSummary.updated_at ?? '',
			}
		: undefined,
	{
		commitId: (event.review.commit_id as string | undefined) ?? '',
		submittedAt: (event.review.submitted_at as string | undefined) ?? '',
	},
);
if (staleReview) {
	console.log(
		`Review ${reviewId} predates Greptile's latest clean summary — its findings are treated as resolved.`,
	);
}
const findings = staleReview ? [] : parseFindings(reviewComments, reviewId);
const round = currentRound(issueComments);
let decision = decide(round, findings);
const seriousCount = findings.filter((f) => f.severity !== 'P2').length;

// Never flag a maintainer while the PR itself is incomplete
// (missing tests/description/video). Keep the round-1 findings comment fresh
// and stay put; the loop re-fires on the contributor's next push.
const escalateDeferred = decision === 'escalate' && gate.failures.length > 0;
if (escalateDeferred) {
	console.log(
		`Escalation deferred — gate still failing (${gate.failures.map((f) => f.rule).join(', ')}).`,
	);
	decision = 'comment';
}

function post(body: string): void {
	const final = dryRun
		? `<!-- corsair-review-bot dry-run -->\n<details><summary>DRY RUN — would post:</summary>\n\n${body}\n</details>`
		: body;
	gh([
		'api',
		'-X',
		'POST',
		`repos/${repo}/issues/${pr}/comments`,
		'-f',
		`body=${final}`,
	]);
}

// Edits the existing comment carrying the marker instead of posting a new
// one, so each round keeps a single live comment. Falls back to post.
function upsert(marker: string, body: string): void {
	if (dryRun) {
		post(body);
		return;
	}
	const existing = (
		JSON.parse(
			gh(['api', `repos/${repo}/issues/${pr}/comments`, '--paginate']),
		) as { id: number; body: string }[]
	).find((c) => c.body.startsWith(marker));
	if (existing) {
		gh([
			'api',
			'-X',
			'PATCH',
			`repos/${repo}/issues/comments/${existing.id}`,
			'-f',
			`body=${body}`,
		]);
	} else {
		post(body);
	}
}

function label(name: string): void {
	if (dryRun) return;
	gh([
		'api',
		'-X',
		'POST',
		`repos/${repo}/issues/${pr}/labels`,
		'-f',
		`labels[]=${name}`,
	]);
}

function unlabel(name: string): void {
	if (dryRun) return;
	try {
		gh(['api', '-X', 'DELETE', `repos/${repo}/issues/${pr}/labels/${name}`]);
	} catch {
		// label was not present
	}
}

const R1_MARKER = '<!-- corsair-review-bot round=1 -->';
const R3_MARKER = '<!-- corsair-review-bot round=3 -->';

switch (decision) {
	case 'comment':
		upsert(R1_MARKER, buildRoundOneComment(findings, gate.failures, author));
		label('bot:round-1');
		break;
	case 'escalate':
		upsert(R3_MARKER, buildEscalationComment(findings));
		label('needs-maintainer');
		break;
	case 'done':
		if (round >= 3 && seriousCount > 0) {
			// Escalated but still moving — refresh the escalation summary
			// in place; never post new comments after escalation.
			upsert(R3_MARKER, buildEscalationComment(findings));
		} else if (round >= 3 && seriousCount === 0 && gate.failures.length === 0) {
			// Escalated PR became clean — clear the maintainer flag and replace
			// the escalation comment, so neither still asks for a maintainer.
			unlabel('needs-maintainer');
			upsert(R3_MARKER, buildResolvedComment());
		} else {
			console.log('Nothing to do this round.');
		}
		break;
}
console.log(
	`round=${round} decision=${decision} findings=${findings.length} dryRun=${dryRun}`,
);
