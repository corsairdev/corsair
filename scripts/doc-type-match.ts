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
	// scalar that equals one of the members matches: a number only numeric
	// members, a boolean only `true`/`false`. Type names and structural members
	// (`JsonValue[]`, `{ … }`) never match a scalar.
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
	// A rendered member doesn't say whether `1` was the string '1' or the
	// number 1 (z.enum(['HIGH', 'LOW', '1', '0']) renders `HIGH | LOW | 1 | 0`),
	// so a string may match any word member here. The generator checks
	// examples against the plugin's own zod schema first (fieldSchemaCheck),
	// which knows the kind; this text match is only the fallback.
	return members.some(
		(member) => member === value && !STRUCTURAL_MEMBER.test(member),
	);
}

// `unknown` here and below: zod schemas are read structurally (this script
// doesn't import zod), and example values are any yaml value.
type ZodLike = {
	safeParse: (value: unknown) => {
		success: boolean;
		error?: { issues?: { code?: string; message?: string }[] };
	};
};

function isZodLike(value: unknown): value is ZodLike {
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof (value as { safeParse?: unknown }).safeParse === 'function'
	);
}

/**
 * The field schemas of an object input, looking through the wrappers an input
 * may sit in (optional, default, pipe, lazy). Undefined when the input is not
 * an object schema.
 */
export function zodObjectFields(
	schema: unknown,
): Record<string, ZodLike> | undefined {
	let current: unknown = schema;
	for (let depth = 0; depth < 8 && isZodLike(current); depth++) {
		const node = current as {
			shape?: unknown;
			_def?: Record<string, unknown>;
			def?: Record<string, unknown>;
		};
		const def = node._def ?? node.def ?? {};
		const shape =
			node.shape ??
			(typeof def.shape === 'function'
				? (def.shape as () => unknown)()
				: def.shape);
		if (shape && typeof shape === 'object') {
			return shape as Record<string, ZodLike>;
		}
		current =
			def.innerType ??
			def.in ??
			def.schema ??
			(typeof def.getter === 'function'
				? (def.getter as () => unknown)()
				: undefined);
	}
	return undefined;
}

// zod issue codes that mean the value is the wrong kind, not merely a
// placeholder that breaks a length, format or range rule.
const KIND_ISSUES = new Set([
	'invalid_type',
	'invalid_value',
	'invalid_enum_value',
	'invalid_literal',
	'invalid_union',
]);

/**
 * Checks one example arg against the field's real schema, which knows whether
 * an enum member is the string '1' or the number 1. Only kind problems count
 * (wrong type, not an enum or literal member): docs examples use placeholders
 * such as "<130-132 character signature>" that a length or format rule would
 * reject. Returns the first such issue, or undefined.
 */
export function fieldSchemaCheck(
	field: ZodLike,
	value: unknown,
): string | undefined {
	const result = field.safeParse(value);
	if (result.success) return undefined;
	const issue = result.error?.issues?.find(
		(candidate) =>
			candidate.code !== undefined && KIND_ISSUES.has(candidate.code),
	);
	return issue ? (issue.message ?? 'rejected by its schema') : undefined;
}
