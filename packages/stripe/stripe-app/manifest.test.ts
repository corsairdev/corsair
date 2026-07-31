import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type Permission = { permission: string; purpose: string; name: string };
type Manifest = {
	id: string;
	version: string;
	name: string;
	stripe_api_access_type: string;
	distribution_type: string;
	allowed_redirect_uris: string[];
	ui_extension: unknown[];
	permissions: Permission[];
};

// Read via fs rather than `import`: avoids needing resolveJsonModule in the
// plugin tsconfig, and asserts the file is valid JSON on disk.
const manifest = JSON.parse(
	readFileSync(join(__dirname, 'stripe-app.json'), 'utf8'),
) as Manifest;

// Least-privilege set derived 1:1 from packages/stripe/index.ts endpoint tree.
// Gotchas encoded here: Prices→plan_* (not price_*), tokens.create→token_write
// only (no token_read), customers.delete covered by customer_write.
const EXPECTED_PERMISSIONS = [
	'balance_read',
	'charge_read',
	'charge_write',
	'coupon_read',
	'coupon_write',
	'customer_read',
	'customer_write',
	'payment_intent_read',
	'payment_intent_write',
	'plan_read',
	'plan_write',
	'source_read',
	'source_write',
	'token_write',
	'webhook_write',
	'event_read',
].sort();

describe('stripe-app.json manifest', () => {
	it('declares the required top-level fields for an OAuth marketplace app', () => {
		expect(manifest.id).toBe('dev.corsair.integrations');
		expect(manifest.id).toMatch(/^[a-z0-9]+(\.[a-z0-9]+)+$/); // reverse-DNS
		expect(typeof manifest.version).toBe('string');
		expect(manifest.name).toBeTruthy();
		expect(manifest.name).not.toMatch(/stripe|\bapp\b|free|paid/i); // Stripe naming rule
		expect(manifest.stripe_api_access_type).toBe('oauth');
		expect(manifest.distribution_type).toBe('public');
	});

	it('registers exactly the Hub callback as the only redirect URI over HTTPS', () => {
		expect(manifest.allowed_redirect_uris).toEqual([
			'https://auth.corsair.dev/oauth/callback',
		]);
		for (const uri of manifest.allowed_redirect_uris) {
			expect(uri.startsWith('https://')).toBe(true);
		}
	});

	it('is data-only (no UI extension)', () => {
		expect(manifest.ui_extension).toEqual([]);
	});

	it('requests exactly the least-privilege permission set', () => {
		const ids = manifest.permissions.map((p) => p.permission).sort();
		expect(ids).toEqual(EXPECTED_PERMISSIONS);
	});

	it('maps Prices to plan_* (not price_*) and omits token_read / customer_delete', () => {
		const ids = manifest.permissions.map((p) => p.permission);
		expect(ids).toContain('plan_read');
		expect(ids).toContain('plan_write');
		expect(ids).not.toContain('price_read');
		expect(ids).not.toContain('price_write');
		expect(ids).not.toContain('token_read');
		expect(ids).not.toContain('customer_delete');
		expect(ids).toContain('customer_write'); // covers destructive delete
	});

	it('gives every permission a user-facing purpose and a reviewer-facing name', () => {
		for (const p of manifest.permissions) {
			expect(p.purpose.length).toBeGreaterThan(0);
			expect(p.name.length).toBeGreaterThan(0);
		}
	});
});
