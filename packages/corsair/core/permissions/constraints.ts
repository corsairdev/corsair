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

function tryRead(
	obj: object,
	key: PropertyKey,
): { ok: true; value: unknown } | { ok: false } {
	try {
		return { ok: true, value: (obj as Record<PropertyKey, unknown>)[key] };
	} catch {
		return { ok: false };
	}
}

function tryOwnValues(obj: object): unknown[] | null {
	try {
		return Object.values(obj);
	} catch {
		return null;
	}
}

function tryOwnEntries(obj: object): [string, unknown][] | null {
	try {
		return Object.entries(obj);
	} catch {
		return null;
	}
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
	try {
		let current: unknown = args;
		for (const segment of path.split('.')) {
			if (!isRecord(current)) return undefined;
			if (!Object.hasOwn(current, segment)) return undefined;
			const read = tryRead(current, segment);
			if (!read.ok) return undefined;
			current = read.value;
		}
		return current;
	} catch {
		return undefined;
	}
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

function isComparableValue(root: unknown): boolean {
	const stack: unknown[] = [root];
	const seen = new WeakSet<object>();
	while (stack.length > 0) {
		const v = stack.pop();
		if (v === null || typeof v !== 'object') continue;
		if (seen.has(v)) continue;
		seen.add(v);
		if (v instanceof Date) continue;
		if (isUnknownArray(v)) {
			for (let i = 0; i < v.length; i++) {
				const item = tryRead(v, i);
				if (!item.ok) return false;
				stack.push(item.value);
			}
			continue;
		}
		if (!isPlainObject(v)) return false;
		const children = tryOwnValues(v);
		if (children === null) return false;
		for (const child of children) stack.push(child);
	}
	return true;
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
 *
 * Iterative with an explicit pair stack rather than recursive: an
 * agent-controlled argument can be nested arbitrarily deep, and a recursive
 * comparator would overflow the call stack on deep acyclic structures.
 */
function deepEqual(a: unknown, b: unknown): boolean {
	if (Object.is(a, b)) return true;
	const compared = new WeakMap<object, WeakSet<object>>();
	const stack: [unknown, unknown][] = [[a, b]];
	while (stack.length > 0) {
		const pair = stack.pop();
		if (pair === undefined) break;
		const [x, y] = pair;
		if (Object.is(x, y)) continue;
		if (x === null || y === null) return false;
		if (typeof x !== 'object' || typeof y !== 'object') return false;

		const partners = compared.get(x);
		if (partners?.has(y)) continue;
		if (partners === undefined) compared.set(x, new WeakSet([y]));
		else partners.add(y);

		// Dates were the one exotic type the previous JSON comparison handled
		// meaningfully; keep them comparing by value rather than by identity.
		if (x instanceof Date || y instanceof Date) {
			if (x instanceof Date && y instanceof Date && x.getTime() === y.getTime())
				continue;
			return false;
		}

		// An array and a non-array are never the same value.
		if (isUnknownArray(x) !== isUnknownArray(y)) return false;
		if (isUnknownArray(x) && isUnknownArray(y)) {
			if (x.length !== y.length) return false;
			for (let i = 0; i < x.length; i++) {
				const xv = tryRead(x, i);
				const yv = tryRead(y, i);
				if (!xv.ok || !yv.ok) return false;
				stack.push([xv.value, yv.value]);
			}
			continue;
		}
		// Both values must be plain objects (or null-prototype) for
		// enumerable-key comparison. Exotic built-ins (RegExp, Map, Set)
		// and class instances have type-specific semantics that have no
		// representation through enumerable own keys, so Object.is returning
		// false means they are definitely not equal.
		if (!isPlainObject(x) || !isPlainObject(y)) return false;
		const keys = Object.keys(x);
		if (keys.length !== Object.keys(y).length) return false;
		if (!keys.every((k) => Object.hasOwn(y, k))) return false;
		for (const key of keys) {
			const xv = tryRead(x, key);
			const yv = tryRead(y, key);
			if (!xv.ok || !yv.ok) return false;
			stack.push([xv.value, yv.value]);
		}
	}
	return true;
}

/**
 * Detects a reference cycle reachable through a value's own enumerable string
 * keys — exactly the keys deepEqual traverses.
 *
 * Path-based rather than global: a node counts as cyclic only when it appears
 * twice on the *current* path, so a value legitimately shared across branches
 * (`{p: shared, q: shared}`) is not a cycle and still compares by value.
 *
 * Iterative with an explicit stack rather than recursive: an agent-controlled
 * argument can be nested arbitrarily deep, and a recursive scan would overflow
 * the call stack on deep acyclic structures before reaching any comparison.
 */
function containsCycle(root: unknown): boolean {
	if (!isRecord(root)) return false;
	const path = new Set<object>();
	const completed = new WeakSet<object>();
	// Each frame is one node plus its remaining child values to traverse.
	// A node enters `path` when its frame is pushed and leaves when the frame
	// is exhausted — the same enter/leave discipline as a recursive DFS.
	const rootValues = tryOwnValues(root);
	if (rootValues === null) return true;
	const stack: [object, unknown[]][] = [[root, rootValues]];
	while (stack.length > 0) {
		const frame = stack[stack.length - 1];
		if (frame === undefined) break;
		const [node, children] = frame;
		// Frame exhaustion is checked by length, not by the popped value: an
		// own enumerable property whose value is `undefined` is a real child,
		// and popping it must not be mistaken for an empty frame — otherwise
		// any cyclic sibling still queued after it would never be visited.
		if (children.length === 0) {
			// Frame exhausted — node leaves the current path. Once completed, its
			// descendants cannot form a cycle with a later branch, so shared DAG
			// nodes need not be traversed again.
			path.delete(node);
			completed.add(node);
			stack.pop();
			continue;
		}
		const child = children.pop();
		if (!isRecord(child) || completed.has(child)) continue;
		if (path.has(child)) return true;
		path.add(child);
		const childValues = tryOwnValues(child);
		if (childValues === null) return true;
		stack.push([child, childValues]);
	}
	return false;
}

/**
 * The operators a constraint may carry. Anything else is not a constraint. */
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
	const operand = tryRead(constraint, key);
	if (!operand.ok) return null;
	return { op, operand: operand.value };
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
	try {
		return matchConstraintInner(value, constraint);
	} catch {
		return false;
	}
}

function matchConstraintInner(value: unknown, constraint: unknown): boolean {
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
	if (!isComparableValue(value) || !isComparableValue(operand)) return false;

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
	try {
		if (!isRecord(constraints)) return false;
		const entries = tryOwnEntries(constraints);
		if (entries === null) return false;
		if (entries.length === 0) return false;
		return entries.every(([path, constraint]) =>
			matchesConstraint(resolveArgPath(args, path), constraint),
		);
	} catch {
		return false;
	}
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
	try {
		if (override === undefined || override === null) return undefined;
		if (typeof override === 'string') return override;
		if (!isRecord(override)) return undefined;
		const constraints = tryRead(override, 'constraints');
		if (!constraints.ok) return undefined;
		if (constraintsSatisfied(constraints.value, args)) {
			const policy = tryRead(override, 'policy');
			if (!policy.ok) return undefined;
			return policy.value as PermissionPolicy;
		}
		const otherwise = tryRead(override, 'otherwise');
		if (!otherwise.ok) return undefined;
		return otherwise.value as PermissionPolicy | undefined;
	} catch {
		return undefined;
	}
}
