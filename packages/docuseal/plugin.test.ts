import { AuthMissingError } from 'corsair/core';
import type { DocuSealKeyBuilderContext } from './index';
import { docuSealEndpointSchemas, docuseal } from './index';

const OPERATIONS = [
	'templates.list',
	'templates.get',
	'templates.update',
	'templates.archive',
	'templates.createFromHtml',
	'templates.createFromPdf',
	'templates.createFromDocx',
	'templates.clone',
	'templates.merge',
	'templates.updateDocuments',
	'submissions.list',
	'submissions.get',
	'submissions.create',
	'submissions.createFromPdf',
	'submissions.createFromHtml',
	'submissions.createFromDocx',
	'submissions.createFromEmails',
	'submissions.update',
	'submissions.archive',
	'submissions.getDocuments',
	'submitters.list',
	'submitters.get',
	'submitters.update',
];

// unknown: the endpoints literal's group shapes are read structurally here.
function flatten(endpoints: Record<string, unknown>): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(endpoints)) {
		for (const name of Object.keys(members as Record<string, unknown>)) {
			paths.push(`${group}.${name}`);
		}
	}
	return paths.sort();
}

describe('docuseal plugin definition', () => {
	const plugin = docuseal();

	it('registers as docuseal with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('docuseal');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 23 spec operations', () => {
		// unknown: the endpoints literal's group shapes are read structurally here.
		expect(flatten(plugin.endpoints as Record<string, unknown>)).toEqual(
			[...OPERATIONS].sort(),
		);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS].sort());
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'templates.list': 'read',
			'templates.get': 'read',
			'templates.update': 'write',
			// DocuSeal archives instead of deleting; restore is one update away.
			'templates.archive': 'write',
			'templates.createFromHtml': 'write',
			'templates.createFromPdf': 'write',
			'templates.createFromDocx': 'write',
			'templates.clone': 'write',
			'templates.merge': 'write',
			'templates.updateDocuments': 'write',
			'submissions.list': 'read',
			'submissions.get': 'read',
			'submissions.create': 'write',
			'submissions.createFromPdf': 'write',
			'submissions.createFromHtml': 'write',
			'submissions.createFromDocx': 'write',
			'submissions.createFromEmails': 'write',
			'submissions.update': 'write',
			'submissions.archive': 'write',
			// Signed document URLs act as bearer credentials.
			'submissions.getDocuments': 'write',
			'submitters.list': 'read',
			'submitters.get': 'read',
			'submitters.update': 'write',
		});
	});

	it('marks counter-signing as the only irreversible operation', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const [name, entry] of Object.entries(meta)) {
			expect(entry.irreversible ?? false).toBe(name === 'submitters.update');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(docuSealEndpointSchemas).sort()).toEqual(
			[...OPERATIONS].sort(),
		);
		for (const schemas of Object.values(docuSealEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = docuseal({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('docuseal key builder', () => {
	type KeyBuilder = (
		ctx: DocuSealKeyBuilderContext,
		source: string,
	) => Promise<string>;

	// unknown: keyBuilder's parameter type is generic in the plugin options.
	const keyBuilderOf = (plugin: { keyBuilder?: unknown }): KeyBuilder =>
		plugin.keyBuilder as KeyBuilder;

	// The fake context only carries what keyBuilder reads; a full
	// AccountKeyManager is not implementable in a test.
	function keyContext(apiKey?: string) {
		return {
			authType: 'api_key',
			keys: { get_api_key: jest.fn().mockResolvedValue(apiKey ?? null) },
			// unknown: a full AccountKeyManager is not implementable in a test.
		} as unknown as DocuSealKeyBuilderContext;
	}

	it('returns the explicitly configured key', async () => {
		const ctx = keyContext('stored-key');

		await expect(
			keyBuilderOf(docuseal({ key: 'option-key' }))(ctx, 'endpoint'),
		).resolves.toBe('option-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored API key', async () => {
		await expect(
			keyBuilderOf(docuseal())(keyContext('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			keyBuilderOf(docuseal())(keyContext(), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys, because DocuSeal deliveries are not handled', async () => {
		await expect(
			keyBuilderOf(docuseal())(keyContext('stored-key'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
