import { bindingAuthCtx } from './binding-auth-ctx';

const keys = { marker: 'account-keys' } as never;

test('with a key manager: carries both keys and the auth type', () => {
	expect(bindingAuthCtx('oauth_2', keys)).toEqual({
		keys,
		authType: 'oauth_2',
	});
	expect(bindingAuthCtx('managed', keys)).toEqual({
		keys,
		authType: 'managed',
	});
});

test('managed without a key manager: carries authType so the managed guard is reachable', () => {
	// The regression Greptile flagged: stripping authType here left
	// resolveBindingKey unable to throw AuthMissingError for managed.
	expect(bindingAuthCtx('managed', undefined)).toEqual({ authType: 'managed' });
});

test('non-managed without a key manager: omits both (plugin keyBuilder keeps its own error)', () => {
	expect(bindingAuthCtx('oauth_2', undefined)).toEqual({});
	expect(bindingAuthCtx('api_key', undefined)).toEqual({});
	expect(bindingAuthCtx(undefined, undefined)).toEqual({});
});
