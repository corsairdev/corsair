import type { GateFailure } from './gate.ts';
import type { Finding } from './parse-greptile.ts';

const MARKER = /<!-- corsair-review-bot round=(\d) -->/;

export function currentRound(issueComments: { body: string }[]): number {
	let round = 0;
	for (const c of issueComments) {
		const m = c.body.match(MARKER);
		if (m) round = Math.max(round, Number(m[1]));
	}
	return round;
}

export function decide(
	round: number,
	findings: Finding[],
): 'comment' | 'escalate' | 'done' {
	const serious = findings.filter((f) => f.severity !== 'P2');
	if (serious.length === 0) return 'done';
	if (round === 0) return 'comment';
	// round 1, or a legacy round=2 marker left by the retired fix job — escalate
	// to the maintainer queue. Escalating posts the round=3 marker, so the next
	// review lands here as round 3.
	if (round <= 2) return 'escalate';
	// Round 3+: already escalated — stay silent; the done branch refreshes in place.
	return 'done';
}

function findingLines(findings: Finding[]): string[] {
	return findings.map(
		(f) =>
			`- **${f.severity}** \`${f.path}${f.line ? `:${f.line}` : ''}\` — **${f.title}**\n  ${f.detail}`,
	);
}

export function buildRoundOneComment(
	findings: Finding[],
	gateFailures: GateFailure[],
	author: string,
): string {
	const serious = findings.filter((f) => f.severity !== 'P2');
	const optional = findings.filter((f) => f.severity === 'P2');
	const parts = [
		'<!-- corsair-review-bot round=1 -->',
		`Hey @${author}, thanks for the contribution! 🏴‍☠️ Before a maintainer reviews, please fix the items below — the review re-runs automatically on your next push.`,
	];
	if (serious.length > 0) {
		parts.push('', '### Must fix', ...findingLines(serious));
	}
	if (gateFailures.length > 0) {
		parts.push(
			'',
			'### PR requirements ([rules](https://github.com/corsairdev/corsair/blob/main/.github/PLUGIN_PR_RULES.md))',
			...gateFailures.map((g) => `- **${g.rule}** — ${g.message}`),
		);
	}
	if (optional.length > 0) {
		parts.push(
			'',
			'<details><summary>Optional improvements (P2)</summary>',
			'',
			...findingLines(optional),
			'</details>',
		);
	}
	parts.push(
		'',
		'_If anything remains after your next push, a maintainer will take it from there and do the final review and merge._',
	);
	return parts.join('\n');
}

export function buildEscalationComment(findings: Finding[]): string {
	return [
		'<!-- corsair-review-bot round=3 -->',
		'### Maintainer review needed',
		'Automated rounds are exhausted. Remaining findings:',
		...findingLines(findings.filter((f) => f.severity !== 'P2')),
	].join('\n');
}
