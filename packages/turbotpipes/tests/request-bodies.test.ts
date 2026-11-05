import { pipesApi as api, useFakePipes } from './fake-pipes';

const pipes = useFakePipes();

// Body each route requires per the Pipes OpenAPI document, and the call that
// must produce it.
const SNAPSHOT_DATA = {
	schema_version: '20240607',
	start_time: '2026-11-05T00:00:00Z',
	end_time: '2026-11-05T00:00:05Z',
	layout: { name: 'aws.dashboard.cost', panel_type: 'dashboard' },
	panels: {},
};

describe('create and update bodies carry the fields Pipes requires', () => {
	it('datatank table: name and type', async () => {
		pipes.answers['POST /api/v1/user/bob/workspace/dev/datatank/tank/table'] = {
			body: { id: 'tbl_1' },
		};
		await api().datatanks.createUserWorkspaceDatatankTable({
			user_handle: 'bob',
			workspace_handle: 'dev',
			datatank_handle: 'tank',
			name: 'aws_buckets',
			type: 'table',
			source_schema: 'aws',
			source_table: 'aws_s3_bucket',
			frequency: { type: 'interval', schedule: 'daily' },
		});
		expect(pipes.sent[0]?.body).toEqual({
			name: 'aws_buckets',
			type: 'table',
			source_schema: 'aws',
			source_table: 'aws_s3_bucket',
			frequency: { type: 'interval', schedule: 'daily' },
		});
	});

	it('integration: handle and type', async () => {
		pipes.answers['POST /api/v1/user/bob/integration'] = {
			body: { id: 'i_1' },
		};
		await api().integrations.createUserIntegration({
			user_handle: 'bob',
			handle: 'my_slack',
			type: 'slack',
		});
		expect(pipes.sent[0]?.body).toEqual({ handle: 'my_slack', type: 'slack' });
	});

	it('mod variable setting: name and setting', async () => {
		pipes.answers['POST /api/v1/user/bob/workspace/dev/mod/aws/variable'] = {
			body: { name: 'regions' },
		};
		await api().mods.createUserWorkspaceModVariableSetting({
			user_handle: 'bob',
			workspace_handle: 'dev',
			mod_alias: 'aws',
			variable_name: 'regions',
			value: ['us-east-1'],
		});
		expect(pipes.sent[0]?.body).toEqual({
			name: 'regions',
			setting: ['us-east-1'],
		});
	});

	it('notifiers: name and notifies', async () => {
		pipes.answers['POST /api/v1/user/bob/notifier'] = { body: { id: 'n_1' } };
		pipes.answers['POST /api/v1/user/bob/workspace/dev/notifier'] = {
			body: { id: 'n_2' },
		};
		const notifies = [{ integration: 'my_slack', channel: '#ops' }];
		await api().notifiers.createUserNotifier({
			user_handle: 'bob',
			name: 'ops',
			notifies,
		});
		await api().notifiers.createUserWorkspaceNotifier({
			user_handle: 'bob',
			workspace_handle: 'dev',
			name: 'ops',
			notifies,
			state: 'enabled',
		});
		expect(pipes.sent.map((s) => s.body)).toEqual([
			{ name: 'ops', notifies },
			{ name: 'ops', notifies, state: 'enabled' },
		]);
	});

	it('snapshot: data', async () => {
		pipes.answers['POST /api/v1/org/acme/workspace/main/snapshot'] = {
			body: { id: 'snap_1' },
		};
		await api().query.createOrgWorkspaceSnapshot({
			org_handle: 'acme',
			workspace_handle: 'main',
			data: SNAPSHOT_DATA,
			visibility: 'workspace',
		});
		expect(pipes.sent[0]?.body).toEqual({
			data: SNAPSHOT_DATA,
			visibility: 'workspace',
		});
	});

	it('aggregator: plugin', async () => {
		pipes.answers['POST /api/v1/org/acme/workspace/main/aggregator'] = {
			body: { id: 'a_1' },
		};
		await api().workspaces.createOrgWorkspaceAggregator({
			org_handle: 'acme',
			workspace_handle: 'main',
			handle: 'aws_all',
			plugin: 'aws',
			connections: ['aws_*'],
		});
		expect(pipes.sent[0]?.body).toEqual({
			handle: 'aws_all',
			plugin: 'aws',
			connections: ['aws_*'],
		});
	});

	it('workspace connections: handle and plugin', async () => {
		pipes.answers['POST /api/v1/user/bob/workspace/dev/connection'] = {
			body: { id: 'c_1', handle: 'aws_prod' },
		};
		pipes.answers['POST /api/v1/org/acme/workspace/main/connection'] = {
			body: { id: 'c_2', handle: 'aws_prod' },
		};
		await api().workspaces.createUserWorkspaceConnection({
			user_handle: 'bob',
			workspace_handle: 'dev',
			handle: 'aws_prod',
			plugin: 'aws',
			config: { regions: ['*'] },
		});
		await api().workspaces.createOrgWorkspaceConnection({
			org_handle: 'acme',
			workspace_handle: 'main',
			handle: 'aws_prod',
			plugin: 'aws',
		});
		expect(pipes.sent.map((s) => s.body)).toEqual([
			{ handle: 'aws_prod', plugin: 'aws', config: { regions: ['*'] } },
			{ handle: 'aws_prod', plugin: 'aws' },
		]);
	});

	it('workspace connection test: sends plugin and config', async () => {
		pipes.answers[
			'POST /api/v1/user/bob/workspace/dev/connection/aws_prod/test'
		] = { body: { state: 'ok' } };
		await api().workspaces.testUserWorkspaceConnection({
			user_handle: 'bob',
			workspace_handle: 'dev',
			connection_handle: 'aws_prod',
			plugin: 'aws',
			config: { regions: ['us-east-1'] },
		});
		expect(pipes.sent[0]?.body).toEqual({
			plugin: 'aws',
			config: { regions: ['us-east-1'] },
		});
	});

	it('token updates: status', async () => {
		pipes.answers[
			'PATCH /api/v1/org/acme/service_account/ci/token/t_0123456789abcdefghij'
		] = { body: { id: 't_0123456789abcdefghij' } };
		pipes.answers['PATCH /api/v1/user/bob/token/t_0123456789abcdefghij'] = {
			body: { id: 't_0123456789abcdefghij' },
		};
		await api().orgs.updateServiceAccountToken({
			org_handle: 'acme',
			service_account_handle: 'ci',
			token_id: 't_0123456789abcdefghij',
			status: 'inactive',
		});
		await api().auth.updateUserToken({
			user_handle: 'bob',
			token_id: 't_0123456789abcdefghij',
			status: 'inactive',
			title: 'old laptop',
		});
		expect(pipes.sent.map((s) => s.body)).toEqual([
			{ status: 'inactive' },
			{ status: 'inactive', title: 'old laptop' },
		]);
	});

	it('AI keys: the key is sent as api_key', async () => {
		pipes.answers['POST /api/v1/user/bob/ai/key'] = { body: { id: 'k_1' } };
		pipes.answers['PATCH /api/v1/user/bob/ai/key/openai'] = {
			body: { id: 'k_1' },
		};
		await api().ai.createUserAiKey({
			user_handle: 'bob',
			provider: 'openai',
			key: 'sk-test',
		});
		await api().ai.updateUserAiKey({
			user_handle: 'bob',
			provider: 'openai',
			key: 'sk-test-2',
		});
		expect(pipes.sent.map((s) => s.body)).toEqual([
			{ provider: 'openai', api_key: 'sk-test' },
			{ api_key: 'sk-test-2' },
		]);
	});
});

describe('missing required fields are rejected before any request', () => {
	// as is necessary: each call deliberately omits a field its type requires.
	const cases: Array<[string, string, () => Promise<unknown>]> = [
		[
			'datatank table type',
			'type',
			() =>
				api().datatanks.createUserWorkspaceDatatankTable({
					user_handle: 'bob',
					workspace_handle: 'dev',
					datatank_handle: 'tank',
					name: 'aws_buckets',
				} as never),
		],
		[
			'integration handle',
			'handle',
			() =>
				api().integrations.createUserIntegration({
					user_handle: 'bob',
					type: 'slack',
				} as never),
		],
		[
			'mod variable value',
			'value',
			() =>
				api().mods.createUserWorkspaceModVariableSetting({
					user_handle: 'bob',
					workspace_handle: 'dev',
					mod_alias: 'aws',
					variable_name: 'regions',
				} as never),
		],
		[
			'notifier notifies',
			'notifies',
			() =>
				api().notifiers.createUserNotifier({
					user_handle: 'bob',
					name: 'ops',
				} as never),
		],
		[
			'snapshot data',
			'data',
			() =>
				api().query.createOrgWorkspaceSnapshot({
					org_handle: 'acme',
					workspace_handle: 'main',
					title: 'Weekly',
				} as never),
		],
		[
			'aggregator plugin',
			'plugin',
			() =>
				api().workspaces.createOrgWorkspaceAggregator({
					org_handle: 'acme',
					workspace_handle: 'main',
					handle: 'aws_all',
				} as never),
		],
		[
			'workspace connection plugin',
			'plugin',
			() =>
				api().workspaces.createUserWorkspaceConnection({
					user_handle: 'bob',
					workspace_handle: 'dev',
					handle: 'aws_prod',
				} as never),
		],
		[
			'connection test plugin',
			'plugin',
			() =>
				api().workspaces.testUserWorkspaceConnection({
					user_handle: 'bob',
					workspace_handle: 'dev',
					connection_handle: 'aws_prod',
				} as never),
		],
		[
			'service account token status',
			'status',
			() =>
				api().orgs.updateServiceAccountToken({
					org_handle: 'acme',
					service_account_handle: 'ci',
					token_id: 't_1',
				} as never),
		],
	];

	it.each(cases)('%s', async (_label, field, call) => {
		await expect(call()).rejects.toThrow(new RegExp(`"${field}"`));
		expect(pipes.sent).toHaveLength(0);
	});
});
