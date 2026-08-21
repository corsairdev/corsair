import type { PermissionConstraint, PermissionPolicy } from '../plugins';

// ─────────────────────────────────────────────────────────────────────────────
// Argument Constraints
//
// Endpoint-level policies answer "may the agent call messages.post at all?".
// Constraints narrow that to "may the agent call it with *these* arguments?" —
// posting to #general without approval while an external DM still escalates.
//
// Constraints are authored by the developer in the corsair config; the values
// they test come from the agent. Nothing here compiles or evaluates
// agent-supplied strings — a constraint can only ever read an argument and
// compare it.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Reads a dot-notation path out of an endpoint's argument object.
 *
 * Only own properties are traversed: an inherited member such as `toString`
 * is not an argument the agent passed, and letting a path resolve to one would
 * mean a constraint judged something other than the actual call.
 *
 * Returns undefined if any segment is missing, so a constraint on an absent
 * field fails closed rather than matching by accident.
 */
export function resolveArgPath(args: unknown, path: string): unknown {
	let current = args;
	for (const segment of path.split('.')) {
		if (current === null || typeof current !== 'object') return undefined;
		if (!Object.hasOwn(current, segment)) return undefined;
		current = (current as Record<string, unknown>)[segment];
	}
	return current;
}

/**
 * Compares two constraint operands. Non-primitives compare structurally.
 *
 * Deliberately not JSON.stringify: serialized comparison makes equality depend
 * on key insertion order, so `{a,b}` and `{b,a}` read as different values. For
 * `notIn` that inverts into a bypass — a reordered object is "not in the
 * denylist" — and it throws outright on a circular argument.
 */
function sameValue(a: unknown, b: unknown): boolean {
	return deepEqual(a, b, new Set());
}

/**
 * Returns true only for plain objects (including null-prototype objects).
 * Exotic built-ins (RegExp, Map, Set, Promise, Error) and class instances
 * have type-specific semantics that never match their enumerable own keys,
 * so comparing them structurally would equate distinct instances.
 */
function isPlainObject(v: unknown): boolean {
	if (typeof v !== 'object' || v === null) return false;
	const proto = Object.getPrototypeOf(v);
	return proto === null || proto === Object.prototype;
}

/**
 * Stable numeric identity for tracked objects. Used by the cycle guard to
 * produce a combined key for each visited (a, b) pair, ensuring that two
 * structurally distinct cyclic graphs with the same b reference are not
 * conflated.
 */
const objectIds = new WeakMap<object, number>();
let nextObjectId = 0;

function objectId(v: object): number {
	let id = objectIds.get(v);
	if (id === undefined) {
		id = nextObjectId++;
		objectIds.set(v, id);
	}
	return id;
}

/** Combined key for an (a, b) pair being compared. */
function pairKey(a: unknown, b: unknown): string {
	return `${objectId(a as object)}:${objectId(b as object)}`;
}

/**
 * Set tracks each (a, b) pair currently being compared so that when cycles
 * recur the same pair returns true (isomorphic) while a recurring a paired
 * with a different b returns false (non-isomorphic). Both sides are tracked
 * via the combined key, which prevents a two-node cycle {a1,a2} and a
 * one-node cycle {b} from comparing equal when both map to the same b.
 */
function deepEqual(a: unknown, b: unknown, visited: Set<string>): boolean {
	if (Object.is(a, b)) return true;
	if (a === null || b === null) return false;
	if (typeof a !== 'object' || typeof b !== 'object') return false;

	// Dates were the one exotic type the previous JSON comparison handled
	// meaningfully; keep them comparing by value rather than by identity.
	if (a instanceof Date || b instanceof Date) {
		return (
			a instanceof Date && b instanceof Date && a.getTime() === b.getTime()
		);
	}

	const isArray = Array.isArray(a);
	if (isArray !== Array.isArray(b)) return false;

	// When a pair (a, b) has already been entered, the structure is cyclic
	// and we
	// have already validated (or are in the process of validating) that
	// everything reachable from this pair is equal — return true for
	// isomorphism. Using a combined key ensures that {a1→b, a2→b} are
	// tracked as separate entries, so a recurring (a1, b) does not match
	// if the path went a2→b before returning to a1.
	const key = pairKey(a, b);
	if (visited.has(key)) return true;
	visited.add(key);
	try {
		if (isArray) {
			const left = a as unknown[];
			const right = b as unknown[];
			return (
				left.length === right.length &&
				left.every((v, i) => deepEqual(v, right[i], visited))
			);
		}
		// Both values must be plain objects (or null-prototype) for
		// enumerable-key comparison. Exotic built-ins (RegExp, Map, Set)
		// and class instances have type-specific semantics that have no
		// representation through enumerable own keys, so Object.is returning
		// false means they are definitely not equal.
		if (!isPlainObject(a) || !isPlainObject(b)) return false;
		const left = a as Record<string, unknown>;
		const right = b as Record<string, unknown>;
		const keys = Object.keys(left);
		if (keys.length !== Object.keys(right).length) return false;
		return keys.every(
			(k) => Object.hasOwn(right, k) && deepEqual(left[k], right[k], visited),
		);
	} finally {
		// Removed on the way out so a value legitimately repeated in two
		// branches is compared each time rather than short-circuiting to true.
		visited.delete(key);
	}
}

/** The operators a constraint may carry. Anything else is not a constraint. */
const OPERATORS = ['match', 'equals', 'in', 'notIn'] as const;

type Operator = (typeof OPERATORS)[number];

/**
 * Extracts the single operator from a constraint.
 *
 * Requires exactly one own key, and that key to be a supported operator.
 * Anything else is null: zero recognized keys means the shape is unrecognized,
 * and any extra key — a second operator or a misspelled one — is ambiguous.
 *
 * The misspelling is the case that matters. `{ match: '.*', notin: [...] }`
 * would otherwise enforce only `match`, silently discarding the denylist the
 * developer meant to apply and allowing exactly what they tried to block.
 */
function soleOperator(
	constraint: PermissionConstraint,
): { op: Operator; operand: unknown } | null {
	if (constraint === null || typeof constraint !== 'object') return null;
	// ownKeys rather than hasOwn per operator, so an unrecognized key is seen
	// rather than skipped over. Symbol keys are never operators.
	const keys = Reflect.ownKeys(constraint);
	const [key] = keys;
	if (keys.length !== 1 || typeof key !== 'string') return null;
	if (!OPERATORS.includes(key as Operator)) return null;
	const op = key as Operator;
	return { op, operand: (constraint as Record<string, unknown>)[op] };
}

/**
 * Evaluates one constraint against one resolved argument value.
 *
 * Everything unusable returns false — an absent argument, a malformed or
 * ambiguous constraint, an operand of the wrong type. An unenforceable rule must
 * never read as satisfied, because a satisfied constraint applies the
 * (typically looser) configured policy.
 */
export function matchesConstraint(
	value: unknown,
	constraint: PermissionConstraint,
): boolean {
	// An unresolved path and an explicitly-undefined argument are
	// indistinguishable here, and neither should grant access.
	if (value === undefined) return false;

	const parsed = soleOperator(constraint);
	if (parsed === null) return false;
	const { op, operand } = parsed;

	if (op === 'match') {
		// Only a string pattern may test a string value.
		if (typeof operand !== 'string' || typeof value !== 'string') return false;
		try {
			return new RegExp(operand).test(value);
		} catch {
			// An invalid pattern is a config bug. Fail closed rather than
			// silently widening what the agent is allowed to do.
			return false;
		}
	}
	if (op === 'equals') return sameValue(value, operand);
	// A non-array operand would throw on .some(); reject it as malformed so a
	// config mistake cannot surface as an exception mid-call. `notIn` fails
	// closed here too — an unusable denylist must not read as "not denied".
	if (!Array.isArray(operand)) return false;
	if (op === 'in') return operand.some((c) => sameValue(value, c));
	return !operand.some((c) => sameValue(value, c));
}

/**
 * True only when every constraint holds. An empty constraint map is treated as
 * unsatisfied: it is almost certainly a config mistake, and reading it as
 * "matches everything" would silently apply the constrained policy to every call.
 */
export function constraintsSatisfied(
	constraints: Record<string, PermissionConstraint>,
	args: unknown,
): boolean {
	if (constraints === null || typeof constraints !== 'object') return false;
	const entries = Object.entries(constraints);
	if (entries.length === 0) return false;
	return entries.every(([path, constraint]) =>
		matchesConstraint(resolveArgPath(args, path), constraint),
	);
}

/** Narrows a possibly-constrained override to a concrete policy, or undefined. */
export function resolveOverridePolicy(
	override:
		| PermissionPolicy
		| {
				policy: PermissionPolicy;
				constraints: Record<string, PermissionConstraint>;
				otherwise?: PermissionPolicy;
		  }
		| undefined,
	args: unknown,
): PermissionPolicy | undefined {
	if (override === undefined || override === null) return undefined;
	if (typeof override === 'string') return override;
	if (constraintsSatisfied(override.constraints, args)) return override.policy;
	// Constraints did not hold. `otherwise` if the developer specified one,
	// else undefined so the caller falls back to the mode matrix.
	return override.otherwise;
}
