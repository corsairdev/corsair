const MDX_ENTITIES: Record<string, string> = {
	'<': '&lt;',
	'>': '&gt;',
	'{': '&#123;',
	'}': '&#125;',
};

/**
 * Provider descriptions can contain `<name>`, `<>` or `{ type: "world" }`. In MDX
 * prose those parse as JSX or JS expressions, the page fails to compile, and
 * Mintlify drops it (404). Escape them, except inside inline code spans, which
 * MDX leaves alone. A code span opens with a run of backticks and closes at the
 * next run of the same length (CommonMark); an unmatched run is plain text, and
 * so is an escaped backtick outside a span. Inside a span backslashes are
 * literal, so closingRun doesn't skip them.
 */
export function escapeMdxText(s: string | undefined): string {
	if (!s) return '';
	let out = '';
	let i = 0;
	while (i < s.length) {
		const ch = s[i]!;
		// A backslash-escaped backtick is literal text and can't open a span.
		if (ch === '\\' && s[i + 1] === '`') {
			out += '\\`';
			i += 2;
			continue;
		}
		if (ch !== '`') {
			out += MDX_ENTITIES[ch] ?? ch;
			i++;
			continue;
		}
		const open = backtickRun(s, i);
		const close = closingRun(s, i + open, open);
		const end = close === -1 ? i + open : close + open;
		out += s.slice(i, end);
		i = end;
	}
	return out;
}

function backtickRun(s: string, at: number): number {
	let n = 0;
	while (s[at + n] === '`') n++;
	return n;
}

/** Start of the next run of exactly `n` backticks at or after `from`, or -1. */
function closingRun(s: string, from: number, n: number): number {
	let i = from;
	while (i < s.length) {
		if (s[i] !== '`') {
			i++;
			continue;
		}
		const run = backtickRun(s, i);
		if (run === n) return i;
		i += run;
	}
	return -1;
}
