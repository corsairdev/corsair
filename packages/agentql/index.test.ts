import { agentql } from './index';

describe('AgentQL plugin', () => {
	it('exposes plugin metadata and endpoints', () => {
		const plugin = agentql({ authType: 'api_key', key: 'test-key' });

		expect(plugin.id).toBe('agentql');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.endpoints?.data.query).toBeDefined();
		expect(plugin.endpoints?.data.queryDocument).toBeDefined();
		expect(
			plugin.endpoints?.browserSessions.createRemoteBrowserSession,
		).toBeDefined();
		expect(plugin.endpoints?.usage.get).toBeDefined();
	});
});
