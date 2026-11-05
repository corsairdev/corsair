import {
	DropboxSignSchema,
	dropboxSignEndpointSchemas,
	dropboxsign,
} from './index';

describe('Dropbox Sign Plugin', () => {
	it('initializes with default options and correct id', () => {
		const plugin = dropboxsign();
		expect(plugin.id).toBe('dropboxsign');
		expect(plugin.schema).toBe(DropboxSignSchema);
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.endpointMeta).toBeDefined();
		expect(plugin.endpointSchemas).toBeDefined();
	});

	it('configures authentication types for api_key and oauth_2', () => {
		const plugin = dropboxsign();
		expect(plugin.authConfig?.api_key).toBeDefined();
		expect(plugin.authConfig?.oauth_2).toBeDefined();
	});

	it('exposes all major endpoint groups', () => {
		const plugin = dropboxsign();
		expect(plugin.endpoints?.account).toBeDefined();
		expect(plugin.endpoints?.signatureRequests).toBeDefined();
		expect(plugin.endpoints?.templates).toBeDefined();
		expect(plugin.endpoints?.drafts).toBeDefined();
		expect(plugin.endpoints?.embedded).toBeDefined();
		expect(plugin.endpoints?.bulkSend).toBeDefined();
		expect(plugin.endpoints?.teams).toBeDefined();
		expect(plugin.endpoints?.apiApps).toBeDefined();
		expect(plugin.endpoints?.faxAndReports).toBeDefined();
	});

	it('validates every endpoint schema', () => {
		const plugin = dropboxsign();
		const keys = Object.keys(dropboxSignEndpointSchemas);
		expect(keys).toHaveLength(56);
		for (const key of keys) {
			const schemas =
				dropboxSignEndpointSchemas[
					key as keyof typeof dropboxSignEndpointSchemas
				];
			expect(schemas.input).toBeDefined();
			expect(schemas.output).toBeDefined();
			expect(
				plugin.endpointMeta?.[key as keyof typeof plugin.endpointMeta],
			).toBeDefined();
		}
	});
});
