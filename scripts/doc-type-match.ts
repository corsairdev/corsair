// Matching yaml example values against the type strings the docs generator
// renders. Split out of generate-plugin-docs.ts so it can be tested.

const PRIMITIVE_TYPE_NAMES = new Set([
	'string',
	'number',
	'boolean',
	'null',
	'unknown',
	'any',
	'object',
]);

/** Splits a type on its top-level `|` (not inside `{}`, `()`, `[]` or `<>`). */
export function topLevelUnionMembers(type: string): string[] {
	const members: string[] = [];
	let depth = 0;
	let start = 0;
	for (let i = 0; i < type.length; i++) {
		const ch = type[i];
		if (ch === '{' || ch === '(' || ch === '[' || ch === '<') depth++;
		else if (ch === '}' || ch === ')' || ch === ']' || ch === '>') depth--;
		else if (ch === '|' && depth === 0) {
			members.push(type.slice(start, i).trim());
			start = i + 1;
		}
	}
	members.push(type.slice(start).trim());
	return members;
}

/** Loose check that a yaml example value matches a docs type string (e.g. `string`, `boolean`). */
// unknown: yaml examples parse to any JSON-like value; the checks below narrow it.
export function valueMatchesDocType(value: unknown, typeStr: string): boolean {
	const t = typeStr.trim();
	// Any JSON value, and `any`, accept every example, but only when the whole
	// type (or one of its top-level members) is that. `JsonValue[]` still needs
	// an array and `Record<string, JsonValue>` an object.
	if (topLevelUnionMembers(t).some((m) => m === 'JsonValue' || m === 'any')) {
		return true;
	}
	// Enum members render unquoted (`newestFirst | ratingHigh | null`), so a
	// scalar that equals one of the members matches, but only a member of its
	// own kind: a string matches word members, a number matches numeric ones,
	// a boolean `true`/`false`. So "10" doesn't match `10 | 25` and "false"
	// doesn't match `false`. Type names and structural members (`JsonValue[]`,
	// `{ … }`) never match a scalar.
	if (enumMemberMatches(value, topLevelUnionMembers(t))) {
		return true;
	}
	if (value === null) {
		return /\bnull\b/.test(t) || t.includes('| null') || t.endsWith('null');
	}
	if (typeof value === 'boolean') return /\bboolean\b/.test(t);
	if (typeof value === 'number') return /\bnumber\b/.test(t);
	if (typeof value === 'string') {
		return (
			/\bstring\b/.test(t) ||
			t.includes("'") ||
			t.includes('"') ||
			t.startsWith('`')
		);
	}
	if (Array.isArray(value)) {
		return t.includes('[]') || /\bArray</.test(t);
	}
	if (typeof value === 'object') {
		return (
			t.includes('{') ||
			t === 'object' ||
			/\bRecord</.test(t) ||
			t === 'unknown'
		);
	}
	return false;
}

const NUMERIC_MEMBER = /^-?\d+(\.\d+)?$/;
const STRUCTURAL_MEMBER = /[[\]{}()<>]/;

// unknown: yaml example values are any JSON-like value; only scalars can match a member.
function enumMemberMatches(value: unknown, members: string[]): boolean {
	if (typeof value === 'number') {
		return members.some(
			(member) => NUMERIC_MEMBER.test(member) && Number(member) === value,
		);
	}
	if (typeof value === 'boolean') {
		return members.includes(String(value));
	}
	if (typeof value !== 'string') return false;
	if (PRIMITIVE_TYPE_NAMES.has(value)) return false;
	if (NUMERIC_MEMBER.test(value) || value === 'true' || value === 'false') {
		return false;
	}
	return members.some(
		(member) => member === value && !STRUCTURAL_MEMBER.test(member),
	);
}
