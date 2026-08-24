import { describe, expect, it } from 'vitest';
import { buildCorsairToolDefs } from '../src/core/tools';

describe('run_script tool - scoped proxy', () => {
	// Setup mock corsair object
	const mockCorsair = {
		github: {
			keys: { get_access_token: () => 'secret-token' },
			api: { repos: { list: () => [{ name: 'repo1' }] } },
			db: {
				issues: {
					search: () => [{ id: 1 }],
					list: () => [{ id: 1 }],
					findById: () => ({ id: 1 }),
					findByEntityId: () => ({ id: 1 }),
					upsertByEntityId: () => 'upserted',
					deleteById: () => 'deleted',
					deleteByEntityId: () => 'deleted',
				},
			},
		},
		slack: {
			keys: { get_refresh_token: () => 'refresh-token' },
			api: { channels: { list: () => [] } },
		},
		manage: {
			tenants: {
				list: () => [{ id: 'tenant-1' }],
				get: () => ({ id: 'tenant-1' }),
				create: () => ({ id: 'new-tenant' }),
			},
			plugins: { list: () => [] },
			connect: {
				createLink: () => 'link',
				oauthCallback: () => 'callback',
			},
		},
	};

	const getRunScriptTool = (readonly = false) => {
		const tools = buildCorsairToolDefs({
			corsair: mockCorsair as any,
			runOptions: { readonly },
		});
		return tools.find((t) => t.name === 'run_script')!;
	};

	// Keys tests
	describe('keys access', () => {
		it('throws helpful error when accessing keys', async () => {
			const tool = getRunScriptTool();
			const result = await tool.handler({
				code: 'return corsair.github.keys.get_access_token();',
			});
			expect((result.content[0] as { text: string }).text).toMatch(
				/Credential access \(keys\) not available/,
			);
			expect((result.content[0] as { text: string }).text).toMatch(/api\.\*/);
		});

		it('throws helpful error in readonly mode too', async () => {
			const tool = getRunScriptTool(true);
			const result = await tool.handler({
				code: 'return corsair.slack.keys.get_refresh_token();',
			});
			expect((result.content[0] as { text: string }).text).toMatch(
				/Credential access \(keys\) not available/,
			);
		});
	});

	// DB tests
	describe('db access', () => {
		it('allows db reads to pass through', async () => {
			const tool = getRunScriptTool();
			const result = await tool.handler({
				code: 'return corsair.github.db.issues.search();',
			});
			expect((result.content[0] as { text: string }).text).not.toMatch(/Error/);
		});

		it('allows db reads in readonly mode', async () => {
			const tool = getRunScriptTool(true);
			const result = await tool.handler({
				code: 'return corsair.github.db.issues.list();',
			});
			expect((result.content[0] as { text: string }).text).not.toMatch(
				/ReadonlyForbiddenError/,
			);
		});

		it('blocks upsertByEntityId in readonly mode', async () => {
			const tool = getRunScriptTool(true);
			const result = await tool.handler({
				code: 'return corsair.github.db.issues.upsertByEntityId({});',
			});
			expect((result.content[0] as { text: string }).text).toMatch(
				/readonly|ReadonlyForbidden/i,
			);
		});

		it('blocks deleteById in readonly mode', async () => {
			const tool = getRunScriptTool(true);
			const result = await tool.handler({
				code: 'return corsair.github.db.issues.deleteById("1");',
			});
			expect((result.content[0] as { text: string }).text).toMatch(
				/readonly|ReadonlyForbidden/i,
			);
		});

		it('blocks deleteByEntityId in readonly mode', async () => {
			const tool = getRunScriptTool(true);
			const result = await tool.handler({
				code: 'return corsair.github.db.issues.deleteByEntityId("1");',
			});
			expect((result.content[0] as { text: string }).text).toMatch(
				/readonly|ReadonlyForbidden/i,
			);
		});
	});

	// Manage tests
	describe('manage access', () => {
		it('allows manage reads to pass through', async () => {
			const tool = getRunScriptTool();
			const result = await tool.handler({
				code: 'return corsair.manage.tenants.list();',
			});
			expect((result.content[0] as { text: string }).text).not.toMatch(/Error/);
		});

		it('allows manage reads in readonly mode', async () => {
			const tool = getRunScriptTool(true);
			const result = await tool.handler({
				code: 'return corsair.manage.plugins.list();',
			});
			expect((result.content[0] as { text: string }).text).not.toMatch(/Error/);
		});

		it('blocks manage.tenants.create', async () => {
			const tool = getRunScriptTool();
			const result = await tool.handler({
				code: 'return corsair.manage.tenants.create({});',
			});
			expect((result.content[0] as { text: string }).text).toMatch(
				/not available in run_script/,
			);
		});

		it('blocks manage.connect.createLink', async () => {
			const tool = getRunScriptTool();
			const result = await tool.handler({
				code: 'return corsair.manage.connect.createLink({});',
			});
			expect((result.content[0] as { text: string }).text).toMatch(
				/not available in run_script/,
			);
		});
	});

	// API tests (regression check)
	describe('api access', () => {
		it('allows api reads to pass through', async () => {
			const tool = getRunScriptTool();
			const result = await tool.handler({
				code: 'return corsair.github.api.repos.list();',
			});
			expect((result.content[0] as { text: string }).text).not.toMatch(/Error/);
		});

		it('allows api reads in readonly mode', async () => {
			const tool = getRunScriptTool(true);
			const result = await tool.handler({
				code: 'return corsair.slack.api.channels.list();',
			});
			expect((result.content[0] as { text: string }).text).not.toMatch(
				/ReadonlyForbiddenError/,
			);
		});
	});
});
