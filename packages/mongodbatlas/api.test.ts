import { createCorsair } from 'corsair/core';
import { mongodbatlas } from './index';

/**
 * Live run against an Atlas organization (the free M0 tier is enough):
 *
 *   MONGODB_ATLAS_KEY=<clientId:clientSecret or publicKey:privateKey> npx jest api.test.ts
 *
 * Skipped unless MONGODB_ATLAS_KEY is set (CI never runs files named
 * api.test.ts). It reads the organizations, projects and any clusters
 * (read only), creates a throwaway project with an IP access list entry, a
 * database user, a custom role and an alert configuration, creates an
 * organization API key and gives it the project, then deletes all of it. No
 * cluster is created or changed.
 */
const key = process.env.MONGODB_ATLAS_KEY;
const describeIfLive = key ? describe : describe.skip;
if (!key) {
	console.warn(
		'Skipping MongoDB Atlas live run: set MONGODB_ATLAS_KEY (a service account or API key with Organization Owner).',
	);
}

const STAMP = Date.now().toString(36);

describeIfLive('mongodbatlas live', () => {
	const corsair = createCorsair({
		plugins: [mongodbatlas({ key, permissions: { mode: 'open' } })],
	});
	const api = corsair.mongodbatlas.api;
	let groupId = '';

	afterAll(async () => {
		if (groupId) await api.projects.deleteGroup({ groupId });
	});

	it('reads the organizations', async () => {
		const orgs = await api.organizations.listOrgs({});
		expect((orgs.results ?? []).length).toBeGreaterThan(0);
	});

	it('creates a project with an access list entry and a database user', async () => {
		const orgs = await api.organizations.listOrgs({});
		const orgId = String(orgs.results?.[0]?.id);
		const project = await api.projects.createGroup({
			name: `corsair-live-${STAMP}`,
			orgId,
		});
		groupId = String(project.id);
		await api.projectIpAccessList.createAccessListEntry({
			groupId,
			body: [{ cidrBlock: '203.0.113.0/24', comment: 'corsair live test' }],
		});
		const list = await api.projectIpAccessList.listAccessListEntries({
			groupId,
		});
		expect(list.results?.map((e) => e.cidrBlock)).toContain('203.0.113.0/24');
		await api.databaseUsers.createDatabaseUser({
			groupId,
			databaseName: 'admin',
			username: `corsair-${STAMP}`,
			password: `pw-${STAMP}-Correct-Horse-9`,
			roles: [{ databaseName: 'admin', roleName: 'readAnyDatabase' }],
		});
		const users = await api.databaseUsers.listDatabaseUsers({ groupId });
		expect(users.results?.map((u) => u.username)).toContain(`corsair-${STAMP}`);
	});

	it('reads the clusters of every project', async () => {
		const projects = await api.projects.listGroups({});
		for (const project of projects.results ?? []) {
			const clusters = await api.clusters.listClusters({
				groupId: String(project.id),
			});
			for (const cluster of clusters.results ?? []) {
				const one = await api.clusters.getCluster({
					groupId: String(project.id),
					clusterName: String(cluster.name),
				});
				expect(one.name).toBe(cluster.name);
			}
		}
	});

	it('adds a custom role, an alert and an org API key to the project', async () => {
		expect(groupId).not.toBe('');
		const roleName = `corsairLive${STAMP}`;
		await api.customDatabaseRoles.createCustomDbRole({
			groupId,
			roleName,
			actions: [
				{
					action: 'FIND',
					resources: [{ db: 'corsair', collection: '', cluster: false }],
				},
			],
		});
		const role = await api.customDatabaseRoles.getCustomDbRole({
			groupId,
			roleName,
		});
		expect(role.roleName).toBe(roleName);
		await api.customDatabaseRoles.deleteCustomDbRole({ groupId, roleName });

		// Atlas refuses a project notification with neither email nor SMS on.
		const alert = await api.alertConfigurations.createAlertConfig({
			groupId,
			body: {
				eventTypeName: 'NO_PRIMARY',
				enabled: true,
				notifications: [
					{
						typeName: 'GROUP',
						intervalMin: 60,
						delayMin: 0,
						emailEnabled: true,
						smsEnabled: false,
						roles: ['GROUP_OWNER'],
					},
				],
			},
		});
		const alertConfigId = String(alert.id);
		await api.alertConfigurations.toggleAlertConfig({
			groupId,
			alertConfigId,
			enabled: false,
		});
		await api.alertConfigurations.deleteAlertConfig({ groupId, alertConfigId });

		const orgs = await api.organizations.listOrgs({});
		const orgId = String(orgs.results?.[0]?.id);
		const apiKey = await api.programmaticApiKeys.createOrgApiKey({
			orgId,
			desc: `corsair live ${STAMP}`,
			roles: ['ORG_READ_ONLY'],
		});
		const apiUserId = String(apiKey.id);
		try {
			await api.programmaticApiKeys.addGroupApiKey({
				groupId,
				apiUserId,
				body: [{ roles: ['GROUP_READ_ONLY'] }],
			});
			const keys = await api.programmaticApiKeys.listGroupApiKeys({ groupId });
			expect(keys.results?.map((k) => k.id)).toContain(apiUserId);
			await api.programmaticApiKeys.removeGroupApiKey({ groupId, apiUserId });
		} finally {
			await api.programmaticApiKeys.deleteOrgApiKey({ orgId, apiUserId });
		}
	});
});
