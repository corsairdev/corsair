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
 * True for any non-null value, narrowing it to a string-keyed record view.
 *
 * Unknown is justified here rather than a concrete type: these functions sit on
 * the untrusted-config boundary where values arrive from JSON.parse output or
 * unchecked JavaScript, so the static annotation cannot be trusted. The
 * predicate itself is sound — every non-null object supports string-keyed
 * access yielding unknown; indexing may yield undefined, which unknown admits.
 */
function isRecord(v: unknown): v is Record<string, unknown> {
	return typeof v === 'object' && v !== null;
}

/** True when the value is an array, narrowed so elements read as unknown. */
function isUnknownArray(v: unknown): v is readonly unknown[] {
	return Array.isArray(v);
}

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
	let current: unknown = args;
	for (const segment of path.split('.')) {
		if (!isRecord(current)) return undefined;
		if (!Object.hasOwn(current, segment)) return undefined;
		current = current[segment];
	}
	return current;
}

/**
 * Returns true only for plain objects (including null-prototype objects),
 * narrowing the value to a record view for enumerable-key comparison.
 * Exotic built-ins (RegExp, Map, Set, Promise, Error) and class instances
 * have type-specific semantics that never match their enumerable own keys,
 * so comparing them structurally would equate distinct instances.
 */
function isPlainObject(v: unknown): v is Record<string, unknown> {
	if (!isRecord(v)) return false;
	const proto: unknown = Object.getPrototypeOf(v);
	return proto === null || proto === Object.prototype;
}

/**
 * Structural comparison for constraint operands.
 *
 * Deliberately not JSON.stringify: serialized comparison makes equality depend
 * on key insertion order, so `{a,b}` and `{b,a}` read as different values. For
 * `notIn` that inverts into a bypass — a reordered object is "not in the
 * denylist" — and it throws outright on a circular argument.
 *
 * Both operands are guaranteed acyclic by matchesConstraint, which rejects any
 * cyclic structure before comparing (see containsCycle). Comparing cyclic
 * graphs correctly requires graph isomorphism, not value equality — and every
 * "close enough" guard on cyclic input has proven to have a non-isomorphic
 * counterexample. JSON cannot express cycles, so legitimate config operands and
 * MCP/HTTP arguments are always acyclic and never reach that path.
 */
function deepEqual(a: unknown, b: unknown): boolean {
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

	// An array and a non-array are never the same value.
	if (isUnknownArray(a) !== isUnknownArray(b)) return false;

	if (isUnknownArray(a) && isUnknownArray(b)) {
		return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
	}
	// Both values must be plain objects (or null-prototype) for
	// enumerable-key comparison. Exotic built-ins (RegExp, Map, Set)
	// and class instances have type-specific semantics that have no
	// representation through enumerable own keys, so Object.is returning
	// false means they are definitely not equal.
	if (!isPlainObject(a) || !isPlainObject(b)) return false;
	const keys = Object.keys(a);
	if (keys.length !== Object.keys(b).length) return false;
	return keys.every((k) => Object.hasOwn(b, k) && deepEqual(a[k], b[k]));
}

/**
 * Detects a reference cycle reachable through a value's own enumerable string
 * keys — exactly the keys deepEqual traverses.
 *
 * Path-based rather than global: a node counts as cyclic only when it appears
 * twice on the *current* path, so a value legitimately shared across branches
 * (`{p: shared, q: shared}`) is not a cycle and still compares by value.
 */
function containsCycle(root: unknown): boolean {
	if (!isRecord(root)) return false;
	const path = new Set<object>();
	const visit = (v: unknown): boolean => {
		if (!isRecord(v)) return false;
		if (path.has(v)) return true;
		path.add(v);
		for (const key of Object.keys(v)) {
			if (visit(v[key])) return true;
		}
		path.delete(v);
		return false;
	};
	return visit(root);
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
 *
 * The constraint arrives as unknown because runtime config can violate the
 * compiled PermissionConstraint shape (JSON.parse output, hand-written JS);
 * validation happens here rather than trusting the annotation.
 */
function soleOperator(
	constraint: unknown,
): { op: Operator; operand: unknown } | null {
	if (!isRecord(constraint)) return null;
	// ownKeys rather than hasOwn per operator, so an unrecognized key is seen
	// rather than skipped over. Symbol keys are never operators.
	const keys = Reflect.ownKeys(constraint);
	const [key] = keys;
	if (keys.length !== 1 || typeof key !== 'string') return null;
	const op = OPERATORS.find((candidate) => candidate === key);
	if (op === undefined) return null;
	return { op, operand: constraint[key] };
}

/**
 * Evaluates one constraint against one resolved argument value.
 *
 * The constraint is accepted as unknown for the same reason soleOperator
 * validates at runtime: this is the boundary for config that may have bypassed
 * compile-time types. Everything unusable returns false — an absent argument,
 * a malformed or ambiguous constraint, an operand of the wrong type. An
 * unenforceable rule must never read as satisfied, because a satisfied
 * constraint applies the (typically looser) configured policy.
 */
export function matchesConstraint(
	value: unknown,
	constraint: unknown,
): boolean {
	// An unresolved path and an explicitly-undefined argument are
	// indistinguishable here, and neither should grant access.
	if (value === undefined) return false;

	const parsed = soleOperator(constraint);
	if (parsed === null) return false;
	const { op, operand } = parsed;

	// Cyclic structures fail closed, on either side of the comparison.
	// JSON cannot express cycles, so a cyclic value here can only be a
	// hand-crafted JavaScript object — and correctly comparing cyclic graphs
	// requires graph isomorphism, not value equality. Rather than accept a
	// "close enough" guard with known non-isomorphic counterexamples, the
	// constraint is simply unsatisfied and evaluation falls back to
	// `otherwise` or the mode matrix. This also closes the `notIn` inversion:
	// an uncomparable cyclic value must not read as "not in the denylist".
	if (containsCycle(value) || containsCycle(operand)) return false;

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
	if (op === 'equals') return deepEqual(value, operand);
	// A non-array operand would throw on .some(); reject it as malformed so a
	// config mistake cannot surface as an exception mid-call. `notIn` fails
	// closed here too — an unusable denylist must not read as "not denied".
	if (!isUnknownArray(operand)) return false;
	if (op === 'in') return operand.some((c) => deepEqual(value, c));
	return !operand.some((c) => deepEqual(value, c));
}

/**
 * True only when every constraint holds. The constraint map is accepted as
 * unknown because it reaches this boundary from parsed config; anything that
 * is not a record fails closed. An empty constraint map is treated as
 * unsatisfied: it is almost certainly a config mistake, and reading it as
 * "matches everything" would silently apply the constrained policy to every call.
 */
export function constraintsSatisfied(
	constraints: unknown,
	args: unknown,
): boolean {
	if (!isRecord(constraints)) return false;
	const entries = Object.entries(constraints);
	if (entries.length === 0) return false;
	return entries.every(([path, constraint]) =>
		matchesConstraint(resolveArgPath(args, path), constraint),
	);
}

/** Narrows a possibly-constrained override to a concrete policy, or undefined.
 *
 * Accepts null as well as undefined: overrides reach here from parsed config,
 * where a JSON `null` is possible even though the TypeScript config types make
 * it unlikely. Null fails closed to undefined, same as a missing override.
 */
export function resolveOverridePolicy(
	override:
		| PermissionPolicy
		| {
				policy: PermissionPolicy;
				constraints: Record<string, PermissionConstraint>;
				otherwise?: PermissionPolicy;
		  }
		| null
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
