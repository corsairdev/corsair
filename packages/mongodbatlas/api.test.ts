import { createCorsair } from 'corsair/core';
import { mongodbatlas } from './index';

/**
 * Live run against an Atlas organization (the free M0 tier is enough):
 *
 *   MONGODB_ATLAS_KEY=<clientId:clientSecret or publicKey:privateKey> npx jest api.test.ts
 *
 * Skipped unless MONGODB_ATLAS_KEY is set (CI never runs files named
 * api.test.ts). It reads the organizations and projects, creates a
 * throwaway project with an IP access list entry and a database user, and
 * deletes the project at the end. No cluster is created.
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
});
