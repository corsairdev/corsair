import { DatabricksAPIError, makeDatabricksRequest } from './client';
import { databricks } from './index';
import { matchDatabricksTenantWebhook } from './webhooks/tenant-matcher';
import { verifyDatabricksWebhookSignature } from './webhooks/types';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeDatabricksRequest: jest.fn(
			async (endpoint: string, _apiKey: string, options: any) => {
				if (endpoint.includes('dbfs')) {
					if (endpoint.includes('create')) return { handle: 101 };
					return { success: true };
				}
				if (endpoint.includes('global-init-scripts')) {
					if (options.method === 'POST') return { script_id: 's-123' };
					return { success: true };
				}
				if (
					endpoint.includes('clusters') ||
					endpoint.includes('policies/clusters') ||
					endpoint.includes('instance-pools') ||
					endpoint.includes('instance-profiles')
				) {
					if (endpoint.includes('create')) {
						return {
							cluster_id: 'c-123',
							policy_id: 'p-123',
							instance_pool_id: 'ip-123',
						};
					}
					return { success: true };
				}
				if (
					endpoint.includes('scim') ||
					endpoint.includes('groups') ||
					endpoint.includes('ip-access-lists')
				) {
					if (endpoint.includes('Groups'))
						return { id: 'g-123', displayName: 'Eng' };
					if (endpoint.includes('ServicePrincipals'))
						return { id: 'sp-123', applicationId: 'app-123' };
					if (endpoint.includes('Users'))
						return {
							id: 'u-123',
							userName: options.body?.userName ?? 'dev@company.com',
						};
					if (endpoint.includes('ip-access-lists'))
						return { ip_access_list: { list_id: 'ip-123' } };
					return { success: true };
				}
				if (endpoint.includes('unity-catalog')) {
					if (endpoint.includes('metastores')) return { metastore_id: 'm-123' };
					if (endpoint.includes('connections')) return { name: 'conn-123' };
					if (
						endpoint.includes('credentials') ||
						endpoint.includes('storage-credentials') ||
						endpoint.includes('external-locations')
					)
						return { name: 'res-123' };
					if (endpoint.includes('access-requests')) return { responses: [] };
					if (endpoint.includes('tables')) return { name: 'table-123' };
					if (endpoint.includes('shares')) return { name: 'share-123' };
					if (endpoint.includes('providers')) return { name: 'prov-123' };
					if (endpoint.includes('recipients')) return { name: 'recip-123' };
					return { success: true };
				}
				if (endpoint.includes('marketplace')) {
					if (endpoint.includes('consumer/listings/batch-get'))
						return { listings: [{ id: 'l-1' }] };
					if (endpoint.includes('consumer/providers/batch-get'))
						return { providers: [{ id: 'p-1' }] };
					if (endpoint.includes('installations')) return { id: 'inst-123' };
					if (endpoint.includes('listings')) return { id: 'list-123' };
					if (endpoint.includes('analytics-dashboards'))
						return { dashboard_id: 'dash-123' };
					return { success: true };
				}
				if (endpoint.includes('jobs')) {
					return { success: true };
				}
				if (endpoint.includes('sql') || endpoint.includes('preview/sql')) {
					if (endpoint.includes('statements')) return { status: 'SUCCEEDED' };
					return { id: 'sql-123', success: true };
				}
				if (endpoint.includes('clean-rooms')) {
					return { name: 'cr-123', status: 'ACTIVE', rule_id: 'r-123' };
				}
				if (endpoint.includes('quality-monitors')) {
					return { monitor_id: 'qm-123' };
				}
				if (endpoint.includes('database')) {
					return { name: 'db-123', status: 'AVAILABLE' };
				}
				if (endpoint.includes('apps')) {
					return { name: 'app-123', deployment_id: 'dep-123' };
				}
				if (endpoint.includes('genie') || endpoint.includes('lakeview')) {
					return {
						space_id: 'sp-123',
						message_id: 'msg-123',
						dashboard_id: 'd-123',
						status: 'COMPLETED',
					};
				}
				if (
					endpoint.includes('mlflow') ||
					endpoint.includes('automl') ||
					endpoint.includes('feature-store')
				) {
					return {
						model_id: 'm-123',
						experiment_id: 'exp-123',
						run_id: 'run-123',
						name: 'store-123',
					};
				}
				if (
					endpoint.includes('token') ||
					endpoint.includes('notification-destinations') ||
					endpoint.includes('secrets') ||
					endpoint.includes('credentials/secrets')
				) {
					return { token_value: 'dapi123', secret_id: 'sec-123', id: 'nd-123' };
				}
				if (
					endpoint.includes('serving-endpoints') ||
					endpoint.includes('vector-search')
				) {
					return { name: 'ep-123' };
				}
				if (endpoint.includes('tag-policies') || endpoint.includes('tags')) {
					return { tag_key: options?.body?.tag_key ?? 'environment' };
				}
				if (
					endpoint.includes('git-credentials') ||
					endpoint.includes('repos')
				) {
					return { credential_id: 1, id: 1 };
				}
				return { success: true, name: 'res-123', id: '123' };
			},
		),
	};
});

describe('Databricks Plugin Comprehensive API Tests', () => {
	const plugin = databricks({
		key: 'test_token',
		host: 'https://acme.cloud.databricks.com',
	});
	const endpoints = plugin.endpoints!;
	const ctx = {
		key: 'test_token',
		authType: 'api_key' as const,
		options: { key: 'test_token', host: 'https://acme.cloud.databricks.com' },
		$getAccountId: () => 'acc_test',
	} as any;

	describe('Host Resolution & Error Metadata', () => {
		it('preserves status and retryAfter on DatabricksAPIError', () => {
			const err = new DatabricksAPIError('Rate limited', 429, 30);
			expect(err.status).toBe(429);
			expect(err.retryAfter).toBe(30);
		});

		it('passes configured workspace host into request client', async () => {
			await endpoints.dbfs.createDbfsFileStream(ctx, { path: '/tmp/test.txt' });
			expect(makeDatabricksRequest).toHaveBeenCalledWith(
				'dbfs/create',
				ctx,
				expect.objectContaining({ method: 'POST' }),
			);
		});
	});

	describe('DBFS Actions', () => {
		it('creates stream, adds block, and deletes file', async () => {
			const stream = await endpoints.dbfs.createDbfsFileStream(ctx, {
				path: '/tmp/test.txt',
			});
			expect(stream.handle).toBe(101);

			const block = await endpoints.dbfs.addBlockToDbfsStream(ctx, {
				handle: 101,
				data: 'SGVsbG8=',
			});
			expect(block.success).toBe(true);

			const del = await endpoints.dbfs.deleteDbfsFileOrDirectory(ctx, {
				path: '/tmp/test.txt',
			});
			expect(del.success).toBe(true);
		});
	});

	describe('Compute Actions', () => {
		it('handles cluster, pool, policy, and init script operations', async () => {
			const cluster = await endpoints.compute.createDatabricksCluster(ctx, {
				cluster_name: 'Test Cluster',
				spark_version: '13.3.x',
				node_type_id: 'i3.xlarge',
			});
			expect(cluster.cluster_id).toBe('c-123');

			const delCluster = await endpoints.compute.deleteDatabricksCluster(ctx, {
				cluster_id: 'c-123',
			});
			expect(delCluster.success).toBe(true);

			const profile = await endpoints.compute.addComputeInstanceProfile(ctx, {
				instance_profile_arn: 'arn:aws:iam::123:instance-profile/role',
			});
			expect(profile.success).toBe(true);

			const pool = await endpoints.compute.createComputeInstancePool(ctx, {
				instance_pool_name: 'Pool 1',
				node_type_id: 'i3.xlarge',
			});
			expect(pool.instance_pool_id).toBe('ip-123');

			const delPool = await endpoints.compute.deleteComputeInstancePool(ctx, {
				instance_pool_id: 'ip-123',
			});
			expect(delPool.success).toBe(true);

			const policy = await endpoints.compute.createComputeClusterPolicy(ctx, {
				name: 'Policy 1',
			});
			expect(policy.policy_id).toBe('p-123');

			const delPolicy = await endpoints.compute.deleteComputeClusterPolicy(
				ctx,
				{ policy_id: 'p-123' },
			);
			expect(delPolicy.success).toBe(true);

			const script = await endpoints.compute.createGlobalInitScript(ctx, {
				name: 'init.sh',
				script: 'ZWNobyAx',
			});
			expect(script.script_id).toBe('s-123');

			const delScript = await endpoints.compute.deleteGlobalInitScript(ctx, {
				script_id: 's-123',
			});
			expect(delScript.success).toBe(true);
		});
	});

	describe('IAM & Security Actions', () => {
		it('manages groups, members, service principals, users, IP access lists', async () => {
			const member = await endpoints.iam.addMemberToSecurityGroup(ctx, {
				group_id: 'g-1',
				member_id: 'u-1',
			});
			expect(member.success).toBe(true);

			const group = await endpoints.iam.createIamGroupV2(ctx, {
				displayName: 'Engineering',
			});
			expect(group.id).toBe('g-123');

			const delGroup = await endpoints.iam.deleteIamGroupV2(ctx, {
				id: 'g-123',
			});
			expect(delGroup.success).toBe(true);

			const sp = await endpoints.iam.createIamServicePrincipalV2(ctx, {
				applicationId: 'app-123',
			});
			expect(sp.applicationId).toBe('app-123');

			const delSp = await endpoints.iam.deleteIamServicePrincipalV2(ctx, {
				id: 'sp-123',
			});
			expect(delSp.success).toBe(true);

			const user = await endpoints.iam.createIamUserV2(ctx, {
				userName: 'dev@company.com',
			});
			expect(user.userName).toBe('dev@company.com');

			const delUser = await endpoints.iam.deleteIamUserV2(ctx, { id: 'u-123' });
			expect(delUser.success).toBe(true);

			const ipList = await endpoints.iam.createIpAccessList(ctx, {
				label: 'Office IP',
				list_type: 'ALLOW',
				ip_addresses: ['1.2.3.4/32'],
			});
			expect(ipList.ip_access_list.list_id).toBe('ip-123');
		});
	});

	describe('Catalog & Unity Catalog Actions', () => {
		it('checks table existence and handles metastores, credentials, connections', async () => {
			const exists = await endpoints.catalog.checkTableExists(ctx, {
				catalog_name: 'main',
				schema_name: 'default',
				table_name: 'events',
			});
			expect(exists.exists).toBe(true);

			const metastore = await endpoints.catalog.createMetastore(ctx, {
				name: 'main_meta',
				storage_root: 's3://bucket/meta',
			});
			expect(metastore.metastore_id).toBe('m-123');

			const assign = await endpoints.catalog.assignMetastoreToWorkspace(ctx, {
				metastore_id: 'm-123',
				workspace_id: 100,
			});
			expect(assign.success).toBe(true);

			const conn = await endpoints.catalog.createCatalogConnection(ctx, {
				name: 'pg_conn',
				connection_type: 'POSTGRESQL',
				options: { host: 'localhost' },
			});
			expect(conn.name).toBe('conn-123');

			const delConn = await endpoints.catalog.deleteCatalogConnection(ctx, {
				name: 'pg_conn',
			});
			expect(delConn.success).toBe(true);

			const cred = await endpoints.catalog.createCatalogCredential(ctx, {
				name: 'aws_cred',
			});
			expect(cred.name).toBe('res-123');

			const delCred = await endpoints.catalog.deleteCatalogCredential(ctx, {
				name: 'aws_cred',
			});
			expect(delCred.success).toBe(true);

			const extLoc = await endpoints.catalog.createExternalLocation(ctx, {
				name: 'ext_s3',
				url: 's3://bucket/data',
				credential_name: 'aws_cred',
			});
			expect(extLoc.name).toBe('res-123');

			const delExtLoc = await endpoints.catalog.deleteExternalLocation(ctx, {
				name: 'ext_s3',
			});
			expect(delExtLoc.success).toBe(true);

			const delCat = await endpoints.catalog.deleteCatalog(ctx, {
				name: 'main',
			});
			expect(delCat.success).toBe(true);

			const delTable = await endpoints.catalog.deleteCatalogTable(ctx, {
				full_name: 'main.default.events',
			});
			expect(delTable.success).toBe(true);

			const delOnline = await endpoints.catalog.deleteOnlineTable(ctx, {
				name: 'online_tbl',
			});
			expect(delOnline.success).toBe(true);

			const disableSchema = await endpoints.catalog.disableSystemSchema(ctx, {
				metastore_id: 'm-123',
				schema_name: 'system',
			});
			expect(disableSchema.success).toBe(true);
		});
	});

	describe('Marketplace Actions', () => {
		it('handles marketplace consumer and provider calls', async () => {
			const listings =
				await endpoints.marketplace.batchGetMarketplaceConsumerListings(ctx, {
					ids: ['l-1'],
				});
			expect(listings.listings.length).toBe(1);

			const providers =
				await endpoints.marketplace.batchGetMarketplaceConsumerProviders(ctx, {
					ids: ['p-1'],
				});
			expect(providers.providers.length).toBe(1);

			const install =
				await endpoints.marketplace.createMarketplaceConsumerInstallation(ctx, {
					listing_id: 'l-1',
				});
			expect(install.id).toBe('inst-123');

			const uninstall =
				await endpoints.marketplace.deleteMarketplaceConsumerInstallation(ctx, {
					id: 'inst-123',
				});
			expect(uninstall.success).toBe(true);

			const provListing =
				await endpoints.marketplace.createMarketplaceProviderListing(ctx, {
					name: 'Dataset',
					summary: 'Summary',
					listing_type: 'FREE',
				});
			expect(provListing.id).toBe('list-123');

			const dash = await endpoints.marketplace.createProviderAnalyticsDashboard(
				ctx,
				{},
			);
			expect(dash.dashboard_id).toBe('dash-123');

			const delListingExchange =
				await endpoints.marketplace.deleteListingFromExchange(ctx, {
					exchange_id: 'e-1',
					listing_id: 'l-1',
				});
			expect(delListingExchange.success).toBe(true);
		});
	});

	describe('Jobs Actions', () => {
		it('cancels and deletes job runs', async () => {
			const cancelRun = await endpoints.jobs.cancelJobRun(ctx, { run_id: 10 });
			expect(cancelRun.success).toBe(true);

			const cancelAll = await endpoints.jobs.cancelAllJobRuns(ctx, {
				job_id: 10,
			});
			expect(cancelAll.success).toBe(true);

			const delRun = await endpoints.jobs.deleteDatabricksJobRun(ctx, {
				run_id: 10,
			});
			expect(delRun.success).toBe(true);
		});
	});

	describe('SQL Actions', () => {
		it('handles SQL queries, statement cancellation, alerts, visualizations, warehouses', async () => {
			const cancelExec = await endpoints.sql.cancelSqlStatementExecution(ctx, {
				statement_id: 'stmt-1',
			});
			expect(cancelExec.status).toBe('SUCCEEDED');

			const query = await endpoints.sql.createSqlQuery(ctx, {
				name: 'Test Query',
				query: 'SELECT 1',
				warehouse_id: 'w-1',
			});
			expect(query.id).toBe('sql-123');

			const delQuery = await endpoints.sql.deleteSqlQuery(ctx, {
				id: 'sql-123',
			});
			expect(delQuery.success).toBe(true);

			const alert = await endpoints.sql.createSqlAlert(ctx, {
				name: 'Test Alert',
				query_id: 'sql-123',
			});
			expect(alert.id).toBe('sql-123');

			const delAlert = await endpoints.sql.deleteSqlAlert(ctx, {
				id: 'sql-123',
			});
			expect(delAlert.success).toBe(true);

			const vis = await endpoints.sql.createSqlQueryVisualization(ctx, {
				query_id: 'sql-123',
				type: 'table',
				name: 'Table Vis',
			});
			expect(vis.id).toBe('sql-123');

			const delWh = await endpoints.sql.deleteSqlWarehouse(ctx, {
				id: 'w-1',
			});
			expect(delWh.success).toBe(true);

			const delDash = await endpoints.sql.deleteSqlDashboard(ctx, {
				id: 'd-1',
			});
			expect(delDash.success).toBe(true);
		});
	});

	describe('Clean Rooms & Data Quality', () => {
		it('creates clean rooms and quality monitors', async () => {
			const cr = await endpoints.cleanrooms.createCleanRoom(ctx, {
				name: 'room_1',
				collaborators: [{ collaborator_alias: 'collab' }],
			});
			expect(cr.name).toBe('cr-123');

			const rule = await endpoints.cleanrooms.createCleanRoomAutoApprovalRule(
				ctx,
				{ clean_room_name: 'room_1' },
			);
			expect(rule.rule_id).toBe('r-123');

			const dq = await endpoints.dataquality.createDataQualityMonitor(ctx, {
				table_name: 'main.default.tbl',
				assets_dir: '/assets',
				output_schema_name: 'main.default',
			});
			expect(dq.monitor_id).toBe('qm-123');

			const qv2 = await endpoints.dataquality.createQualityMonitorV2(ctx, {
				table_name: 'main.default.tbl',
				assets_dir: '/assets',
				output_schema_name: 'main.default',
			});
			expect(qv2.monitor_id).toBe('qm-123');
		});
	});

	describe('Database Instances (Lakebase)', () => {
		it('manages database instances and synced tables', async () => {
			const db = await endpoints.database.createDatabaseInstance(ctx, {
				name: 'lakebase_db',
			});
			expect(db.name).toBe('db-123');

			const delDb = await endpoints.database.deleteDatabaseInstance(ctx, {
				name: 'lakebase_db',
			});
			expect(delDb.success).toBe(true);

			const delSynced = await endpoints.database.deleteSyncedDatabaseTable(
				ctx,
				{ name: 'synced_tbl' },
			);
			expect(delSynced.success).toBe(true);
		});
	});

	describe('Apps & Dashboards', () => {
		it('creates and deploys apps, Genie messages, Lakeview dashboards', async () => {
			const app = await endpoints.apps.createDatabricksApp(ctx, {
				name: 'my_app',
			});
			expect(app.name).toBe('app-123');

			const deploy = await endpoints.apps.deployDatabricksApp(ctx, {
				name: 'my_app',
				source_code_path: '/path',
			});
			expect(deploy.deployment_id).toBe('dep-123');

			const delApp = await endpoints.apps.deleteDatabricksApp(ctx, {
				name: 'my_app',
			});
			expect(delApp.success).toBe(true);

			const genieSpace = await endpoints.dashboards.createGenieSpace(ctx, {
				warehouse_id: 'w-1',
				serialized_space: '{}',
			});
			expect(genieSpace.space_id).toBe('sp-123');

			const genieMsg = await endpoints.dashboards.createGenieMessage(ctx, {
				space_id: 'sp-1',
				conversation_id: 'c-1',
				content: 'Hello Genie',
			});
			expect(genieMsg.message_id).toBe('msg-123');

			const lakeview = await endpoints.dashboards.createLakeviewDashboard(ctx, {
				display_name: 'Dash',
				serialized_dashboard: '{}',
			});
			expect(lakeview.dashboard_id).toBe('d-123');

			const delGenieConv = await endpoints.dashboards.deleteGenieConversation(
				ctx,
				{ space_id: 'sp-1', conversation_id: 'c-1' },
			);
			expect(delGenieConv.success).toBe(true);
		});
	});

	describe('ML & MLflow Actions', () => {
		it('handles ML experiments, logged models, forecasting, feature stores', async () => {
			const exp = await endpoints.ml.createMlExperiment(ctx, {
				name: 'churn_exp',
			});
			expect(exp.experiment_id).toBe('exp-123');

			const run = await endpoints.ml.createMlflowExperimentRun(ctx, {
				experiment_id: 'exp-123',
			});
			expect(run.run_id).toBe('run-123');

			const model = await endpoints.ml.createLoggedModel(ctx, {
				name: 'model_v1',
				experiment_id: 'exp-123',
			});
			expect(model.model_id).toBe('m-123');

			const delModel = await endpoints.ml.deleteLoggedModel(ctx, {
				model_id: 'm-123',
			});
			expect(delModel.success).toBe(true);

			const delExp = await endpoints.ml.deleteMlExperiment(ctx, {
				experiment_id: 'exp-123',
			});
			expect(delExp.success).toBe(true);
		});
	});

	describe('Serving & Sharing', () => {
		it('manages endpoints, shares, recipients, providers', async () => {
			const ep = await endpoints.serving.createProvisionedThroughputEndpoint(
				ctx,
				{ name: 'llm_endpoint', config: {} },
			);
			expect(ep.name).toBe('ep-123');

			const vs = await endpoints.serving.createVectorSearchEndpoint(ctx, {
				name: 'vs_endpoint',
				endpoint_type: 'STANDARD',
			});
			expect(vs.name).toBe('ep-123');

			const delEp = await endpoints.serving.deleteServingEndpoint(ctx, {
				name: 'llm_endpoint',
			});
			expect(delEp.success).toBe(true);

			const share = await endpoints.sharing.createShare(ctx, { name: 's-1' });
			expect(share.name).toBe('share-123');

			const recipient = await endpoints.sharing.createSharingRecipient(ctx, {
				name: 'r-1',
				authentication_type: 'TOKEN',
			});
			expect(recipient.name).toBe('recip-123');

			const delShare = await endpoints.sharing.deleteShare(ctx, {
				name: 's-1',
			});
			expect(delShare.success).toBe(true);
		});
	});

	describe('Workspace & Settings Actions', () => {
		it('handles secret scopes, tag policies, workspace directories, git credentials, repos', async () => {
			const scope = await endpoints.workspace.createSecretScope(ctx, {
				scope: 'my_scope',
			});
			expect(scope.success).toBe(true);

			const dir = await endpoints.workspace.createWorkspaceDirectory(ctx, {
				path: '/Workspace/Shared',
			});
			expect(dir.success).toBe(true);

			const tagPolicy = await endpoints.workspace.createTagPolicy(ctx, {
				tag_key: 'environment',
			});
			expect(tagPolicy.tag_key).toBe('environment');

			const gitCreds = await endpoints.workspace.createWorkspaceGitCredentials(
				ctx,
				{
					git_username: 'user',
					git_provider: 'gitHub',
					personal_access_token: 'pat123',
				},
			);
			expect(gitCreds.credential_id).toBe(1);

			const repo = await endpoints.workspace.createWorkspaceRepo(ctx, {
				url: 'https://github.com/repo',
				provider: 'gitHub',
			});
			expect(repo.id).toBe(1);

			const delScope = await endpoints.workspace.deleteSecretScope(ctx, {
				scope: 'my_scope',
			});
			expect(delScope.success).toBe(true);

			const delObj = await endpoints.workspace.deleteWorkspaceObject(ctx, {
				path: '/Workspace/file',
			});
			expect(delObj.success).toBe(true);
		});
	});

	describe('Webhooks', () => {
		it('verifies signature when rawBody string is present', () => {
			const req: any = {
				headers: { 'x-databricks-signature': 'invalid_sig' },
				rawBody: '{"event_type":"job.completed"}',
				payload: { event_type: 'job.completed' },
			};
			const res = verifyDatabricksWebhookSignature(req, 'secret');
			expect(res.valid).toBe(false);
			expect(res.error).toBe('Invalid webhook signature');
		});

		it('returns error when rawBody is missing', () => {
			const req: any = {
				headers: { 'x-databricks-signature': 'sig' },
				payload: { event_type: 'job.completed' },
			};
			const res = verifyDatabricksWebhookSignature(req, 'secret');
			expect(res.valid).toBe(false);
			expect(res.error).toBe('Missing raw body for signature verification');
		});

		it('matches tenant webhook', () => {
			const match = matchDatabricksTenantWebhook({
				body: { workspace_id: 'ws-123' },
				headers: {},
			} as any);
			expect(match).toEqual({
				linkType: 'tenant_external_id',
				externalId: 'ws-123',
			});
		});
	});
});
