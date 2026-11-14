import { AuthMissingError } from 'corsair/core';
import type { GoogleSlidesKeyBuilderContext } from './index';
import {
	googleSlidesAuthConfig,
	googleSlidesEndpointSchemas,
	googleslides,
} from './index';
import { GoogleSlidesSchema } from './schema';

/**
 * The keyBuilder only reads keys, tenantId, authType and hub. A real
 * AccountKeyManager carries dek rotation and hub plumbing, so the fixture
 * implements the one method and casts once.
 *
 * unknown: KeyBuilderContext requires a full AccountKeyManager; a test cannot
 * build one without a database, and this is the documented test pattern.
 */
function makeKeyBuilderCtx(
	overrides: Partial<Record<string, unknown>> = {}, // unknown: fixture overrides.
): GoogleSlidesKeyBuilderContext {
	return {
		authType: 'oauth_2',
		tenantId: 'tenant-1',
		keys: {
			get_access_token: async () => 'stored-token',
			get_expires_at: async () => Date.now() + 3_600_000,
			get_integration_credentials: async () => ({
				client_id: 'client',
				client_secret: 'secret',
			}),
		},
		...overrides,
	} as unknown as GoogleSlidesKeyBuilderContext; // unknown: test fixture cast.
}

describe('googleslides plugin definition', () => {
	it('registers the id and OAuth auth type', () => {
		const plugin = googleslides();

		expect(plugin.id).toBe('googleslides');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.schema).toBe(GoogleSlidesSchema);
	});

	it('requests the Slides and Drive scopes', () => {
		const plugin = googleslides();

		expect(plugin.oauthConfig?.scopes).toEqual([
			'https://www.googleapis.com/auth/presentations',
			'https://www.googleapis.com/auth/drive',
		]);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://oauth2.googleapis.com/token',
		);
	});

	it('declares no inbound webhooks, which Google Slides does not send', () => {
		const plugin = googleslides();

		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes every endpoint with metadata and schemas', () => {
		const plugin = googleslides();
		// unknown: the endpoint tree's values are functions, walked by group only.
		// unknown: endpoint values are functions; only the group keys are read.
		const tree = plugin.endpoints as Record<
			string,
			Record<string, unknown> // unknown: only the operation keys are read.
		>;
		const paths: string[] = [];
		for (const [group, endpoints] of Object.entries(tree)) {
			for (const name of Object.keys(endpoints)) paths.push(`${group}.${name}`);
		}

		expect(paths).toHaveLength(31);
		for (const path of paths) {
			// Array form: a dotted string would be read as a nested path.
			expect(plugin.endpointMeta).toHaveProperty([path]);
			expect(plugin.endpointSchemas).toHaveProperty([path]);
			const schemas = plugin.endpointSchemas as Record<
				string,
				// unknown: only presence is asserted; each schema is a zod type.
				{ input?: unknown; output?: unknown } // unknown: presence only.
			>;
			expect(schemas[path]?.input).toBeDefined();
			expect(schemas[path]?.output).toBeDefined();
		}
	});

	it('marks deletion operations destructive, including the raw batch path', () => {
		const plugin = googleslides();
		const meta = plugin.endpointMeta as Record<
			string,
			{ riskLevel: string; irreversible?: boolean }
		>;
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([path]) => path)
			.sort();

		// batch.update is destructive because it can reach request types with no
		// typed endpoint; its handler refuses the irreversible ones it can carry.
		expect(destructive).toEqual([
			'batch.update',
			'presentations.delete',
			'slides.remove',
			'text.delete',
		]);
		expect(meta['presentations.delete']?.irreversible).toBe(true);
		expect(meta['slides.remove']?.irreversible).toBe(true);
	});

	it('treats exporting as a read, since it changes nothing', () => {
		const meta = googleslides().endpointMeta as Record<
			string,
			{ riskLevel: string }
		>;
		expect(meta['presentations.exportPdf']?.riskLevel).toBe('read');
	});

	it('keeps the schema map key count equal to the endpoint count', () => {
		expect(Object.keys(googleSlidesEndpointSchemas)).toHaveLength(31);
	});

	it('declares the presentations entity', () => {
		expect(GoogleSlidesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Array.isArray(GoogleSlidesSchema.entities)).toBe(false);
		expect(GoogleSlidesSchema.entities).toHaveProperty('presentations');
	});

	it('declares no extra account fields, which would show as unconnected settings', () => {
		expect(googleSlidesAuthConfig.oauth_2.account).toEqual([]);
	});
});

describe('googleslides keyBuilder', () => {
	it('returns the inline key when one is given', async () => {
		const plugin = googleslides({ key: 'inline-token' });
		const key = await plugin.keyBuilder?.(
			makeKeyBuilderCtx() as never,
			'endpoint',
		);
		expect(key).toBe('inline-token');
	});

	it('refuses a webhook source, which this plugin never receives', async () => {
		const plugin = googleslides();
		await expect(
			(plugin.keyBuilder as (ctx: never, source: 'webhook') => Promise<string>)(
				makeKeyBuilderCtx() as never,
				'webhook',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('throws AuthMissingError when neither an inline key nor OAuth is available', async () => {
		const plugin = googleslides();
		const ctx = makeKeyBuilderCtx({
			authType: 'api_key',
		}) as unknown as never; // unknown: the wrong auth type, cast to reach the branch.

		await expect(
			(
				plugin.keyBuilder as (ctx: never, source: 'endpoint') => Promise<string>
			)(ctx, 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});
});
