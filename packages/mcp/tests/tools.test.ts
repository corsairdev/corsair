import { describe, expect, it } from 'vitest';
import { buildCorsairToolDefs } from '../src/core/tools';

describe('run_script tool', () => {
	it('blocks access to unguarded surfaces in readonly mode', async () => {
		let reposListCalled = false;

		const mockCorsair = {
			github: {
				keys: { get_access_token: () => 'token' },
				api: {
					repos: {
						list: () => {
							reposListCalled = true;
							return [];
						},
					},
				},
			},
			slack: {
				db: { messages: { upsertByEntityId: () => 'upserted' } },
			},
			manage: { listPlugins: () => [] },
		};

		const tools = buildCorsairToolDefs({
			corsair: mockCorsair as any,
			runOptions: { readonly: true },
		});

		const runScriptTool = tools.find((t) => t.name === 'run_script')!;

		// Try to read keys
		const resultKeys = await runScriptTool.handler({
			code: 'return corsair.github.keys.get_access_token();',
		});
		expect(resultKeys.content[0].text).toMatch(
			/TypeError: Cannot read properties of undefined|TypeError: .* is not a function/,
		);

		// Try to access db
		const resultDb = await runScriptTool.handler({
			code: 'return corsair.slack.db.messages.upsertByEntityId();',
		});
		expect(resultDb.content[0].text).toMatch(
			/TypeError: Cannot read properties of undefined|TypeError: .* is not a function/,
		);

		// Try to access manage
		const resultManage = await runScriptTool.handler({
			code: 'return corsair.manage.listPlugins();',
		});
		expect(resultManage.content[0].text).toMatch(
			/TypeError: Cannot read properties of undefined|TypeError: .* is not a function/,
		);

		// Valid API read
		const resultApi = await runScriptTool.handler({
			code: 'return corsair.github.api.repos.list();',
		});
		expect(reposListCalled).toBe(true);
	});

	it('blocks access to unguarded surfaces with strict permissions', async () => {
		const mockCorsair = {
			slack: {
				keys: { get_refresh_token: () => 'token' },
			},
			github: {
				db: { issues: { update: () => 'updated' } },
			},
			manage: { listTenants: () => [] },
			linear: {
				api: { issues: { list: () => [] } },
			},
		};

		const tools = buildCorsairToolDefs({
			corsair: mockCorsair as any,
			runOptions: { readonly: false }, // Simulate normal permission run
		});

		const runScriptTool = tools.find((t) => t.name === 'run_script')!;

		const resultKeys = await runScriptTool.handler({
			code: 'return corsair.slack.keys.get_refresh_token();',
		});
		expect(resultKeys.content[0].text).toMatch(
			/TypeError: Cannot read properties of undefined|TypeError: .* is not a function/,
		);

		const resultDb = await runScriptTool.handler({
			code: 'return corsair.github.db.issues.update();',
		});
		expect(resultDb.content[0].text).toMatch(
			/TypeError: Cannot read properties of undefined|TypeError: .* is not a function/,
		);

		const resultManage = await runScriptTool.handler({
			code: 'return corsair.manage.listTenants();',
		});
		expect(resultManage.content[0].text).toMatch(
			/TypeError: Cannot read properties of undefined|TypeError: .* is not a function/,
		);

		const resultApi = await runScriptTool.handler({
			code: 'return corsair.linear.api.issues.list();',
		});
		expect(resultApi.content[0].text).not.toMatch(/TypeError/);
	});
});
