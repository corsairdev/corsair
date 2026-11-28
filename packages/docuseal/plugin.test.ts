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
	'users.me',
	'events.listFormCompleted',
	'events.listSubmissionCompleted',
	'tools.mergePdfs',
	'tools.verifyPdf',
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

	it('registers as docuseal with api_key auth and the 11 webhook events', () => {
		expect(plugin.id).toBe('docuseal');
		expect(plugin.options?.authType).toBe('api_key');
		expect(flatten(plugin.webhooks as Record<string, unknown>)).toEqual(
			[
				'form.completed',
				'form.declined',
				'form.started',
				'form.viewed',
				'submission.archived',
				'submission.completed',
				'submission.created',
				'submission.expired',
				'template.archived',
				'template.created',
				'template.updated',
			].sort(),
		);
		expect(Object.keys(plugin.webhookSchemas ?? {}).sort()).toEqual(
			flatten(plugin.webhooks as Record<string, unknown>),
		);
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-docuseal-signature': '1.abc' },
				body: { event_type: 'form.completed' },
			} as never),
		).toBe(true);
	});

	it('exposes the 23 spec operations and the 5 routes the spec leaves out', () => {
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
			'templates.updateDocuments': 'destructive',
			'submissions.list': 'read',
			'submissions.get': 'read',
			'submissions.create': 'destructive',
			'submissions.createFromPdf': 'destructive',
			'submissions.createFromHtml': 'destructive',
			'submissions.createFromDocx': 'destructive',
			'submissions.createFromEmails': 'destructive',
			'submissions.update': 'write',
			'submissions.archive': 'write',
			'submissions.getDocuments': 'read',
			'submitters.list': 'read',
			'submitters.get': 'read',
			'submitters.update': 'destructive',
			'users.me': 'read',
			'events.listFormCompleted': 'read',
			'events.listSubmissionCompleted': 'read',
			'tools.mergePdfs': 'read',
			'tools.verifyPdf': 'read',
		});
	});

	it('marks counter-signing as the only irreversible operation', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const [name, entry] of Object.entries(meta)) {
			expect(entry.irreversible ?? false).toBe(name === 'submitters.update');
		}
	});

	it('registers input and output schemas for every endpoint on the plugin', () => {
		const registered = plugin.endpointSchemas ?? {};
		expect(Object.keys(registered).sort()).toEqual([...OPERATIONS].sort());
		expect(registered).toBe(docuSealEndpointSchemas);
		for (const schemas of Object.values(registered)) {
			expect(typeof schemas.input?.safeParse).toBe('function');
			expect(typeof schemas.output?.safeParse).toBe('function');
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
	function keyContext(apiKey?: string, webhookSecret?: string) {
		return {
			authType: 'api_key',
			keys: {
				get_api_key: jest.fn().mockResolvedValue(apiKey ?? null),
				get_webhook_signature: jest
					.fn()
					.mockResolvedValue(webhookSecret ?? null),
			},
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

	it('gives webhooks the signing secret, from the option first', async () => {
		await expect(
			keyBuilderOf(docuseal({ webhookSecret: 'whsec_option' }))(
				keyContext('stored-key', 'whsec_stored'),
				'webhook',
			),
		).resolves.toBe('whsec_option');
		await expect(
			keyBuilderOf(docuseal())(
				keyContext('stored-key', 'whsec_stored'),
				'webhook',
			),
		).resolves.toBe('whsec_stored');
		await expect(
			keyBuilderOf(docuseal())(keyContext('stored-key'), 'webhook'),
		).resolves.toBe('');
	});
});
