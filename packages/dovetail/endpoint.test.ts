import {
	DovetailEndpointInputSchemas,
	DovetailEndpointOutputSchemas,
	EndpointInputSchemas,
	EndpointOutputSchemas,
} from './endpoints/types';
import type { DovetailKeyBuilderContext } from './index';
import {
	dovetail,
	dovetailAuthConfig,
	dovetailEndpointMeta,
	dovetailEndpointSchemas,
} from './index';

describe('Dovetail Plugin Endpoints and Configuration', () => {
	it('initializes the plugin with default options and correct id', () => {
		const plugin = dovetail({ key: 'test-key' });
		expect(plugin.id).toBe('dovetail');
		expect(plugin.options?.key).toBe('test-key');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('configures authConfig strictly for api_key', () => {
		expect(dovetailAuthConfig.api_key).toBeDefined();
		expect(dovetailAuthConfig.api_key.account).toEqual(['tenant_external_id']);
	});

	it('registers all 51 endpoint functions across 13 namespaces', () => {
		const plugin = dovetail();

		// Channels (7)
		expect(plugin.endpoints?.channels.create).toBeDefined();
		expect(plugin.endpoints?.channels.update).toBeDefined();
		expect(plugin.endpoints?.channels.delete).toBeDefined();
		expect(plugin.endpoints?.channels.createDataPoint).toBeDefined();
		expect(plugin.endpoints?.channels.createTopic).toBeDefined();
		expect(plugin.endpoints?.channels.updateTopic).toBeDefined();
		expect(plugin.endpoints?.channels.deleteTopic).toBeDefined();

		// Contacts (4)
		expect(plugin.endpoints?.contacts.create).toBeDefined();
		expect(plugin.endpoints?.contacts.get).toBeDefined();
		expect(plugin.endpoints?.contacts.list).toBeDefined();
		expect(plugin.endpoints?.contacts.update).toBeDefined();

		// Data (7)
		expect(plugin.endpoints?.data.create).toBeDefined();
		expect(plugin.endpoints?.data.get).toBeDefined();
		expect(plugin.endpoints?.data.list).toBeDefined();
		expect(plugin.endpoints?.data.update).toBeDefined();
		expect(plugin.endpoints?.data.delete).toBeDefined();
		expect(plugin.endpoints?.data.export).toBeDefined();
		expect(plugin.endpoints?.data.importFile).toBeDefined();

		// Docs (8)
		expect(plugin.endpoints?.docs.create).toBeDefined();
		expect(plugin.endpoints?.docs.get).toBeDefined();
		expect(plugin.endpoints?.docs.list).toBeDefined();
		expect(plugin.endpoints?.docs.update).toBeDefined();
		expect(plugin.endpoints?.docs.delete).toBeDefined();
		expect(plugin.endpoints?.docs.export).toBeDefined();
		expect(plugin.endpoints?.docs.importFile).toBeDefined();
		expect(plugin.endpoints?.docs.listUserDocs).toBeDefined();

		// Insights (8)
		expect(plugin.endpoints?.insights.create).toBeDefined();
		expect(plugin.endpoints?.insights.get).toBeDefined();
		expect(plugin.endpoints?.insights.list).toBeDefined();
		expect(plugin.endpoints?.insights.update).toBeDefined();
		expect(plugin.endpoints?.insights.delete).toBeDefined();
		expect(plugin.endpoints?.insights.export).toBeDefined();
		expect(plugin.endpoints?.insights.importFile).toBeDefined();
		expect(plugin.endpoints?.insights.listUserInsights).toBeDefined();

		// Notes (7)
		expect(plugin.endpoints?.notes.create).toBeDefined();
		expect(plugin.endpoints?.notes.get).toBeDefined();
		expect(plugin.endpoints?.notes.list).toBeDefined();
		expect(plugin.endpoints?.notes.update).toBeDefined();
		expect(plugin.endpoints?.notes.delete).toBeDefined();
		expect(plugin.endpoints?.notes.export).toBeDefined();
		expect(plugin.endpoints?.notes.importFile).toBeDefined();

		// Projects (3)
		expect(plugin.endpoints?.projects.create).toBeDefined();
		expect(plugin.endpoints?.projects.get).toBeDefined();
		expect(plugin.endpoints?.projects.list).toBeDefined();

		// Folders (2)
		expect(plugin.endpoints?.folders.get).toBeDefined();
		expect(plugin.endpoints?.folders.list).toBeDefined();

		// Files (1)
		expect(plugin.endpoints?.files.get).toBeDefined();

		// Highlights (1)
		expect(plugin.endpoints?.highlights.list).toBeDefined();

		// Tags (1)
		expect(plugin.endpoints?.tags.list).toBeDefined();

		// Token (1)
		expect(plugin.endpoints?.token.getInfo).toBeDefined();

		// Search (1)
		expect(plugin.endpoints?.search.magicSearch).toBeDefined();
	});

	it('declares 51 endpoint schemas with matching input and output validators', () => {
		const schemaEntries = Object.values(dovetailEndpointSchemas);
		expect(schemaEntries.length).toBe(51);

		for (const entry of schemaEntries) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}

		expect(EndpointInputSchemas).toBe(DovetailEndpointInputSchemas);
		expect(EndpointOutputSchemas).toBe(DovetailEndpointOutputSchemas);
	});

	it('assigns correct risk levels and descriptions in endpointMeta', () => {
		const metaKeys = Object.keys(dovetailEndpointMeta);
		expect(metaKeys.length).toBe(51);

		// Verify destructive endpoints
		expect(dovetailEndpointMeta['channels.delete'].riskLevel).toBe(
			'destructive',
		);
		expect(dovetailEndpointMeta['channels.deleteTopic'].riskLevel).toBe(
			'destructive',
		);
		expect(dovetailEndpointMeta['data.delete'].riskLevel).toBe('destructive');
		expect(dovetailEndpointMeta['docs.delete'].riskLevel).toBe('destructive');
		expect(dovetailEndpointMeta['insights.delete'].riskLevel).toBe(
			'destructive',
		);
		expect(dovetailEndpointMeta['notes.delete'].riskLevel).toBe('destructive');

		// Verify write endpoints
		expect(dovetailEndpointMeta['channels.create'].riskLevel).toBe('write');
		expect(dovetailEndpointMeta['channels.update'].riskLevel).toBe('write');
		expect(dovetailEndpointMeta['contacts.create'].riskLevel).toBe('write');
		expect(dovetailEndpointMeta['data.create'].riskLevel).toBe('write');
		expect(dovetailEndpointMeta['docs.create'].riskLevel).toBe('write');
		expect(dovetailEndpointMeta['insights.create'].riskLevel).toBe('write');
		expect(dovetailEndpointMeta['notes.create'].riskLevel).toBe('write');
		expect(dovetailEndpointMeta['projects.create'].riskLevel).toBe('write');

		// Verify read endpoints
		expect(dovetailEndpointMeta['contacts.get'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['contacts.list'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['data.get'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['data.list'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['data.export'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['files.get'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['folders.get'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['folders.list'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['highlights.list'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['tags.list'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['token.getInfo'].riskLevel).toBe('read');
		expect(dovetailEndpointMeta['search.magicSearch'].riskLevel).toBe('read');
	});

	it('validates schema input parsing and rejects invalid inputs', () => {
		// Valid channels create input
		const validChannel = DovetailEndpointInputSchemas.channelsCreate.safeParse({
			title: 'User Feedback',
			content_type: 'NPS_FEEDBACK',
		});
		expect(validChannel.success).toBe(true);

		// Invalid channels create input (bad content_type)
		const invalidChannel =
			DovetailEndpointInputSchemas.channelsCreate.safeParse({
				title: 'User Feedback',
				content_type: 'INVALID_TYPE',
			});
		expect(invalidChannel.success).toBe(false);

		// Valid search input
		// Justification: unknown is used here because search filter criteria can contain arbitrary nested structures
		const searchFilter: Record<string, unknown> = {
			term: 'onboarding',
		};
		const validSearch =
			DovetailEndpointInputSchemas.searchMagicSearch.safeParse({
				query: 'onboarding',
				offset: 0,
				limit: 25,
				filter: searchFilter,
			});
		expect(validSearch.success).toBe(true);

		// Invalid search input (negative limit)
		const invalidSearch =
			DovetailEndpointInputSchemas.searchMagicSearch.safeParse({
				limit: -5,
			});
		expect(invalidSearch.success).toBe(false);

		// Valid export input
		const validExport = DovetailEndpointInputSchemas.notesExport.safeParse({
			note_id: 'not_123',
			type: 'markdown',
		});
		expect(validExport.success).toBe(true);

		// Invalid export input (invalid format)
		const invalidExport = DovetailEndpointInputSchemas.notesExport.safeParse({
			note_id: 'not_123',
			type: 'pdf',
		});
		expect(invalidExport.success).toBe(false);
	});

	it('keyBuilder resolves key from options or key manager', async () => {
		const pluginWithOptionsKey = dovetail({ key: 'options-api-key' });

		const mockKeyBuilderContext: DovetailKeyBuilderContext = {
			tenantId: 'test-tenant-id',
			authType: 'api_key',
			options: { key: 'options-api-key' },
			keys: {
				get_api_key: async () => 'keys-api-key',
				set_api_key: async () => undefined,
				get_webhook_signature: async () => '',
				set_webhook_signature: async () => undefined,
				get_dek: async () => '',
				issue_new_dek: async () => '',
			},
		};

		const resolvedFromOptions = await pluginWithOptionsKey.keyBuilder?.(
			mockKeyBuilderContext,
			'endpoint',
		);
		expect(resolvedFromOptions).toBe('options-api-key');

		const pluginWithoutKey = dovetail();
		const mockContextWithoutOptionsKey: DovetailKeyBuilderContext = {
			tenantId: 'test-tenant-id',
			authType: 'api_key',
			options: {},
			keys: {
				get_api_key: async () => 'keys-api-key',
				set_api_key: async () => undefined,
				get_webhook_signature: async () => '',
				set_webhook_signature: async () => undefined,
				get_dek: async () => '',
				issue_new_dek: async () => '',
			},
		};

		const resolvedFromKeys = await pluginWithoutKey.keyBuilder?.(
			mockContextWithoutOptionsKey,
			'endpoint',
		);
		expect(resolvedFromKeys).toBe('keys-api-key');

		const resolvedForWebhook = await pluginWithoutKey.keyBuilder?.(
			mockContextWithoutOptionsKey,
			'webhook',
		);
		expect(resolvedForWebhook).toBe('');
	});
});
