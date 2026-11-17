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
		const badUrl = invalidBareUrlAt(s, i);
		if (badUrl) {
			i += badUrl.length;
			// A backtick right after would join the closing one into a longer run,
			// and the span would close somewhere else.
			out += `\`${badUrl}\`${s[i] === '`' ? ' ' : ''}`;
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

/**
 * GFM turns a bare http(s):// address into a link, and Mintlify drops the whole
 * page when that link isn't a valid URL, such as the example
 * `http://user:pass@host:port`. Returns such an address starting at `at`, to be
 * shown as code; null when there's none or it is a valid URL. Like GFM's
 * autolink, the address starts at the beginning of the text or after
 * whitespace, `*`, `_`, `~` or `(`, and ends at whitespace or `<`, minus
 * trailing punctuation and an unbalanced closing parenthesis.
 */
function invalidBareUrlAt(s: string, at: number): string | null {
	if (!s.startsWith('http://', at) && !s.startsWith('https://', at))
		return null;
	if (at > 0 && !/[\s*_~(]/.test(s[at - 1]!)) return null;
	const found = /^https?:\/\/[^\s<`]+/.exec(s.slice(at));
	if (!found) return null;
	let url = found[0];
	for (;;) {
		const trimmed = url.replace(/[?!.,:*_~'"]+$/, '');
		const opens = trimmed.split('(').length - 1;
		const closes = trimmed.split(')').length - 1;
		const next =
			trimmed.endsWith(')') && closes > opens ? trimmed.slice(0, -1) : trimmed;
		if (next === url) break;
		url = next;
	}
	try {
		new URL(url);
		return null;
	} catch {
		return url;
	}
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
