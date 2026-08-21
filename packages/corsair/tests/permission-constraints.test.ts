import type { PermissionOverride, PermissionPolicy } from '../core';
import {
	constraintsSatisfied,
	enforcePermission,
	evaluatePermission,
	matchesConstraint,
	resolveArgPath,
	resolveOverridePolicy,
} from '../core/permissions';

/**
 * Wrapper that accepts null so runtime edge cases from unsafe JS/JSON config
 * can be tested without a type assertion. resolveOverridePolicy's parameter
 * type omits null because TypeScript configs are statically checked, but
 * runtime values from external config can be null.
 */
function resolveOverrideNullable(
	value: PermissionOverride | null | undefined,
	args: unknown,
): PermissionPolicy | undefined {
	return resolveOverridePolicy(value, args);
}
describe('resolveArgPath', () => {
	it('reads top-level and nested paths', () => {
		const args = { channel: '#general', message: { to: 'a@corsair.dev' } };
		expect(resolveArgPath(args, 'channel')).toBe('#general');
		expect(resolveArgPath(args, 'message.to')).toBe('a@corsair.dev');
	});

	it('returns undefined for missing or non-object segments', () => {
		expect(resolveArgPath({ a: 1 }, 'b')).toBeUndefined();
		expect(resolveArgPath({ a: 1 }, 'a.b')).toBeUndefined();
		expect(resolveArgPath(null, 'a')).toBeUndefined();
		expect(resolveArgPath(undefined, 'a')).toBeUndefined();
	});
});

describe('matchesConstraint', () => {
	it('matches a regex against strings only', () => {
		expect(
			matchesConstraint('#general', { match: '^#(general|alerts)$' }),
		).toBe(true);
		expect(matchesConstraint('#random', { match: '^#(general|alerts)$' })).toBe(
			false,
		);
		// A non-string can never satisfy a pattern, even a permissive one.
		expect(matchesConstraint(42, { match: '.*' })).toBe(false);
		expect(matchesConstraint(undefined, { match: '.*' })).toBe(false);
	});

	it('fails closed on an invalid regex rather than throwing', () => {
		expect(() => matchesConstraint('x', { match: '([' })).not.toThrow();
		expect(matchesConstraint('x', { match: '([' })).toBe(false);
	});

	it('supports equals, in, and notIn', () => {
		expect(matchesConstraint('a', { equals: 'a' })).toBe(true);
		expect(matchesConstraint('a', { equals: 'b' })).toBe(false);
		expect(matchesConstraint('a', { in: ['a', 'b'] })).toBe(true);
		expect(matchesConstraint('c', { in: ['a', 'b'] })).toBe(false);
		expect(matchesConstraint('c', { notIn: ['a', 'b'] })).toBe(true);
		expect(matchesConstraint('a', { notIn: ['a', 'b'] })).toBe(false);
	});

	it('compares non-primitive operands structurally', () => {
		expect(matchesConstraint({ a: 1 }, { equals: { a: 1 } })).toBe(true);
		expect(matchesConstraint({ a: 1 }, { equals: { a: 2 } })).toBe(false);
	});

	it('compares objects structurally, independent of key order', () => {
		expect(matchesConstraint({ b: 2, a: 1 }, { equals: { a: 1, b: 2 } })).toBe(
			true,
		);
		expect(
			matchesConstraint(
				{ outer: { b: 2, a: 1 } },
				{ equals: { outer: { a: 1, b: 2 } } },
			),
		).toBe(true);
		expect(matchesConstraint({ a: 1 }, { equals: { a: 1, b: 2 } })).toBe(false);
	});

	it('keeps array comparison order-sensitive', () => {
		// Key order is not meaningful; element order is.
		expect(matchesConstraint([1, 2], { equals: [1, 2] })).toBe(true);
		expect(matchesConstraint([2, 1], { equals: [1, 2] })).toBe(false);
		expect(matchesConstraint([1], { equals: [1, 2] })).toBe(false);
		// An array and an object are never the same value.
		expect(matchesConstraint([], { equals: {} })).toBe(false);
	});

	it('compares dates by value', () => {
		expect(matchesConstraint(new Date(1000), { equals: new Date(1000) })).toBe(
			true,
		);
		expect(matchesConstraint(new Date(1000), { equals: new Date(2000) })).toBe(
			false,
		);
	});

	it('handles a circular argument without throwing', () => {
		const circular: Record<string, unknown> = { x: 1 };
		circular.self = circular;

		expect(() =>
			matchesConstraint(circular, { equals: { x: 1 } }),
		).not.toThrow();
		expect(matchesConstraint(circular, { equals: { x: 1 } })).toBe(false);
	});

	it('does not equate cyclic values that are not isomorphic', () => {
		// The cycle guard must pair a with b: `circular.self` is circular (one key)
		// while the other side's `self` is empty, so these are not equal.
		const circular: Record<string, unknown> = {};
		circular.self = circular;

		expect(matchesConstraint(circular, { equals: { self: {} } })).toBe(false);

		// Two genuinely isomorphic cyclic values still compare equal.
		const x: Record<string, unknown> = { k: 1 };
		x.self = x;
		const y: Record<string, unknown> = { k: 1 };
		y.self = y;
		expect(matchesConstraint(x, { equals: y })).toBe(true);
	});

	it('does not treat a value repeated in two branches as equal', () => {
		// The cycle guard must not short-circuit a legitimately shared subobject.
		const shared = { k: 1 };
		expect(
			matchesConstraint(
				{ p: shared, q: shared },
				{ equals: { p: { k: 1 }, q: { k: 2 } } },
			),
		).toBe(false);
	});

	it('rejects an unrecognized constraint shape', () => {
		// An unenforceable rule must never read as satisfied.
		expect(matchesConstraint('anything', { nope: true } as never)).toBe(false);
	});
});

describe('matchesConstraint — exotic objects are not structurally equal', () => {
	it('does not equate two different RegExp instances', () => {
		// RegExp has no enumerable own properties, so Object.keys returns [].
		// Without a plain-object guard, deepEqual would compare them as equal
		// even when they are different patterns or flags.
		const patternA = /foo/;
		const patternB = /bar/;
		// Different source → not equal
		expect(matchesConstraint(patternA, { equals: patternB })).toBe(false);
		// Same source and flags → still different instances, not equal
		expect(matchesConstraint(/foo/gi, { equals: /foo/gi })).toBe(false);
	});

	it('does not equate two class instances with no enumerable keys', () => {
		// eslint-disable-next-line @typescript-eslint/no-extraneous-class -- test helper
		class Empty {}
		const a = new Empty();
		const b = new Empty();
		// Same constructor, same empty shape — but exotic objects are never
		// structurally equal by enumerable keys.
		expect(matchesConstraint(a, { equals: b })).toBe(false);
	});

	it('does not equate a Map and a plain object', () => {
		const map = new Map([['k', 1]]);
		const obj = { k: 1 };
		// A Map's entries are not own enumerable properties, so enumerable-key
		// comparison would wrongly find them equal.
		expect(matchesConstraint(map, { equals: obj })).toBe(false);
		expect(matchesConstraint(obj, { equals: map })).toBe(false);
	});

	it('does not conflate a two-node cycle with a one-node cycle', () => {
		// Regression: the cycle guard must use a combined key for each (a, b) pair.
		// When a two-node graph {a1↔a2} is compared against a one-node graph {b↔b}, both
		// a1 and a2 map to the same b, which would trigger a false cycle return.
		const a1: Record<string, unknown> = {};
		const a2: Record<string, unknown> = {};
		a1.x = a2;
		a2.y = a1;

		const b: Record<string, unknown> = {};
		b.x = b;
		b.y = b;

		// Different cycle topologies — not equal
		expect(matchesConstraint(a1, { equals: b })).toBe(false);
	});

	it('does not conflate a two-node cycle with a one-node cycle (same key)', () => {
		// Exact Greptile counterexample: both sides have only key "x",
		// so the key-count check passes. The cycle guard must detect that
		// (a1, b) is revisited at a different structural depth.
		const a1: Record<string, unknown> = {};
		const a2: Record<string, unknown> = {};
		a1.x = a2;
		a2.x = a1;

		const b: Record<string, unknown> = {};
		b.x = b;

		// Different cycle topologies via same key — not equal
		expect(matchesConstraint(a1, { equals: b })).toBe(false);
	});

	it('does not treat structurally equal values with shared references as different', () => {
		// Two aliased empty objects in an array should still compare equal
		// to two separate empty objects (value equality, not reference).
		const shared = {};
		expect(matchesConstraint([shared, shared], { equals: [{}, {}] })).toBe(
			true,
		);
	});
});

describe('matchesConstraint — fails closed on unusable rules', () => {
	it('rejects an absent argument under every operator, notIn included', () => {
		// notIn is the trap: "undefined is not in the denylist" reads as satisfied,
		// which would apply the (looser) configured policy to a call that simply
		// omitted the field.
		expect(matchesConstraint(undefined, { notIn: ['bad@example.com'] })).toBe(
			false,
		);
		expect(matchesConstraint(undefined, { in: ['a'] })).toBe(false);
		expect(matchesConstraint(undefined, { equals: 'a' })).toBe(false);
		expect(matchesConstraint(undefined, { match: '.*' })).toBe(false);
	});

	it('rejects a valid operator accompanied by an unknown key', () => {
		// Inert-looking, but not inert: a misspelled operator is silently dropped,
		// so the developer's intended condition never gates the call.
		expect(
			matchesConstraint('abc', {
				match: '^abc$',
				caseInsensitive: true,
			} as never),
		).toBe(false);
		expect(
			matchesConstraint('bad@evil.com', {
				match: '.*',
				notin: ['bad@evil.com'],
			} as never),
		).toBe(false);
	});

	it('rejects a symbol-keyed constraint', () => {
		expect(matchesConstraint('abc', { [Symbol('match')]: '.*' } as never)).toBe(
			false,
		);
	});

	it('rejects a constraint carrying more than one operator', () => {
		// Honouring whichever we checked first would leave the developer believing
		// both were enforced.
		expect(
			matchesConstraint('abc', { match: '^abc$', equals: 'ZZZ' } as never),
		).toBe(false);
	});

	it('rejects operands of the wrong type instead of throwing', () => {
		expect(() => matchesConstraint('a', { in: 'nope' } as never)).not.toThrow();
		expect(matchesConstraint('a', { in: 'nope' } as never)).toBe(false);
		expect(matchesConstraint('a', { notIn: 'nope' } as never)).toBe(false);
		// A number operand would silently become the pattern /123/.
		expect(matchesConstraint('123', { match: 123 } as never)).toBe(false);
	});
});

describe('resolveArgPath — own properties only', () => {
	it('does not resolve inherited members', () => {
		// `toString` exists on every object; treating it as an argument would let a
		// constraint judge something the agent never passed.
		expect(resolveArgPath({}, 'toString')).toBeUndefined();
		expect(resolveArgPath({}, 'constructor')).toBeUndefined();
		expect(resolveArgPath({}, 'constructor.name')).toBeUndefined();
		expect(resolveArgPath({}, '__proto__')).toBeUndefined();
	});

	it('still resolves own properties, including array indices', () => {
		expect(resolveArgPath({ a: { b: 1 } }, 'a.b')).toBe(1);
		expect(resolveArgPath({ list: ['x'] }, 'list.0')).toBe('x');
		// An own property that shadows an inherited name still resolves.
		expect(resolveArgPath({ toString: 'mine' }, 'toString')).toBe('mine');
	});
});

describe('constraintsSatisfied', () => {
	const args = { channel: '#general', to: 'sarah@corsair.dev' };

	it('requires every constraint to hold', () => {
		expect(
			constraintsSatisfied({ channel: { equals: '#general' } }, args),
		).toBe(true);
		expect(
			constraintsSatisfied(
				{ channel: { equals: '#general' }, to: { match: '@corsair\\.dev$' } },
				args,
			),
		).toBe(true);
		expect(
			constraintsSatisfied(
				{ channel: { equals: '#general' }, to: { match: '@other\\.com$' } },
				args,
			),
		).toBe(false);
	});

	it('treats an empty constraint map as unsatisfied', () => {
		// Reading {} as "matches everything" would silently apply the constrained
		// policy to every call — the opposite of what an empty rule implies.
		expect(constraintsSatisfied({}, args)).toBe(false);
	});
});

describe('resolveOverridePolicy', () => {
	it('passes a flat policy through unchanged', () => {
		expect(resolveOverridePolicy('deny', {})).toBe('deny');
		expect(resolveOverridePolicy(undefined, {})).toBeUndefined();
		expect(resolveOverrideNullable(null, {})).toBeUndefined();
	});

	it('applies the policy when constraints hold', () => {
		const override: PermissionOverride = {
			policy: 'allow',
			constraints: { channel: { match: '^#general$' } },
		};
		expect(resolveOverridePolicy(override, { channel: '#general' })).toBe(
			'allow',
		);
	});

	it('falls through to the mode matrix when constraints fail', () => {
		const override: PermissionOverride = {
			policy: 'allow',
			constraints: { channel: { match: '^#general$' } },
		};
		expect(
			resolveOverridePolicy(override, { channel: '#secret' }),
		).toBeUndefined();
	});

	it('uses `otherwise` when given and constraints fail', () => {
		const override: PermissionOverride = {
			policy: 'allow',
			constraints: { channel: { match: '^#general$' } },
			otherwise: 'deny',
		};
		expect(resolveOverridePolicy(override, { channel: '#secret' })).toBe(
			'deny',
		);
	});
});

describe('evaluatePermission with constraints', () => {
	// The issue's motivating case: under strict mode a write normally escalates
	// to approval; posting to an allowlisted channel should run immediately.
	const postToGeneral: PermissionOverride = {
		policy: 'allow',
		constraints: { channel: { match: '^#(general|alerts)$' } },
	};

	it('allows the constrained call and escalates everything else', () => {
		expect(
			evaluatePermission('write', 'strict', postToGeneral, {
				channel: '#general',
			}),
		).toBe('allow');
		expect(
			evaluatePermission('write', 'strict', postToGeneral, {
				channel: '#exec-private',
			}),
		).toBe('require_approval');
	});

	it('is unchanged for flat overrides and for no override', () => {
		expect(evaluatePermission('write', 'strict', 'deny', {})).toBe('deny');
		expect(evaluatePermission('write', 'strict', undefined, {})).toBe(
			'require_approval',
		);
		expect(evaluatePermission('read', 'readonly', undefined, {})).toBe('allow');
		expect(evaluatePermission('destructive', 'cautious', undefined, {})).toBe(
			'require_approval',
		);
	});

	it('does not let a constrained override loosen a call with missing args', () => {
		// No `channel` in args — the constraint cannot hold, so strict mode applies.
		expect(evaluatePermission('write', 'strict', postToGeneral, {})).toBe(
			'require_approval',
		);
		expect(
			evaluatePermission('write', 'strict', postToGeneral, undefined),
		).toBe('require_approval');
	});

	it('can tighten as well as loosen', () => {
		const denyExternal: PermissionOverride = {
			policy: 'deny',
			constraints: { to: { notIn: ['sarah@corsair.dev'] } },
		};
		expect(
			evaluatePermission('write', 'cautious', denyExternal, {
				to: 'stranger@example.com',
			}),
		).toBe('deny');
		// Recipient is allowlisted, so cautious-mode default applies.
		expect(
			evaluatePermission('write', 'cautious', denyExternal, {
				to: 'sarah@corsair.dev',
			}),
		).toBe('allow');
	});
});

describe('enforcePermission honours argument constraints', () => {
	beforeEach(() => {
		jest.spyOn(console, 'log').mockImplementation(() => undefined);
	});
	afterEach(() => jest.restoreAllMocks());

	const override: PermissionOverride = {
		policy: 'allow',
		constraints: { channel: { match: '^#(general|alerts)$' } },
	};

	it('lets an allowlisted channel through without an approval record', async () => {
		const res = await enforcePermission({
			pluginId: 'slack',
			endpointPath: 'messages.post',
			args: { channel: '#general', text: 'deploy done' },
			mode: 'strict',
			override,
			riskLevel: 'write',
		});

		expect(res).toEqual({ result: 'allow' });
	});

	it('blocks a non-matching channel under strict mode', async () => {
		const res = await enforcePermission({
			pluginId: 'slack',
			endpointPath: 'messages.post',
			args: { channel: '#exec-private', text: 'deploy done' },
			mode: 'strict',
			override,
			riskLevel: 'write',
		});

		// strict + write resolves to require_approval; with no database configured
		// enforcePermission falls back to a policy block rather than a pending row.
		expect(res.result).toBe('blocked');
		expect(res.reason).toBe('policy');
	});
});

describe('constraints cannot be bypassed by omitting the argument', () => {
	it('does not allow a notIn-guarded call when the agent omits the field', () => {
		// Regression: `notIn` previously read as satisfied for a missing path, so
		// dropping `to` from the arguments turned an allowlist into an open door.
		const override: PermissionOverride = {
			policy: 'allow',
			constraints: { to: { notIn: ['external@evil.com'] } },
		};

		expect(evaluatePermission('write', 'strict', override, {})).toBe(
			'require_approval',
		);
		expect(
			evaluatePermission('write', 'strict', override, {
				to: 'sarah@corsair.dev',
			}),
		).toBe('allow');
	});
});

describe('a misspelled operator cannot silently drop a denylist', () => {
	it('does not allow a call the dropped condition was meant to block', () => {
		// Regression: `notin` (lowercase i) was ignored, leaving `match: '.*'` to
		// satisfy the constraint and allow exactly the address it denied.
		const override = {
			policy: 'allow',
			constraints: { to: { match: '.*', notin: ['bad@evil.com'] } },
		} as unknown as PermissionOverride;

		expect(
			evaluatePermission('write', 'strict', override, { to: 'bad@evil.com' }),
		).toBe('require_approval');
	});
});

describe('reordering object keys cannot bypass a denylist', () => {
	it('still denies a structurally equal argument written in another key order', () => {
		// Regression: serialized comparison made {b,a} differ from {a,b}, so a
		// reordered payload read as "not in the denylist" and was allowed.
		const override: PermissionOverride = {
			policy: 'allow',
			constraints: { payload: { notIn: [{ a: 1, b: 2 }] } },
		};

		expect(
			evaluatePermission('write', 'strict', override, {
				payload: { b: 2, a: 1 },
			}),
		).toBe('require_approval');
		// A genuinely different payload is still allowed.
		expect(
			evaluatePermission('write', 'strict', override, {
				payload: { a: 9, b: 9 },
			}),
		).toBe('allow');
	});
});

describe('a cyclic argument cannot satisfy a non-matching constraint', () => {
	it('does not apply an allow override to a structurally different cyclic value', () => {
		// Regression: the cycle guard tracked only the left-hand object, so any
		// repeat returned true and a circular argument matched anything.
		const circular: Record<string, unknown> = {};
		circular.self = circular;

		expect(
			evaluatePermission(
				'write',
				'strict',
				{ policy: 'allow', constraints: { p: { equals: { self: {} } } } },
				{ p: circular },
			),
		).toBe('require_approval');
	});
});
