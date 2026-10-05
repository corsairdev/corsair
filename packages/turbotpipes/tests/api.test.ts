import { request } from 'corsair/http';
import { makeTurbotPipesRequest, TurbotPipesAPIError } from '../client';
import {
	ActorEndpoints,
	AiEndpoints,
	AuthEndpoints,
	BillingEndpoints,
	ConnectionsEndpoints,
	DatatanksEndpoints,
	IdentitiesEndpoints,
	IntegrationsEndpoints,
	ModsEndpoints,
	NotifiersEndpoints,
	OrgsEndpoints,
	PipelinesEndpoints,
	QueryEndpoints,
	TenantsEndpoints,
	UsersEndpoints,
} from '../endpoints';
import { errorHandlers } from '../error-handlers';
import { turbotpipes } from '../index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

const createMockContext = () => ({
	key: 'tpt_test_token_12345',
	authType: 'api_key' as const,
	schema: {} as any,
	options: {} as any,
	$getAccountId: jest.fn().mockResolvedValue('acc_1'),
	keys: {
		get_api_key: jest.fn().mockResolvedValue('tpt_test_token_12345'),
		get_access_token: jest.fn(),
		get_webhook_signature: jest.fn(),
	},
});

describe('TurbotPipes Plugin Integration & API Tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Plugin Construction & Metadata', () => {
		it('instantiates plugin correctly', () => {
			const plugin = turbotpipes({ key: 'tpt_test_token' });
			expect(plugin.id).toBe('turbotpipes');
			expect(plugin.options?.key).toBe('tpt_test_token');
			expect(plugin.endpoints).toBeDefined();
			expect(plugin.endpointSchemas).toBeDefined();
			expect(plugin.endpointMeta).toBeDefined();
		});

		it('keyBuilder builds endpoint key correctly', async () => {
			const plugin = turbotpipes();
			const ctx = createMockContext();
			const key = await plugin.keyBuilder!(ctx as any, 'endpoint');
			expect(key).toBe('tpt_test_token_12345');
			expect(ctx.keys.get_api_key).toHaveBeenCalled();
		});
	});

	describe('Client Utility makeTurbotPipesRequest', () => {
		it('sends correct Authorization header and URL', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'u_123', handle: 'testuser' });
			const result = await makeTurbotPipesRequest<any>('actor', 'tpt_abc123', {
				method: 'GET',
			});
			expect(result).toEqual({ id: 'u_123', handle: 'testuser' });
			expect(mockRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					BASE: 'https://pipes.turbot.com/api/v1',
					HEADERS: expect.objectContaining({
						Authorization: 'Bearer tpt_abc123',
					}),
				}),
				expect.objectContaining({
					method: 'GET',
					url: 'actor',
				}),
			);
		});

		it('wraps errors in TurbotPipesAPIError', async () => {
			mockRequest.mockRejectedValueOnce(new Error('Network failure'));
			await expect(
				makeTurbotPipesRequest('actor', 'tpt_abc123'),
			).rejects.toThrow(TurbotPipesAPIError);
		});
	});

	describe('Actor Endpoints', () => {
		it('actorGet calls getActor endpoint', async () => {
			const mockActor = { id: 'a_1', handle: 'alice', type: 'user' };
			mockRequest.mockResolvedValueOnce(mockActor);
			const ctx = createMockContext();
			const res = await ActorEndpoints.getActor(ctx as any, {});
			expect(res).toEqual(mockActor);
			expect(mockRequest).toHaveBeenCalled();
		});

		it('actorListWorkspaces returns workspaces list', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'w_1', handle: 'dev' }],
			});
			const ctx = createMockContext();
			const res = await ActorEndpoints.listActorWorkspaces(ctx as any, {
				limit: 10,
			});
			expect(res.items.length).toBe(1);
		});

		it('actorListOrgs returns orgs list', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'o_1', handle: 'myorg' }],
			});
			const ctx = createMockContext();
			const res = await ActorEndpoints.listActorOrgs(ctx as any, {});
			expect(res.items.length).toBe(1);
		});

		it('actorListConnections returns connections list', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'c_1', handle: 'aws' }],
			});
			const ctx = createMockContext();
			const res = await ActorEndpoints.listActorConnections(ctx as any, {});
			expect(res.items.length).toBe(1);
		});

		it('actorListActivity returns activity list', async () => {
			mockRequest.mockResolvedValueOnce({ items: [{ id: 'act_1' }] });
			const ctx = createMockContext();
			const res = await ActorEndpoints.listActorActivity(ctx as any, {});
			expect(res.items.length).toBe(1);
		});
	});

	describe('Users Endpoints', () => {
		it('getUser calls user get endpoint', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'u_1', handle: 'bob' });
			const ctx = createMockContext();
			const res = await UsersEndpoints.getUser(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.handle).toBe('bob');
		});

		it('updateUser updates user details', async () => {
			mockRequest.mockResolvedValueOnce({
				id: 'u_1',
				handle: 'bob',
				display_name: 'Bob Smith',
			});
			const ctx = createMockContext();
			const res = await UsersEndpoints.updateUser(ctx as any, {
				user_handle: 'bob',
				display_name: 'Bob Smith',
			});
			expect(res.display_name).toBe('Bob Smith');
		});

		it('listUserWorkspaces lists user workspaces', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'w_1', handle: 'prod' }],
			});
			const ctx = createMockContext();
			const res = await UsersEndpoints.listUserWorkspaces(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.items.length).toBe(1);
		});

		it('getUserWorkspace returns workspace details', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'w_1', handle: 'prod' });
			const ctx = createMockContext();
			const res = await UsersEndpoints.getUserWorkspace(ctx as any, {
				user_handle: 'bob',
				workspace_handle: 'prod',
			});
			expect(res.handle).toBe('prod');
		});

		it('updateUserWorkspace updates workspace', async () => {
			mockRequest.mockResolvedValueOnce({
				id: 'w_1',
				handle: 'prod',
				state: 'running',
			});
			const ctx = createMockContext();
			const res = await UsersEndpoints.updateUserWorkspace(ctx as any, {
				user_handle: 'bob',
				workspace_handle: 'prod',
				desired_state: 'running',
			});
			expect(res.state).toBe('running');
		});

		it('runUserWorkspaceCommand sends workspace command', async () => {
			mockRequest.mockResolvedValueOnce({ status: 'started' });
			const ctx = createMockContext();
			const res = await UsersEndpoints.runUserWorkspaceCommand(ctx as any, {
				user_handle: 'bob',
				workspace_handle: 'prod',
				command: 'reboot',
			});
			expect(res.status).toBe('started');
		});

		it('listUserProcesses lists user processes', async () => {
			mockRequest.mockResolvedValueOnce({ items: [{ id: 'p_1' }] });
			const ctx = createMockContext();
			const res = await UsersEndpoints.listUserProcesses(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.items.length).toBe(1);
		});

		it('getUserProcess returns process details', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'p_1', state: 'completed' });
			const ctx = createMockContext();
			const res = await UsersEndpoints.getUserProcess(ctx as any, {
				user_handle: 'bob',
				process_id: 'p_1',
			});
			expect(res.id).toBe('p_1');
		});

		it('listUserUsage lists user usage', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ metric: 'queries', count: 100 }],
			});
			const ctx = createMockContext();
			const res = await UsersEndpoints.listUserUsage(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.items.length).toBe(1);
		});

		it('listUserConstraints lists constraints', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ type: 'rate_limit', value: 100 }],
			});
			const ctx = createMockContext();
			const res = await UsersEndpoints.listUserConstraints(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.items.length).toBe(1);
		});

		it('listUserAuditLogs lists audit logs', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'log_1', action: 'login' }],
			});
			const ctx = createMockContext();
			const res = await UsersEndpoints.listUserAuditLogs(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.items.length).toBe(1);
		});

		it('getUserEmail returns email details', async () => {
			mockRequest.mockResolvedValueOnce({
				email: 'bob@example.com',
				verified: true,
			});
			const ctx = createMockContext();
			const res = await UsersEndpoints.getUserEmail(ctx as any, {
				user_handle: 'bob',
				email_id: 'em_1',
			});
			expect(res.email).toBe('bob@example.com');
		});

		it('listUserEmails lists user emails', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ email: 'bob@example.com' }],
			});
			const ctx = createMockContext();
			const res = await UsersEndpoints.listUserEmails(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.items.length).toBe(1);
		});

		it('getUserPreferences returns preferences', async () => {
			mockRequest.mockResolvedValueOnce({
				email_subscriptions: { updates: true },
			});
			const ctx = createMockContext();
			const res = await UsersEndpoints.getUserPreferences(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.email_subscriptions).toBeDefined();
		});

		it('updateUserPreferences updates preferences', async () => {
			mockRequest.mockResolvedValueOnce({
				email_subscriptions: { updates: false },
			});
			const ctx = createMockContext();
			const res = await UsersEndpoints.updateUserPreferences(ctx as any, {
				user_handle: 'bob',
				email_subscriptions: { updates: false },
			});
			expect(res.email_subscriptions).toBeDefined();
		});

		it('deleteUserAvatar deletes user avatar', async () => {
			mockRequest.mockResolvedValueOnce({ success: true });
			const ctx = createMockContext();
			const res = await UsersEndpoints.deleteUserAvatar(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.success).toBe(true);
		});
	});

	describe('Orgs Endpoints', () => {
		it('getOrg returns org details', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'o_1', handle: 'acme' });
			const ctx = createMockContext();
			const res = await OrgsEndpoints.getOrg(ctx as any, {
				org_handle: 'acme',
			});
			expect(res.handle).toBe('acme');
		});

		it('deleteOrg deletes organization', async () => {
			mockRequest.mockResolvedValueOnce({ success: true });
			const ctx = createMockContext();
			const res = await OrgsEndpoints.deleteOrg(ctx as any, {
				org_handle: 'acme',
			});
			expect(res.success).toBe(true);
		});

		it('listOrgWorkspaces lists org workspaces', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'w_1', handle: 'main' }],
			});
			const ctx = createMockContext();
			const res = await OrgsEndpoints.listOrgWorkspaces(ctx as any, {
				org_handle: 'acme',
			});
			expect(res.items.length).toBe(1);
		});

		it('deleteOrgWorkspace deletes workspace', async () => {
			mockRequest.mockResolvedValueOnce({ success: true });
			const ctx = createMockContext();
			const res = await OrgsEndpoints.deleteOrgWorkspace(ctx as any, {
				org_handle: 'acme',
				workspace_handle: 'main',
			});
			expect(res.success).toBe(true);
		});

		it('runOrgWorkspaceCommand runs command on org workspace', async () => {
			mockRequest.mockResolvedValueOnce({ status: 'completed' });
			const ctx = createMockContext();
			const res = await OrgsEndpoints.runOrgWorkspaceCommand(ctx as any, {
				org_handle: 'acme',
				workspace_handle: 'main',
				command: 'reboot',
			});
			expect(res.status).toBe('completed');
		});

		it('listOrgProcesses lists org processes', async () => {
			mockRequest.mockResolvedValueOnce({ items: [{ id: 'p_1' }] });
			const ctx = createMockContext();
			const res = await OrgsEndpoints.listOrgProcesses(ctx as any, {
				org_handle: 'acme',
			});
			expect(res.items.length).toBe(1);
		});

		it('listOrgServiceAccounts lists service accounts', async () => {
			mockRequest.mockResolvedValueOnce({ items: [{ handle: 'sa_1' }] });
			const ctx = createMockContext();
			const res = await OrgsEndpoints.listOrgServiceAccounts(ctx as any, {
				org_handle: 'acme',
			});
			expect(res.items.length).toBe(1);
		});

		it('updateOrgServiceAccount updates service account', async () => {
			mockRequest.mockResolvedValueOnce({ handle: 'sa_1', title: 'New Title' });
			const ctx = createMockContext();
			const res = await OrgsEndpoints.updateOrgServiceAccount(ctx as any, {
				org_handle: 'acme',
				service_account_handle: 'sa_1',
				title: 'New Title',
			});
			expect(res.handle).toBe('sa_1');
		});

		it('updateOrgServiceAccountToken updates token status', async () => {
			mockRequest.mockResolvedValueOnce({ id: 't_1', status: 'active' });
			const ctx = createMockContext();
			const res = await OrgsEndpoints.updateOrgServiceAccountToken(ctx as any, {
				org_handle: 'acme',
				service_account_handle: 'sa_1',
				token_id: 't_1',
				status: 'active',
			});
			expect(res.id).toBe('t_1');
		});

		it('getOrgMember returns member details', async () => {
			mockRequest.mockResolvedValueOnce({
				user_handle: 'alice',
				role: 'owner',
			});
			const ctx = createMockContext();
			const res = await OrgsEndpoints.getOrgMember(ctx as any, {
				org_handle: 'acme',
				user_handle: 'alice',
			});
			expect(res.user_handle).toBe('alice');
		});

		it('updateOrgMemberRole updates member role', async () => {
			mockRequest.mockResolvedValueOnce({
				user_handle: 'alice',
				role: 'member',
			});
			const ctx = createMockContext();
			const res = await OrgsEndpoints.updateOrgMemberRole(ctx as any, {
				org_handle: 'acme',
				user_handle: 'alice',
				role: 'member',
			});
			expect(res.role).toBe('member');
		});

		it('listOrgUsage lists org usage metrics', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ metric: 'db_size', count: 500 }],
			});
			const ctx = createMockContext();
			const res = await OrgsEndpoints.listOrgUsage(ctx as any, {
				org_handle: 'acme',
			});
			expect(res.items.length).toBe(1);
		});
	});

	describe('Connections Endpoints', () => {
		it('createUserConnection creates connection', async () => {
			mockRequest.mockResolvedValueOnce({
				id: 'c_1',
				handle: 'my_aws',
				plugin: 'aws',
			});
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.createUserConnection(ctx as any, {
				user_handle: 'bob',
				handle: 'my_aws',
				plugin: 'aws',
			});
			expect(res.handle).toBe('my_aws');
		});

		it('getUserConnection retrieves user connection', async () => {
			mockRequest.mockResolvedValueOnce({
				id: 'c_1',
				handle: 'my_aws',
				plugin: 'aws',
			});
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.getUserConnection(ctx as any, {
				user_handle: 'bob',
				connection_handle: 'my_aws',
			});
			expect(res.handle).toBe('my_aws');
		});

		it('listUserConnections lists user connections', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'c_1', handle: 'my_aws' }],
			});
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.listUserConnections(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.items.length).toBe(1);
		});

		it('updateUserConnection updates connection', async () => {
			mockRequest.mockResolvedValueOnce({
				id: 'c_1',
				handle: 'my_aws_updated',
			});
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.updateUserConnection(ctx as any, {
				user_handle: 'bob',
				connection_handle: 'my_aws',
				handle: 'my_aws_updated',
			});
			expect(res.handle).toBe('my_aws_updated');
		});

		it('deleteUserConnectionDeprecated deletes connection', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'c_1', handle: 'my_aws' });
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.deleteUserConnectionDeprecated(
				ctx as any,
				{ user_handle: 'bob', connection_handle: 'my_aws' },
			);
			expect(res.handle).toBe('my_aws');
		});

		it('testUserConnection tests connection config', async () => {
			mockRequest.mockResolvedValueOnce({ valid: true });
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.testUserConnection(ctx as any, {
				user_handle: 'bob',
				plugin: 'aws',
				config: { region: 'us-east-1' },
			});
			expect(res.valid).toBe(true);
		});

		it('createOrgConnection creates connection for org', async () => {
			mockRequest.mockResolvedValueOnce({
				id: 'c_2',
				handle: 'org_gcp',
				plugin: 'gcp',
			});
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.createOrgConnection(ctx as any, {
				org_handle: 'acme',
				handle: 'org_gcp',
				plugin: 'gcp',
			});
			expect(res.handle).toBe('org_gcp');
		});

		it('updateOrgConnection updates org connection', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'c_2', handle: 'org_gcp' });
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.updateOrgConnection(ctx as any, {
				org_handle: 'acme',
				connection_handle: 'org_gcp',
			});
			expect(res.handle).toBe('org_gcp');
		});

		it('getOrgConnectionPermission gets connection permission', async () => {
			mockRequest.mockResolvedValueOnce({ permission: 'read' });
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.getOrgConnectionPermission(
				ctx as any,
				{ org_handle: 'acme', connection_handle: 'org_gcp' },
			);
			expect(res.permission).toBe('read');
		});

		it('deleteOrgConnectionPermission deletes connection permission', async () => {
			mockRequest.mockResolvedValueOnce({ success: true });
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.deleteOrgConnectionPermission(
				ctx as any,
				{ org_handle: 'acme', connection_handle: 'org_gcp' },
			);
			expect(res.success).toBe(true);
		});

		it('createOrgConnectionFolder creates connection folder', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'f_1', title: 'Cloud Accounts' });
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.createOrgConnectionFolder(
				ctx as any,
				{ org_handle: 'acme', title: 'Cloud Accounts' },
			);
			expect(res.title).toBe('Cloud Accounts');
		});

		it('updateOrgConnectionFolder updates connection folder', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'f_1', title: 'Cloud Infra' });
			const ctx = createMockContext();
			const res = await ConnectionsEndpoints.updateOrgConnectionFolder(
				ctx as any,
				{ org_handle: 'acme', folder_id: 'f_1', title: 'Cloud Infra' },
			);
			expect(res.title).toBe('Cloud Infra');
		});
	});

	describe('Query & Snapshot Endpoints', () => {
		it('createOrgWorkspaceQuery executes query in org workspace', async () => {
			mockRequest.mockResolvedValueOnce({ rows: [{ count: 42 }] });
			const ctx = createMockContext();
			const res = await QueryEndpoints.createOrgWorkspaceQuery(ctx as any, {
				org_handle: 'acme',
				workspace_handle: 'main',
				sql: 'select count(*) from aws_s3_bucket',
			});
			expect(res.rows).toBeDefined();
		});

		it('getOrgWorkspaceQueryData retrieves query data', async () => {
			mockRequest.mockResolvedValueOnce({ rows: [{ id: 1 }] });
			const ctx = createMockContext();
			const res = await QueryEndpoints.getOrgWorkspaceQueryData(ctx as any, {
				org_handle: 'acme',
				workspace_handle: 'main',
				sql: 'select 1',
			});
			expect(res.rows).toBeDefined();
		});

		it('createOrgWorkspaceSnapshot creates a snapshot', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'snap_1' });
			const ctx = createMockContext();
			const res = await QueryEndpoints.createOrgWorkspaceSnapshot(ctx as any, {
				org_handle: 'acme',
				workspace_handle: 'main',
				title: 'Weekly Backup',
			});
			expect(res.id).toBe('snap_1');
		});

		it('runUserWorkspaceQuery runs user SQL query', async () => {
			mockRequest.mockResolvedValueOnce({ rows: [{ name: 'test' }] });
			const ctx = createMockContext();
			const res = await QueryEndpoints.runUserWorkspaceQuery(ctx as any, {
				user_handle: 'bob',
				workspace_handle: 'dev',
				sql: 'select name from user',
			});
			expect(res.rows).toBeDefined();
		});

		it('listUserWorkspaceSnapshots lists snapshots', async () => {
			mockRequest.mockResolvedValueOnce({ items: [{ id: 'snap_1' }] });
			const ctx = createMockContext();
			const res = await QueryEndpoints.listUserWorkspaceSnapshots(ctx as any, {
				user_handle: 'bob',
				workspace_handle: 'dev',
			});
			expect(res.items.length).toBe(1);
		});
	});

	describe('AI & Chat Endpoints', () => {
		it('createUserAiKey creates an AI API key', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'k_1', provider: 'openai' });
			const ctx = createMockContext();
			const res = await AiEndpoints.createUserAiKey(ctx as any, {
				user_handle: 'bob',
				provider: 'openai',
				key: 'sk-123',
			});
			expect(res.provider).toBe('openai');
		});

		it('listUserAiKeys lists user AI keys', async () => {
			mockRequest.mockResolvedValueOnce({
				items: [{ id: 'k_1', provider: 'openai' }],
			});
			const ctx = createMockContext();
			const res = await AiEndpoints.listUserAiKeys(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.items.length).toBe(1);
		});

		it('sendUserWorkspaceChatMessage sends message to AI', async () => {
			mockRequest.mockResolvedValueOnce({
				conversation_id: 'conv_1',
				response: 'Hello!',
			});
			const ctx = createMockContext();
			const res = await AiEndpoints.sendUserWorkspaceChatMessage(ctx as any, {
				user_handle: 'bob',
				workspace_handle: 'dev',
				message: 'Hi AI',
			});
			expect(res.response).toBe('Hello!');
		});
	});

	describe('Integrations & Notifiers & Datatanks Endpoints', () => {
		it('createUserIntegration creates user integration', async () => {
			mockRequest.mockResolvedValueOnce({ handle: 'my_slack', type: 'slack' });
			const ctx = createMockContext();
			const res = await IntegrationsEndpoints.createUserIntegration(
				ctx as any,
				{ user_handle: 'bob', integration_handle: 'my_slack', type: 'slack' },
			);
			expect(res.handle).toBe('my_slack');
		});

		it('createUserNotifier creates user notifier', async () => {
			mockRequest.mockResolvedValueOnce({ handle: 'email_notif' });
			const ctx = createMockContext();
			const res = await NotifiersEndpoints.createUserNotifier(ctx as any, {
				user_handle: 'bob',
				handle: 'email_notif',
				type: 'email',
			});
			expect(res.handle).toBe('email_notif');
		});

		it('createUserWorkspaceDatatank creates Datatank', async () => {
			mockRequest.mockResolvedValueOnce({ id: 'dt_1', handle: 'logs_tank' });
			const ctx = createMockContext();
			const res = await DatatanksEndpoints.createUserWorkspaceDatatank(
				ctx as any,
				{ user_handle: 'bob', workspace_handle: 'dev', handle: 'logs_tank' },
			);
			expect(res.handle).toBe('logs_tank');
		});
	});

	describe('Mods & Pipelines & Billing Endpoints', () => {
		it('installUserWorkspaceMod installs mod', async () => {
			mockRequest.mockResolvedValueOnce({ alias: 'aws' });
			const ctx = createMockContext();
			const res = await ModsEndpoints.installUserWorkspaceMod(ctx as any, {
				user_handle: 'bob',
				workspace_handle: 'dev',
				path: 'turbot/aws',
			});
			expect(res.alias).toBe('aws');
		});

		it('listUserWorkspacePipelines lists pipelines', async () => {
			mockRequest.mockResolvedValueOnce({ items: [{ id: 'pipe_1' }] });
			const ctx = createMockContext();
			const res = await PipelinesEndpoints.listUserWorkspacePipelines(
				ctx as any,
				{ user_handle: 'bob', workspace_handle: 'dev' },
			);
			expect(res.items.length).toBe(1);
		});

		it('getUserBillingPlan gets user billing plan', async () => {
			mockRequest.mockResolvedValueOnce({ plan: 'pro' });
			const ctx = createMockContext();
			const res = await BillingEndpoints.getUserBillingPlan(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.plan).toBe('pro');
		});
	});

	describe('Auth, Tenants & Identities Endpoints', () => {
		it('getUserPassword gets password status', async () => {
			mockRequest.mockResolvedValueOnce({ password_set: true });
			const ctx = createMockContext();
			const res = await AuthEndpoints.getUserPassword(ctx as any, {
				user_handle: 'bob',
			});
			expect(res.password_set).toBe(true);
		});

		it('getTenant gets tenant information', async () => {
			mockRequest.mockResolvedValueOnce({ handle: 'tenant_1' });
			const ctx = createMockContext();
			const res = await TenantsEndpoints.getTenant(ctx as any, {
				tenant_handle: 'tenant_1',
			});
			expect(res.handle).toBe('tenant_1');
		});

		it('getIdentity gets identity information', async () => {
			mockRequest.mockResolvedValueOnce({ handle: 'id_1' });
			const ctx = createMockContext();
			const res = await IdentitiesEndpoints.getIdentity(ctx as any, {
				identity_handle: 'id_1',
			});
			expect(res.handle).toBe('id_1');
		});
	});

	describe('Error Handlers', () => {
		it('matches 429 rate limit error', () => {
			const err = new Error('HTTP 429 Too Many Requests');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		});

		it('matches 401 auth error', () => {
			const err = new Error('HTTP 401 Unauthorized');
			expect(errorHandlers.AUTH_ERROR.match(err)).toBe(true);
		});

		it('matches 404 not found error', () => {
			const err = new Error('HTTP 404 Not Found');
			expect(errorHandlers.NOT_FOUND_ERROR.match(err)).toBe(true);
		});

		it('matches 400 validation error', () => {
			const err = new Error('HTTP 400 Bad Request');
			expect(errorHandlers.VALIDATION_ERROR.match(err)).toBe(true);
		});

		it('matches 500 server error', () => {
			const err = new Error('HTTP 500 Internal Server Error');
			expect(errorHandlers.SERVER_ERROR.match(err)).toBe(true);
		});
	});
});
