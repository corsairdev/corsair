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
	// scalar that equals one of the members matches. Primitive type names are
	// left to the checks below: the string "number" is not a number.
	if (
		(typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean') &&
		!PRIMITIVE_TYPE_NAMES.has(String(value)) &&
		topLevelUnionMembers(t).includes(String(value))
	) {
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
