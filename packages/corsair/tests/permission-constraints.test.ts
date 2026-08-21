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

	it('rejects an unrecognized constraint shape', () => {
		// An unenforceable rule must never read as satisfied.
		expect(matchesConstraint('anything', { nope: true } as never)).toBe(false);
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
