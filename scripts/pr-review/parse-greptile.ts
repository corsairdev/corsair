export interface ReviewComment {
	id: number;
	pull_request_review_id: number;
	user: { login: string };
	path: string;
	line: number | null;
	body: string;
}

export interface Finding {
	severity: 'P0' | 'P1' | 'P2';
	title: string;
	detail: string;
	path: string;
	line: number | null;
	commentId: number;
}

const GREPTILE_LOGIN = 'greptile-apps[bot]';

export function parseFindings(
	comments: ReviewComment[],
	reviewId?: number,
): Finding[] {
	const findings: Finding[] = [];
	for (const c of comments) {
		if (c.user.login !== GREPTILE_LOGIN) continue;
		if (reviewId !== undefined && c.pull_request_review_id !== reviewId) {
			continue;
		}
		const sev = c.body.match(/alt="(P[0-2])"/)?.[1] as
			| Finding['severity']
			| undefined;
		if (!sev) continue;
		// Strip badge anchors first. Title = leading bold when present;
		// rule-based findings have no leading bold (their first bold is the
		// "Rule Used:" label), so fall back to the first text line.
		const stripped = c.body.replace(/<a href[\s\S]*?<\/a>\s*/g, '').trim();
		const boldStart = stripped.match(/^\*\*(.+?)\*\*/);
		const firstLine = (stripped.split('\n')[0] ?? '').trim();
		const title =
			boldStart?.[1] ?? (firstLine.slice(0, 120) || '(untitled finding)');
		const detail = (
			boldStart
				? stripped.replace(/^\*\*(.+?)\*\*/, '')
				: stripped.slice(firstLine.length)
		).trim();
		findings.push({
			severity: sev,
			title,
			detail,
			path: c.path,
			line: c.line,
			commentId: c.id,
		});
	}
	return findings;
}
