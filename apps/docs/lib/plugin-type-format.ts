/** Inline Zod→TS strings use `{ ... }` for objects; used to simplify table cells. */
export function isObjectLikeType(type: string): boolean {
	return type.includes('{');
}

/** Table "Type" column: primitives stay literal; object shapes become `object` / `object[]`. */
export function tableTypeDisplay(type: string): string {
	const t = type.trim();
	if (!isObjectLikeType(t)) return type;
	if (/\[\]\s*$/.test(t)) return 'object[]';
	return 'object';
}

/** One-line Zod→TS strings are unreadable past two levels; break them onto lines. */
export function prettifyTypeBlock(type: string): string {
	const unit = '  ';
	let out = '';
	let depth = 0;
	let i = 0;
	const n = type.length;

	const appendIndent = () => {
		out += unit.repeat(depth);
	};
	const skipSpace = () => {
		while (i < n && /\s/.test(type[i] as string)) i += 1;
	};

	while (i < n) {
		const ch = type[i] as string;

		// Array suffix `[]` (e.g. `{ a: string }[]`) — keep on one line, not `}[\n]`
		if (ch === '[' && type[i + 1] === ']') {
			out += '[]';
			i += 2;
			skipSpace();
			continue;
		}

		if (ch === '{' || ch === '[' || ch === '(') {
			out += ch;
			depth += 1;
			out += '\n';
			appendIndent();
			i += 1;
			skipSpace();
			continue;
		}

		if (ch === '}' || ch === ']' || ch === ')') {
			depth = Math.max(0, depth - 1);
			out = out.replace(/[ \t]+$/g, '');
			if (!out.endsWith('\n')) out += '\n';
			appendIndent();
			out += ch;
			i += 1;
			skipSpace();
			continue;
		}

		if (ch === ',') {
			out += ',\n';
			appendIndent();
			i += 1;
			skipSpace();
			continue;
		}

		if (ch === '|') {
			out = out.replace(/[ \t]+$/g, '');
			out += ' | ';
			i += 1;
			skipSpace();
			continue;
		}

		if (/\s/.test(ch)) {
			if (!out.endsWith(' ') && !out.endsWith('\n')) out += ' ';
			i += 1;
			continue;
		}

		out += ch;
		i += 1;
	}

	return out.trim();
}

function titleCaseSegment(s: string): string {
	if (s.length === 0) return s;
	return s.charAt(0).toUpperCase() + s.slice(1);
}

export function resourceTitle(resource: string): string {
	return resource
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.split(/[\s._]+/)
		.filter(Boolean)
		.map(titleCaseSegment)
		.join(' ');
}
