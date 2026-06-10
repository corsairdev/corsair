function parseGithubNumber(url: string, kind: 'issue' | 'pr') {
	const pattern =
		kind === 'issue' ? /\/issues\/(\d+)(?:[/?#]|$)/i : /\/pull\/(\d+)(?:[/?#]|$)/i;
	const match = url.match(pattern);
	return match?.[1] ?? null;
}

export function formatIntegrationIssueLabel(url: string | null | undefined) {
	if (!url) return null;

	const number = parseGithubNumber(url, 'issue');
	if (!number) return null;

	return {
		href: url,
		label: `Issue: #${number}`,
	};
}

export function formatIntegrationPrLabel(url: string | null | undefined) {
	if (!url) return null;

	const number = parseGithubNumber(url, 'pr');
	if (!number) return null;

	return {
		href: url,
		label: `PR: #${number}`,
	};
}
