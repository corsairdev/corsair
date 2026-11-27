import { createHash } from 'node:crypto';
import { createCorsair } from 'corsair/core';
import { netlify } from './index';

/**
 * Live run against a Netlify team (free plan is enough):
 *
 *   NETLIFY_API_TOKEN=<personal access token> npx jest api.test.ts
 *
 * Skipped unless NETLIFY_API_TOKEN is set (CI never runs files named
 * api.test.ts). It reads the user and teams, creates a throwaway site, a
 * deploy key, a build hook and a snippet, deploys one file by digest and
 * uploads it, locks and unlocks the deploy, then deletes everything it made.
 */
const token = process.env.NETLIFY_API_TOKEN;
const describeIfLive = token ? describe : describe.skip;
if (!token) {
	console.warn(
		'Skipping Netlify live run: set NETLIFY_API_TOKEN (a team you can make a throwaway site in).',
	);
}

const STAMP = Date.now().toString(36);

describeIfLive('netlify live', () => {
	const corsair = createCorsair({
		plugins: [netlify({ key: token, permissions: { mode: 'open' } })],
	});
	const api = corsair.netlify.api;
	let siteId = '';

	afterAll(async () => {
		if (siteId) await api.sites.delete({ site_id: siteId });
	});

	it('reads the user and the teams', async () => {
		const me = await api.user.me({});
		expect(me.id).toBeTruthy();
		const accounts = await api.accounts.list({});
		expect(accounts.length).toBeGreaterThan(0);
		const first = accounts[0];
		expect(first?.slug).toBeTruthy();
		const team = await api.accounts.get({ account_id: String(first?.id) });
		expect(team.id).toBe(first?.id);
		const status = await api.accounts.builds.status({
			account_id: String(first?.id),
		});
		expect(typeof status.active).toBe('number');
		const types = await api.accounts.listTypes({});
		expect(types.length).toBeGreaterThan(0);
	});

	it('creates a site, deploys a file by digest and cleans up', async () => {
		const [account] = await api.accounts.list({});
		const site = await api.accounts.sites.create({
			account_slug: String(account?.slug),
			name: `corsair-live-${STAMP}`,
		});
		siteId = String(site?.id);
		expect(site?.name).toBe(`corsair-live-${STAMP}`);

		const key = await api.deployKeys.create({});
		await api.deployKeys.delete({ key_id: String(key.id) });

		const hook = await api.sites.buildHooks.create({
			site_id: siteId,
			title: 'corsair',
			branch: 'main',
		});
		expect(hook.url).toContain('api.netlify.com/build_hooks/');
		await api.sites.buildHooks.delete({ site_id: siteId, id: String(hook.id) });

		await api.sites.snippets.create({
			site_id: siteId,
			title: 'corsair',
			general: '<!-- corsair -->',
			general_position: 'footer',
		});
		const snippets = await api.sites.snippets.list({ site_id: siteId });
		expect(snippets).toHaveLength(1);

		const html = `<h1>corsair ${STAMP}</h1>`;
		const sha1 = createHash('sha1').update(html).digest('hex');
		const deploy = await api.sites.deploys.create({
			site_id: siteId,
			files: { '/index.html': sha1 },
		});
		expect(deploy.required).toEqual([sha1]);
		const uploaded = await api.deploys.uploadFile({
			deploy_id: String(deploy.id),
			path: 'index.html',
			file: { base64: Buffer.from(html).toString('base64') },
		});
		expect(uploaded.sha).toBe(sha1);
		await api.deploys.lock({ deploy_id: String(deploy.id) });
		const unlocked = await api.deploys.unlock({ deploy_id: String(deploy.id) });
		expect(unlocked.locked).toBe(false);
		const page = await api.sites.deploys.list({ site_id: siteId, per_page: 5 });
		expect(page.items.map((item) => item.id)).toContain(deploy.id);
	});
});
