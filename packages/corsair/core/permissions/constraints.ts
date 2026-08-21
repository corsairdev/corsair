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
 * Returns undefined if any segment is missing, so a constraint on an absent
 * field fails closed rather than matching by accident.
 */
export function resolveArgPath(args: unknown, path: string): unknown {
	let current = args;
	for (const segment of path.split('.')) {
		if (current === null || typeof current !== 'object') return undefined;
		current = (current as Record<string, unknown>)[segment];
	}
	return current;
}

/** Compares two constraint operands. Non-primitives compare structurally. */
function sameValue(a: unknown, b: unknown): boolean {
	if (Object.is(a, b)) return true;
	if (
		a !== null &&
		b !== null &&
		typeof a === 'object' &&
		typeof b === 'object'
	) {
		return JSON.stringify(a) === JSON.stringify(b);
	}
	return false;
}

/**
 * Evaluates one constraint against one resolved argument value.
 * An unrecognized constraint shape returns false — an unenforceable rule must
 * never read as satisfied.
 */
export function matchesConstraint(
	value: unknown,
	constraint: PermissionConstraint,
): boolean {
	if ('match' in constraint) {
		// Only strings can match a pattern; a number or object never does.
		if (typeof value !== 'string') return false;
		try {
			return new RegExp(constraint.match).test(value);
		} catch {
			// An invalid pattern is a config bug. Fail closed rather than
			// silently widening what the agent is allowed to do.
			return false;
		}
	}
	if ('equals' in constraint) return sameValue(value, constraint.equals);
	if ('in' in constraint) return constraint.in.some((c) => sameValue(value, c));
	if ('notIn' in constraint) {
		return !constraint.notIn.some((c) => sameValue(value, c));
	}
	return false;
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
	if (override === undefined) return undefined;
	if (typeof override === 'string') return override;
	if (constraintsSatisfied(override.constraints, args)) return override.policy;
	// Constraints did not hold. `otherwise` if the developer specified one,
	// else undefined so the caller falls back to the mode matrix.
	return override.otherwise;
}
