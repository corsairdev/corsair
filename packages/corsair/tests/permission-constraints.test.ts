import type { PermissionOverride } from '../core';
import {
	constraintsSatisfied,
	enforcePermission,
	evaluatePermission,
	matchesConstraint,
	resolveArgPath,
	resolveOverridePolicy,
} from '../core/permissions';

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

		// Even genuinely isomorphic cyclic values fail closed: comparing cyclic
		// graphs correctly requires graph isomorphism, and JSON cannot express
		// cycles, so no legitimate config or MCP argument is ever cyclic.
		const x: Record<string, unknown> = { k: 1 };
		x.self = x;
		const y: Record<string, unknown> = { k: 1 };
		y.self = y;
		expect(matchesConstraint(x, { equals: y })).toBe(false);
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
		expect(matchesConstraint('anything', { nope: true })).toBe(false);
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

describe('matchesConstraint — exotic values fail closed under notIn', () => {
	it('does not treat a boxed string as absent from a string denylist', () => {
		expect(
			matchesConstraint(new String('evil@x.com'), { notIn: ['evil@x.com'] }),
		).toBe(false);
		expect(
			matchesConstraint(new String('evil@x.com'), { in: ['evil@x.com'] }),
		).toBe(false);
	});

	it('does not treat a Map as absent from an object denylist', () => {
		expect(matchesConstraint(new Map([['k', 1]]), { notIn: [{ k: 1 }] })).toBe(
			false,
		);
		expect(matchesConstraint({ k: 1 }, { notIn: [new Map([['k', 1]])] })).toBe(
			false,
		);
	});

	it('does not treat a Set as absent from an array denylist', () => {
		expect(matchesConstraint(new Set([1]), { notIn: [[1]] })).toBe(false);
	});

	it('does not apply an allow override when notIn cannot compare the argument', () => {
		expect(
			evaluatePermission(
				'write',
				'strict',
				{ policy: 'allow', constraints: { to: { notIn: ['evil@x.com'] } } },
				{ to: new String('evil@x.com') },
			),
		).toBe('require_approval');
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
		// so the developer's intended condition never gates the call. The
		// malformed shapes below cannot be expressed with PermissionConstraint's
		// union — that is the point: they come from JSON/JS config that bypassed
		// the types, which is why matchesConstraint validates at runtime.
		expect(
			matchesConstraint('abc', {
				match: '^abc$',
				caseInsensitive: true,
			}),
		).toBe(false);
		expect(
			matchesConstraint('bad@evil.com', {
				match: '.*',
				notin: ['bad@evil.com'],
			}),
		).toBe(false);
	});

	it('rejects a symbol-keyed constraint', () => {
		expect(matchesConstraint('abc', { [Symbol('match')]: '.*' })).toBe(false);
	});

	it('rejects a constraint carrying more than one operator', () => {
		// Honouring whichever we checked first would leave the developer believing
		// both were enforced.
		expect(matchesConstraint('abc', { match: '^abc$', equals: 'ZZZ' })).toBe(
			false,
		);
	});

	it('rejects operands of the wrong type instead of throwing', () => {
		expect(() => matchesConstraint('a', { in: 'nope' })).not.toThrow();
		expect(matchesConstraint('a', { in: 'nope' })).toBe(false);
		expect(matchesConstraint('a', { notIn: 'nope' })).toBe(false);
		// A number operand would silently become the pattern /123/.
		expect(matchesConstraint('123', { match: 123 })).toBe(false);
	});

	it('rejects constraints that are not objects at all', () => {
		// Runtime values from JSON or unchecked JS can be anything.
		expect(matchesConstraint('a', null)).toBe(false);
		expect(matchesConstraint('a', undefined)).toBe(false);
		expect(matchesConstraint('a', 'match')).toBe(false);
		expect(matchesConstraint('a', 42)).toBe(false);
		expect(matchesConstraint('a', ['match'])).toBe(false);
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
		expect(resolveOverridePolicy(null, {})).toBeUndefined();
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
	it('fails the constraint when a typo key accompanies the real operator', () => {
		// Regression: `notin` (lowercase i) was ignored, leaving `match: '.*'` to
		// satisfy the constraint and allow exactly the address it denied.
		//
		// The malformed rule is built as a plain record because the misspelling
		// is precisely the shape PermissionConstraint's union forbids at compile
		// time — this mistake only arises from config that bypassed the types,
		// so `unknown` (not an assertion) is the honest way to express it.
		const malformedEntries: [string, unknown][] = [
			['match', '.*'],
			['notin', ['bad@evil.com']],
		];
		const malformedRule: unknown = Object.fromEntries(malformedEntries);
		expect(
			constraintsSatisfied({ to: malformedRule }, { to: 'bad@evil.com' }),
		).toBe(false);

		// Control: the same rule spelled correctly is enforced, not discarded.
		const wellFormedEntries: [string, unknown][] = [
			['notIn', ['bad@evil.com']],
		];
		const wellFormedRule: unknown = Object.fromEntries(wellFormedEntries);
		expect(
			constraintsSatisfied({ to: wellFormedRule }, { to: 'good@corsair.dev' }),
		).toBe(true);
		expect(
			constraintsSatisfied({ to: wellFormedRule }, { to: 'bad@evil.com' }),
		).toBe(false);
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

describe('cyclic graphs with different topology never compare equal', () => {
	it('rejects a one-node cycle against a two-node ring in either direction', () => {
		// Regression: the cycle guard tracked pairing only from the right-hand
		// side, so a single left node could pair with two different right nodes
		// within one comparison. A self-loop then read as equal to a two-node
		// ring, letting an `equals` allow override apply to a structurally
		// different argument.
		const oneRing: Record<string, unknown> = {};
		oneRing.x = oneRing;
		const ringA: Record<string, unknown> = {};
		const ringB: Record<string, unknown> = {};
		ringA.x = ringB;
		ringB.x = ringA;

		// The agent-supplied value is the one-node cycle.
		expect(matchesConstraint(oneRing, { equals: ringA })).toBe(false);
		// Mirror image: the configured operand is the one-node cycle.
		expect(matchesConstraint(ringA, { equals: oneRing })).toBe(false);
	});

	it('fails closed on any cyclic value, isomorphic or not', () => {
		// Cyclic graphs are rejected outright, regardless of topology: correct
		// comparison requires graph isomorphism, not value equality, and every
		// incremental pairing guard has had a non-isomorphic counterexample.
		// JSON cannot produce cycles, so legitimate values are never affected.
		const argLoop: Record<string, unknown> = {};
		argLoop.x = argLoop;
		const cfgLoop: Record<string, unknown> = {};
		cfgLoop.x = cfgLoop;
		expect(matchesConstraint(argLoop, { equals: cfgLoop })).toBe(false);

		const argA: Record<string, unknown> = {};
		const argB: Record<string, unknown> = {};
		argA.x = argB;
		argB.x = argA;
		const cfgA: Record<string, unknown> = {};
		const cfgB: Record<string, unknown> = {};
		cfgA.x = cfgB;
		cfgB.x = cfgA;
		expect(matchesConstraint(argA, { equals: cfgA })).toBe(false);
	});
});

describe('primitive comparison edge cases', () => {
	it('treats NaN as equal to itself under Object.is semantics', () => {
		expect(matchesConstraint(Number.NaN, { equals: Number.NaN })).toBe(true);
		expect(matchesConstraint(Number.NaN, { equals: 0 })).toBe(false);
		expect(matchesConstraint(Number.NaN, { notIn: [Number.NaN] })).toBe(false);
	});

	it('distinguishes -0 from 0 like Object.is does', () => {
		expect(matchesConstraint(-0, { equals: 0 })).toBe(false);
		expect(matchesConstraint(0, { equals: 0 })).toBe(true);
	});

	it('never crosses primitive type boundaries', () => {
		expect(matchesConstraint('1', { equals: 1 })).toBe(false);
		expect(matchesConstraint(1, { equals: '1' })).toBe(false);
		expect(matchesConstraint(true, { equals: 'true' })).toBe(false);
		expect(matchesConstraint(1, { equals: true })).toBe(false);
		expect(matchesConstraint(10n, { equals: 10 })).toBe(false);
	});

	it('compares bigints by value within their own type', () => {
		expect(matchesConstraint(10n, { equals: 10n })).toBe(true);
		expect(matchesConstraint(10n, { equals: 11n })).toBe(false);
	});

	it('compares symbols and functions by reference only', () => {
		const sym = Symbol('channel');
		expect(matchesConstraint(sym, { equals: sym })).toBe(true);
		expect(
			matchesConstraint(Symbol('channel'), { equals: Symbol('channel') }),
		).toBe(false);

		const fn = () => 'post';
		expect(matchesConstraint(fn, { equals: fn })).toBe(true);
		expect(matchesConstraint(() => 'post', { equals: () => 'post' })).toBe(
			false,
		);
	});
});

describe('structural comparison edge cases', () => {
	it('compares explicit null and undefined members exactly', () => {
		expect(matchesConstraint({ a: null }, { equals: { a: null } })).toBe(true);
		expect(matchesConstraint({ a: null }, { equals: { a: 1 } })).toBe(false);
		// A present-but-null member is not an absent one.
		expect(matchesConstraint({ a: null }, { equals: {} })).toBe(false);
		expect(
			matchesConstraint({ a: undefined }, { equals: { a: undefined } }),
		).toBe(true);
		expect(matchesConstraint({ a: undefined }, { equals: {} })).toBe(false);
	});

	it('compares nested arrays and objects structurally', () => {
		expect(
			matchesConstraint([[1, { a: 2 }]], { equals: [[1, { a: 2 }]] }),
		).toBe(true);
		expect(
			matchesConstraint([[1, { a: 2 }]], { equals: [[1, { a: 3 }]] }),
		).toBe(false);
		// An array wrapped in an object differs from the bare array.
		expect(matchesConstraint([{ a: [1] }], { equals: { a: [1] } })).toBe(false);
	});

	it('does not equate an array with an object carrying index keys', () => {
		expect(matchesConstraint(['x'], { equals: { 0: 'x' } })).toBe(false);
		expect(matchesConstraint({ 0: 'x' }, { equals: ['x'] })).toBe(false);
	});

	it('compares a Date only against another Date with the same instant', () => {
		expect(
			matchesConstraint(new Date(1000), { equals: '1970-01-01T00:00:01.000Z' }),
		).toBe(false);
		expect(matchesConstraint(new Date(1000), { equals: 1000 })).toBe(false);
	});

	it('compares null-prototype objects structurally like plain objects', () => {
		const nullProto: Record<string, unknown> = Object.assign(
			Object.create(null),
			{ a: 1 },
		);
		expect(matchesConstraint(nullProto, { equals: { a: 1 } })).toBe(true);
		expect(matchesConstraint({ a: 1 }, { equals: nullProto })).toBe(true);
	});
});

describe('cycle handling across arrays and nesting', () => {
	it('fails closed on cyclic arrays', () => {
		const argCycle: unknown[] = [];
		argCycle[0] = argCycle;
		const cfgCycle: unknown[] = [];
		cfgCycle[0] = cfgCycle;

		expect(matchesConstraint(argCycle, { equals: cfgCycle })).toBe(false);
		expect(matchesConstraint(argCycle, { equals: [] })).toBe(false);
	});

	it('does not equate an array cycle with an object cycle', () => {
		const arrCycle: unknown[] = [];
		arrCycle[0] = arrCycle;
		const objCycle: Record<string, unknown> = {};
		objCycle['0'] = objCycle;

		expect(matchesConstraint(arrCycle, { equals: objCycle })).toBe(false);
		expect(matchesConstraint(objCycle, { equals: arrCycle })).toBe(false);
	});

	it('fails closed on cycles nested below the top level', () => {
		const argInner: Record<string, unknown> = {};
		argInner.self = argInner;
		const cfgInner: Record<string, unknown> = {};
		cfgInner.self = cfgInner;
		expect(
			matchesConstraint({ outer: argInner }, { equals: { outer: cfgInner } }),
		).toBe(false);

		// Same shape, different key name: also rejected — all cycles are.
		const otherInner: Record<string, unknown> = {};
		otherInner.next = otherInner;
		expect(
			matchesConstraint({ outer: argInner }, { equals: { outer: otherInner } }),
		).toBe(false);
	});
});

describe('cyclic values fail closed under every operator', () => {
	it('rejects a cyclic argument under notIn, closing the inversion hole', () => {
		// `notIn` inverts a failed comparison into a satisfied constraint.
		// Without the cycle precheck, an uncomparable cyclic argument would
		// read as "not in the denylist" and apply the constrained policy.
		const cyclic: Record<string, unknown> = {};
		cyclic.self = cyclic;
		expect(matchesConstraint(cyclic, { notIn: ['anything'] })).toBe(false);
		expect(matchesConstraint(cyclic, { in: [cyclic] })).toBe(false);
		expect(matchesConstraint(cyclic, { equals: cyclic })).toBe(false);
	});

	it('rejects cyclic operands, whichever side they come from', () => {
		// The operand is config-authored; a cyclic operand is only possible in
		// hand-written JavaScript config and is rejected like any other exotic
		// structure.
		const cyclicOperand: Record<string, unknown> = {};
		cyclicOperand.self = cyclicOperand;
		expect(matchesConstraint('plain', { equals: cyclicOperand })).toBe(false);

		// A cyclic entry inside an in/notIn list rejects the whole constraint,
		// rather than reading the value as (not) present by accident.
		expect(matchesConstraint('a', { in: ['a', cyclicOperand] })).toBe(false);
		expect(matchesConstraint('a', { notIn: ['b', cyclicOperand] })).toBe(false);
	});

	it('finds a cycle hidden behind an undefined-valued sibling property', () => {
		// Regression: the iterative scan used the popped child value to detect
		// frame exhaustion. An own enumerable property whose value is undefined
		// is a real child — popping it must not be mistaken for an exhausted
		// frame, or any cyclic sibling queued after it is never visited.
		// Both key orders are covered: Object.values order is insertion order,
		// while the frame stack pops children in reverse.
		function makeUndefinedFirst(): Record<string, unknown> {
			const cyclic: Record<string, unknown> = {};
			cyclic.self = cyclic;
			return { b: undefined, a: cyclic };
		}
		function makeCyclicFirst(): Record<string, unknown> {
			const cyclic: Record<string, unknown> = {};
			cyclic.self = cyclic;
			return { a: cyclic, b: undefined };
		}

		expect(matchesConstraint(makeUndefinedFirst(), { notIn: ['x'] })).toBe(
			false,
		);
		expect(matchesConstraint(makeCyclicFirst(), { notIn: ['x'] })).toBe(false);
		expect(matchesConstraint(makeUndefinedFirst(), { equals: {} })).toBe(false);
	});

	it('still compares values shared across branches (DAG, not cycle)', () => {
		// Sharing is not cycling: containsCycle is path-based, so a node
		// referenced from two branches does not trip it.
		const shared = { k: 1 };
		expect(
			matchesConstraint([shared, shared], { equals: [{ k: 1 }, { k: 1 }] }),
		).toBe(true);
		expect(
			matchesConstraint(
				{ p: shared, q: shared },
				{
					equals: { p: { k: 1 }, q: { k: 1 } },
				},
			),
		).toBe(true);
	});

	it('visits shared DAG nodes once rather than once per path', () => {
		let reads = 0;
		function sharedDag(depth: number): Record<string, unknown> {
			let node: Record<string, unknown> = { value: 1 };
			for (let i = 0; i < depth; i++) {
				const child = node;
				node = {};
				for (const key of ['left', 'right']) {
					Object.defineProperty(node, key, {
						enumerable: true,
						get: () => {
							reads++;
							return child;
						},
					});
				}
			}
			return node;
		}

		const value = sharedDag(30);
		const operand = sharedDag(30);
		expect(matchesConstraint(value, { equals: operand })).toBe(true);
		// Each graph is scanned once and each object pair is compared once. Without
		// completed-node/pair memoization, 30 binary levels require billions of reads.
		expect(reads).toBeLessThan(500);
	});
});

describe('deeply nested structures never crash the permission check', () => {
	function deepObject(n: number): Record<string, unknown> {
		let cur: Record<string, unknown> = { v: 1 };
		for (let i = 0; i < n; i++) cur = { next: cur };
		return cur;
	}
	function deepArray(n: number): unknown[] {
		let cur: unknown[] = [1];
		for (let i = 0; i < n; i++) cur = [cur];
		return cur;
	}

	it('compares deeply nested values without overflowing the stack', () => {
		// Regression: the recursive cycle scan threw RangeError on deep acyclic
		// structures, so the endpoint call rejected instead of failing closed.
		// The scan is now iterative; only the comparator may overflow, and that
		// is caught and read as uncomparable (constraint unsatisfied).
		const depth = 20000;
		expect(() =>
			matchesConstraint(deepObject(depth), { equals: deepObject(depth) }),
		).not.toThrow();
		expect(() =>
			matchesConstraint(deepArray(depth), { equals: deepArray(depth) }),
		).not.toThrow();
	});

	it('compares deep structures correctly, so notIn cannot invert them', () => {
		// With a fully iterative comparator, deep values compare by value —
		// no overflow can silently produce a false that notIn would invert
		// into a satisfied constraint.
		const depth = 20000;
		expect(
			matchesConstraint(deepObject(depth), { equals: deepObject(depth) }),
		).toBe(true);
		expect(matchesConstraint(deepObject(depth), { notIn: ['x'] })).toBe(true);
	});

	it('still compares structures deep enough to be meaningful', () => {
		// Positive control: normal nesting depth compares correctly, so the
		// iterative scan did not weaken legitimate comparisons.
		const depth = 1000;
		expect(
			matchesConstraint(deepObject(depth), { equals: deepObject(depth) }),
		).toBe(true);
		expect(
			matchesConstraint(deepArray(depth), { equals: deepArray(depth) }),
		).toBe(true);
	});
});

describe('operator operand edge cases', () => {
	it('requires a string pattern even when a RegExp instance is supplied', () => {
		// A RegExp would work if coerced, but coercion hides config mistakes;
		// the operator documents a string pattern.
		expect(matchesConstraint('#general', { match: new RegExp('^#gen') })).toBe(
			false,
		);
	});

	it('handles empty membership lists', () => {
		expect(matchesConstraint('a', { in: [] })).toBe(false);
		// An empty denylist genuinely excludes nothing.
		expect(matchesConstraint('a', { notIn: [] })).toBe(true);
	});

	it('finds NaN inside a membership list', () => {
		expect(matchesConstraint(Number.NaN, { in: [1, Number.NaN] })).toBe(true);
		expect(matchesConstraint(1, { in: [Number.NaN] })).toBe(false);
	});

	it('does not equate a defined value with an undefined operand', () => {
		expect(matchesConstraint('x', { equals: undefined })).toBe(false);
		expect(matchesConstraint('x', { in: [undefined] })).toBe(false);
	});
});

describe('resolveArgPath — degenerate and hostile paths', () => {
	it('returns undefined for paths with empty segments', () => {
		expect(resolveArgPath({ a: { b: 1 } }, 'a..b')).toBeUndefined();
		expect(resolveArgPath({ a: 1 }, 'a.')).toBeUndefined();
	});

	it('stops at primitives reached mid-path', () => {
		expect(resolveArgPath({ a: 'text' }, 'a.length')).toBeUndefined();
		expect(resolveArgPath({ a: 42 }, 'a.toFixed')).toBeUndefined();
	});

	it('returns undefined when the chain passes through null', () => {
		expect(resolveArgPath({ a: { b: null } }, 'a.b.c')).toBeUndefined();
	});

	it('returns undefined for an absent array index', () => {
		expect(resolveArgPath({ list: ['x'] }, 'list.5')).toBeUndefined();
	});

	it('reads own properties of class instances but not prototype members', () => {
		class Base {
			baseMethod(): string {
				return 'base';
			}
		}
		class Args extends Base {
			visible = 'yes';
		}

		expect(resolveArgPath(new Args(), 'visible')).toBe('yes');
		// Methods live on the prototype; a constraint must not judge them.
		expect(resolveArgPath(new Args(), 'baseMethod')).toBeUndefined();
	});
});

describe('constraintsSatisfied — unusable containers fail closed', () => {
	const args = { channel: '#general' };

	it('rejects constraint maps that are not plain records', () => {
		expect(constraintsSatisfied(null, args)).toBe(false);
		expect(constraintsSatisfied(undefined, args)).toBe(false);
		expect(constraintsSatisfied(42, args)).toBe(false);
		expect(constraintsSatisfied('constraints', args)).toBe(false);
		expect(constraintsSatisfied(true, args)).toBe(false);
		expect(constraintsSatisfied([], args)).toBe(false);
	});

	it('rejects entries whose value cannot express any operator', () => {
		const entries: [string, unknown][] = [['channel', 'allow']];
		const constraints: unknown = Object.fromEntries(entries);
		expect(constraintsSatisfied(constraints, args)).toBe(false);
	});
});

describe('throwing accessors fail closed', () => {
	function withThrowingGetter(key: string): Record<string, unknown> {
		const obj: Record<string, unknown> = {};
		Object.defineProperty(obj, key, {
			enumerable: true,
			configurable: true,
			get() {
				throw new Error('accessor');
			},
		});
		return obj;
	}

	it('does not throw when an argument path getter throws', () => {
		expect(() => resolveArgPath(withThrowingGetter('to'), 'to')).not.toThrow();
		expect(resolveArgPath(withThrowingGetter('to'), 'to')).toBeUndefined();
	});

	it('does not throw when a constraint operand getter throws', () => {
		expect(() =>
			matchesConstraint('#general', withThrowingGetter('equals')),
		).not.toThrow();
		expect(matchesConstraint('#general', withThrowingGetter('equals'))).toBe(
			false,
		);
	});

	it('does not throw when Object.values hits a throwing getter', () => {
		const value = withThrowingGetter('nested');
		expect(() =>
			matchesConstraint(value, { equals: { nested: 1 } }),
		).not.toThrow();
		expect(matchesConstraint(value, { equals: { nested: 1 } })).toBe(false);
		expect(matchesConstraint(value, { notIn: ['x'] })).toBe(false);
	});

	it('does not throw when the constraint map getter throws', () => {
		expect(() =>
			constraintsSatisfied(withThrowingGetter('channel'), {
				channel: '#general',
			}),
		).not.toThrow();
		expect(
			constraintsSatisfied(withThrowingGetter('channel'), {
				channel: '#general',
			}),
		).toBe(false);
	});

	it('falls back to the mode matrix when an override accessor throws', () => {
		const override = withThrowingGetter('constraints') as {
			policy: 'allow';
			constraints: Record<string, { equals: string }>;
		};
		expect(() =>
			evaluatePermission('write', 'strict', override, { channel: '#general' }),
		).not.toThrow();
		expect(
			evaluatePermission('write', 'strict', override, { channel: '#general' }),
		).toBe('require_approval');
	});
});
