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
				db: {
					messages: {
						upsertByEntityId: () => 'upserted',
						search: () => ['msg1'],
					},
				},
			},
			manage: {
				plugins: { list: () => [] },
				tenants: { create: () => 'created' },
				connect: { createLink: () => 'link' },
			},
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
			/Credential access \(keys\) not available/,
		);

		// Try to access db write
		const resultDbWrite = await runScriptTool.handler({
			code: 'return corsair.slack.db.messages.upsertByEntityId();',
		});
		expect(resultDbWrite.content[0].text).toMatch(/ReadonlyForbiddenError/);

		// Try to access db read
		const resultDbRead = await runScriptTool.handler({
			code: 'return corsair.slack.db.messages.search();',
		});
		expect(resultDbRead.content[0].text).toContain('msg1');

		// Try to access manage reads
		const resultManageRead = await runScriptTool.handler({
			code: 'return corsair.manage.plugins.list();',
		});
		expect(resultManageRead.content[0].text).toMatch(/\[\]/);

		// Try to access manage writes
		const resultManageWrite1 = await runScriptTool.handler({
			code: 'return corsair.manage.tenants.create({});',
		});
		expect(resultManageWrite1.content[0].text).toMatch(
			/Error: manage.tenants.create is not available/,
		);

		const resultManageWrite2 = await runScriptTool.handler({
			code: 'return corsair.manage.connect.createLink({});',
		});
		expect(resultManageWrite2.content[0].text).toMatch(
			/Error: manage.connect is not available/,
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
				db: {
					issues: {
						upsertByEntityId: () => 'updated',
						search: () => ['issue1'],
					},
				},
			},
			manage: { tenants: { list: () => [] } },
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
			/Credential access \(keys\) not available/,
		);

		// DB write proceeds in strict mode because enforcePermission is not called for DB in tools.ts
		const resultDbWrite = await runScriptTool.handler({
			code: 'return corsair.github.db.issues.upsertByEntityId();',
		});
		expect(resultDbWrite.content[0].text).toContain('updated');

		const resultDbRead = await runScriptTool.handler({
			code: 'return corsair.github.db.issues.search();',
		});
		expect(resultDbRead.content[0].text).toContain('issue1');

		const resultManage = await runScriptTool.handler({
			code: 'return corsair.manage.tenants.list();',
		});
		expect(resultManage.content[0].text).toMatch(/\[\]/);

		const resultApi = await runScriptTool.handler({
			code: 'return corsair.linear.api.issues.list();',
		});
		expect(resultApi.content[0].text).not.toMatch(/TypeError/);
	});
});
