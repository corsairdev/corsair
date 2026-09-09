/**
 * PhantomBuster plugin — structural/unit tests.
 *
 * These tests verify the plugin factory shape and schema validity without
 * making real network calls to the PhantomBuster API.
 */

import { PhantomBusterEndpointInputSchemas } from './endpoints/types';
import { phantombuster } from './index';
import { PhantomBusterSchema } from './schema';

describe('phantombuster plugin factory', () => {
	it('creates a plugin with the correct id', () => {
		const plugin = phantombuster();
		expect(plugin.id).toBe('phantombuster');
	});

	it('includes the expected endpoint groups', () => {
		const plugin = phantombuster();
		const endpoints = plugin.endpoints!;
		expect(endpoints).toHaveProperty('agents');
		expect(endpoints).toHaveProperty('containers');
		expect(endpoints).toHaveProperty('users');
		expect(endpoints).toHaveProperty('orgs');
		expect(endpoints).toHaveProperty('leads');
		expect(endpoints).toHaveProperty('lists');
	});

	it('agents group has all expected operations', () => {
		const plugin = phantombuster();
		const agents = plugin.endpoints!.agents;
		expect(agents).toHaveProperty('fetchAll');
		expect(agents).toHaveProperty('fetch');
		expect(agents).toHaveProperty('save');
		expect(agents).toHaveProperty('delete');
		expect(agents).toHaveProperty('launch');
		expect(agents).toHaveProperty('stop');
		expect(agents).toHaveProperty('fetchOutput');
	});

	it('containers group has all expected operations', () => {
		const plugin = phantombuster();
		const containers = plugin.endpoints!.containers;
		expect(containers).toHaveProperty('fetchAll');
		expect(containers).toHaveProperty('fetch');
		expect(containers).toHaveProperty('fetchOutput');
		expect(containers).toHaveProperty('fetchResultObject');
	});

	it('uses api_key auth type by default', () => {
		const plugin = phantombuster();
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('allows overriding authType option', () => {
		const plugin = phantombuster({ authType: 'api_key' });
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('has a valid empty schema', () => {
		const plugin = phantombuster();
		expect(plugin.schema).toEqual(PhantomBusterSchema);
		expect(plugin.schema?.entities).toEqual({});
	});

	it('has endpoint schemas for all endpoints', () => {
		const plugin = phantombuster();
		const schemaKeys = Object.keys(plugin.endpointSchemas ?? {});
		expect(schemaKeys).toContain('agents.fetchAll');
		expect(schemaKeys).toContain('agents.launch');
		expect(schemaKeys).toContain('containers.fetchAll');
		expect(schemaKeys).toContain('users.fetchMe');
		expect(schemaKeys).toContain('orgs.fetch');
		expect(schemaKeys).toContain('leads.save');
		expect(schemaKeys).toContain('lists.fetchAll');
	});

	it('has endpoint metadata for all endpoints', () => {
		const plugin = phantombuster();
		const metaKeys = Object.keys(plugin.endpointMeta ?? {});
		expect(metaKeys).toContain('agents.fetchAll');
		expect(metaKeys).toContain('agents.launch');
		expect(metaKeys).toContain('lists.delete');
	});

	it('has correct riskLevel for write operations', () => {
		const plugin = phantombuster();
		const meta = plugin.endpointMeta ?? {};
		expect(meta['agents.launch']?.riskLevel).toBe('write');
		expect(meta['agents.stop']?.riskLevel).toBe('write');
		expect(meta['leads.save']?.riskLevel).toBe('write');
		expect(meta['lists.save']?.riskLevel).toBe('write');
	});

	it('has correct riskLevel for destructive operations', () => {
		const plugin = phantombuster();
		const meta = plugin.endpointMeta ?? {};
		expect(meta['agents.delete']?.riskLevel).toBe('destructive');
		expect(meta['lists.delete']?.riskLevel).toBe('destructive');
	});

	it('has correct riskLevel for read operations', () => {
		const plugin = phantombuster();
		const meta = plugin.endpointMeta ?? {};
		expect(meta['agents.fetchAll']?.riskLevel).toBe('read');
		expect(meta['users.fetchMe']?.riskLevel).toBe('read');
		expect(meta['orgs.fetch']?.riskLevel).toBe('read');
	});

	it('optional key option is passed through', () => {
		const plugin = phantombuster({ key: 'my-api-key' });
		expect(plugin.options?.key).toBe('my-api-key');
	});
});

describe('PhantomBuster input schema validation', () => {
	it('fetchAgent requires a non-empty id', () => {
		const schema = PhantomBusterEndpointInputSchemas.fetchAgent;
		expect(schema.safeParse({ id: 'abc123' }).success).toBe(true);
		expect(schema.safeParse({ id: '' }).success).toBe(false);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('launchAgent requires id, allows optional argument', () => {
		const schema = PhantomBusterEndpointInputSchemas.launchAgent;
		expect(schema.safeParse({ id: 'abc' }).success).toBe(true);
		expect(
			schema.safeParse({ id: 'abc', argument: { search: 'foo' } }).success,
		).toBe(true);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('fetchAllContainers requires agentId', () => {
		const schema = PhantomBusterEndpointInputSchemas.fetchAllContainers;
		expect(schema.safeParse({ agentId: 'ag123' }).success).toBe(true);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('saveLeads requires at least one lead', () => {
		const schema = PhantomBusterEndpointInputSchemas.saveLeads;
		expect(schema.safeParse({ leads: [{ email: 'a@b.com' }] }).success).toBe(
			true,
		);
		expect(schema.safeParse({ leads: [] }).success).toBe(false);
	});

	it('saveList requires a non-empty name', () => {
		const schema = PhantomBusterEndpointInputSchemas.saveList;
		expect(schema.safeParse({ name: 'My List' }).success).toBe(true);
		expect(schema.safeParse({ name: '' }).success).toBe(false);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('fetchAgentOutput allows optional status filter', () => {
		const schema = PhantomBusterEndpointInputSchemas.fetchAgentOutput;
		expect(schema.safeParse({ id: 'abc' }).success).toBe(true);
		expect(schema.safeParse({ id: 'abc', status: 'finished' }).success).toBe(
			true,
		);
		expect(schema.safeParse({ id: 'abc', status: 'invalid' }).success).toBe(
			false,
		);
	});
});
