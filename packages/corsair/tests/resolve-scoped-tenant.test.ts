import { ManagementApiError } from '../core/management/errors';
import {
	assertAdminRouteAllowed,
	resolveScopedTenant,
} from '../core/management/handler';

describe('resolveScopedTenant', () => {
	it('falls back to the client value when no resolver is configured', () => {
		expect(resolveScopedTenant(undefined, 'acme')).toBe('acme');
		expect(resolveScopedTenant(undefined, undefined)).toBeUndefined();
	});

	it('uses the resolved tenant and ignores the client value', () => {
		// even if the client asks for another tenant, the resolver wins
		expect(resolveScopedTenant('real-tenant', 'attacker-tenant')).toBe(
			'real-tenant',
		);
	});

	it('rejects as unauthenticated when the resolver returns null', () => {
		expect(() => resolveScopedTenant(null, 'acme')).toThrow(ManagementApiError);
		try {
			resolveScopedTenant(null, 'acme');
		} catch (err) {
			expect((err as ManagementApiError).status).toBe(401);
		}
	});
});

describe('assertAdminRouteAllowed', () => {
	it('allows admin routes only when no resolver is configured', () => {
		expect(() => assertAdminRouteAllowed(undefined)).not.toThrow();
	});

	it('forbids admin routes in end-user mode (resolver configured)', () => {
		for (const scoped of ['acme', null] as const) {
			expect(() => assertAdminRouteAllowed(scoped)).toThrow(ManagementApiError);
			try {
				assertAdminRouteAllowed(scoped);
			} catch (err) {
				expect((err as ManagementApiError).status).toBe(403);
			}
		}
	});
});
