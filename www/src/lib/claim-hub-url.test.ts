import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildHubUrl, hubSignInUrl } from './claim-hub-url';

// Ported from lug.dev (hub apps/lug/src/lib/hub-url.test.ts). Hub's login and
// /me read this URL, so the first test pins it byte for byte. lug.dev's copy
// also ran the campaign tags through Hub's own reader
// (packages/auth/src/signup-source.ts); that lives in the private hub repo, so
// here they are read back with URL parsing.

const HUB = 'https://hub.corsair.dev';

const redirectOf = (url: string) =>
	new URL(new URL(url).searchParams.get('redirect') ?? '', 'http://x');

describe('buildHubUrl', () => {
	it('matches the contract example byte for byte', () => {
		assert.equal(
			buildHubUrl(
				{
					handle: 'yuvraj',
					link: 'work',
					apps: ['gmail', 'slack', 'github', 'googlecalendar'],
					clients: ['cursor'],
				},
				HUB,
			),
			'https://hub.corsair.dev/login?mode=lug&handle=yuvraj&plugins=gmail,slack,github,googlecalendar&redirect=%2Fme%3Fhandle%3Dyuvraj%26path%3Dwork%26plugins%3Dgmail%2Cslack%2Cgithub%2Cgooglecalendar%26client%3Dcursor%26clients%3Dcursor',
		);
	});

	it('goes to hub.corsair.dev by default', () => {
		assert.match(
			buildHubUrl({ handle: 'yuv', apps: [], clients: ['claude'] }),
			/^https:\/\/hub\.corsair\.dev\/login\?mode=lug&/,
		);
	});

	it('round-trips through URL parsing', () => {
		const url = buildHubUrl(
			{ handle: 'a-b', link: 'my-link', apps: ['notion'], clients: ['claude'] },
			HUB,
		);
		const parsed = new URL(url);
		assert.equal(parsed.pathname, '/login');
		assert.equal(parsed.searchParams.get('mode'), 'lug');
		assert.equal(parsed.searchParams.get('handle'), 'a-b');
		assert.equal(parsed.searchParams.get('plugins'), 'notion');
		const redirect = redirectOf(url);
		assert.equal(redirect.pathname, '/me');
		assert.deepEqual(Object.fromEntries(redirect.searchParams), {
			handle: 'a-b',
			path: 'my-link',
			plugins: 'notion',
			client: 'claude',
			clients: 'claude',
		});
	});

	it('names every agent picked, the first as client', () => {
		const redirect = redirectOf(
			buildHubUrl(
				{ handle: 'yuv', apps: [], clients: ['cursor', 'claude', 'cursor'] },
				HUB,
			),
		);
		assert.equal(redirect.searchParams.get('client'), 'cursor');
		assert.equal(redirect.searchParams.get('clients'), 'cursor,claude');
	});

	it('throws with no agent', () => {
		assert.throws(() =>
			buildHubUrl({ handle: 'yuv', apps: [], clients: [] }, HUB),
		);
	});

	it('defaults the link name to work', () => {
		assert.equal(
			redirectOf(
				buildHubUrl({ handle: 'yuv', apps: [], clients: ['claude'] }, HUB),
			).searchParams.get('path'),
			'work',
		);
	});

	it('caps apps at 8 after lowercasing and de-duping, keeping order', () => {
		const url = buildHubUrl(
			{
				handle: 'yuv',
				apps: [
					'Slack',
					'slack',
					'github',
					'gmail',
					'notion',
					'stripe',
					'linear',
					'jira',
					'hubspot',
					'asana',
				],
				clients: ['cursor'],
			},
			HUB,
		);
		const want = 'slack,github,gmail,notion,stripe,linear,jira,hubspot';
		assert.equal(new URL(url).searchParams.get('plugins'), want);
		assert.equal(redirectOf(url).searchParams.get('plugins'), want);
	});

	it('drops app ids that could break the comma list', () => {
		const url = new URL(
			buildHubUrl(
				{
					handle: 'yuv',
					apps: ['gmail,evil', ' slack ', '', 'git&hub'],
					clients: ['cursor'],
				},
				HUB,
			),
		);
		assert.equal(url.searchParams.get('plugins'), 'slack');
	});

	for (const handle of ['', '-yuv', 'Yuv', 'xn--abc', 'admin']) {
		it(`throws on handle ${JSON.stringify(handle)}`, () => {
			assert.throws(() =>
				buildHubUrl({ handle, apps: [], clients: ['cursor'] }, HUB),
			);
		});
	}

	it('throws on an invalid link name', () => {
		assert.throws(() =>
			buildHubUrl(
				{ handle: 'yuv', link: 'a/b', apps: [], clients: ['cursor'] },
				HUB,
			),
		);
	});

	it("throws on a client id outside Hub's id shape", () => {
		assert.throws(() =>
			buildHubUrl({ handle: 'yuv', apps: [], clients: ['cur sor'] }, HUB),
		);
	});

	it('tolerates a trailing slash on the Hub origin', () => {
		assert.match(
			buildHubUrl({ handle: 'yuv', apps: [], clients: ['claude'] }, `${HUB}/`),
			/^https:\/\/hub\.corsair\.dev\/login\?/,
		);
	});
});

const ANON_ID = '019a1b2c-3d4e-7f60-8a9b-0c1d2e3f4a5b';

describe('the anonymous id on the hand-off', () => {
	const draft = {
		handle: 'yuvraj',
		link: 'work',
		apps: ['gmail'],
		clients: ['cursor'],
	};

	it('rides on the outer link, where Hub reads it, and not in the redirect', () => {
		const url = buildHubUrl(draft, HUB, ANON_ID);
		assert.equal(new URL(url).searchParams.get('ph_did'), ANON_ID);
		assert.equal(redirectOf(url).searchParams.get('ph_did'), null);
	});

	it('changes nothing else about the link', () => {
		assert.equal(
			buildHubUrl(draft, HUB, ANON_ID),
			`${buildHubUrl(draft, HUB)}&ph_did=${ANON_ID}`,
		);
	});

	it('is left off without an id', () => {
		assert.ok(!buildHubUrl(draft, HUB).includes('ph_did'));
		assert.ok(!hubSignInUrl(HUB).includes('ph_did'));
	});

	it("drops anything that isn't a PostHog id", () => {
		assert.ok(!buildHubUrl(draft, HUB, 'user_123').includes('ph_did'));
		assert.ok(
			!buildHubUrl(draft, HUB, `${ANON_ID}&redirect=//evil`).includes('evil'),
		);
	});

	it('rides on both sign-in links', () => {
		assert.equal(
			new URL(hubSignInUrl(HUB, null, ANON_ID)).searchParams.get('ph_did'),
			ANON_ID,
		);
		assert.equal(
			new URL(hubSignInUrl(HUB, draft, ANON_ID)).searchParams.get('ph_did'),
			ANON_ID,
		);
	});
});

describe('hubSignInUrl', () => {
	it('points returning people at the MCP URL sign-in', () => {
		assert.equal(
			hubSignInUrl(HUB),
			'https://hub.corsair.dev/login?mode=lug&redirect=%2Fme',
		);
	});

	it('prefills handle and apps from an in-progress draft', () => {
		assert.equal(
			hubSignInUrl(HUB, {
				handle: 'yuvraj',
				apps: ['gmail', 'slack'],
				clients: ['claude'],
			}),
			'https://hub.corsair.dev/login?mode=lug&handle=yuvraj&redirect=%2Fme&plugins=gmail,slack',
		);
	});
});

describe('the skill on the hand-off', () => {
	const DRAFT = {
		handle: 'yuvraj',
		link: 'work',
		apps: ['stripe'],
		clients: ['claude'],
	};

	it("rides in Hub's redirect after the agents", () => {
		const url = new URL(
			buildHubUrl({ ...DRAFT, skill: 'revenue-digest' }, HUB),
		);
		assert.equal(
			url.searchParams.get('redirect'),
			'/me?handle=yuvraj&path=work&plugins=stripe&client=claude&clients=claude&skill=revenue-digest',
		);
		assert.equal(url.searchParams.get('skill'), null);
	});

	it("is dropped, not thrown on, when it isn't a slug", () => {
		const url = new URL(buildHubUrl({ ...DRAFT, skill: '../x&y=1' }, HUB));
		assert.equal(
			url.searchParams.get('redirect'),
			'/me?handle=yuvraj&path=work&plugins=stripe&client=claude&clients=claude',
		);
	});

	it('reaches /me on sign-in, with or without a handle', () => {
		assert.equal(
			hubSignInUrl(HUB, {
				handle: '',
				apps: [],
				clients: ['claude'],
				skill: 'lead-list',
			}),
			'https://hub.corsair.dev/login?mode=lug&redirect=%2Fme%3Fskill%3Dlead-list',
		);
		assert.equal(
			new URL(
				hubSignInUrl(HUB, { ...DRAFT, skill: 'lead-list' }),
			).searchParams.get('redirect'),
			'/me?skill=lead-list',
		);
	});
});

describe('campaign tags', () => {
	const draft = { handle: 'yuvraj', apps: ['gmail'], clients: ['claude'] };
	const campaign = {
		utm_source: 'piyushgarg_youtube',
		utm_medium: 'video',
		utm_campaign: 'mcp gateway&x',
	};

	it('ride on the outer link of the hand-off, where Hub reads them', () => {
		const url = new URL(buildHubUrl(draft, HUB, undefined, campaign));
		assert.equal(url.searchParams.get('mode'), 'lug');
		assert.equal(url.searchParams.get('handle'), 'yuvraj');
		assert.equal(url.searchParams.get('plugins'), 'gmail');
		assert.equal(url.searchParams.get('utm_source'), 'piyushgarg_youtube');
		assert.equal(url.searchParams.get('utm_medium'), 'video');
		assert.equal(url.searchParams.get('utm_campaign'), 'mcp gateway&x');
	});

	it('ride on both sign-in links', () => {
		assert.equal(
			new URL(hubSignInUrl(HUB, null, undefined, campaign)).searchParams.get(
				'utm_source',
			),
			'piyushgarg_youtube',
		);
		assert.equal(
			new URL(hubSignInUrl(HUB, draft, undefined, campaign)).searchParams.get(
				'utm_campaign',
			),
			'mcp gateway&x',
		);
	});

	it('stay out of the redirect', () => {
		assert.equal(
			redirectOf(buildHubUrl(draft, HUB, undefined, campaign)).searchParams.get(
				'utm_source',
			),
			null,
		);
	});

	it('change nothing else about the link', () => {
		assert.equal(
			buildHubUrl(draft, HUB, undefined, { utm_source: 'x' }),
			`${buildHubUrl(draft, HUB)}&utm_source=x`,
		);
		assert.equal(hubSignInUrl(HUB, null, undefined, {}), hubSignInUrl(HUB));
	});

	it('cannot add other parameters to the link', () => {
		const url = new URL(
			buildHubUrl(draft, HUB, undefined, {
				utm_source: 'x&redirect=//evil.com&mode=www',
			}),
		);
		assert.equal(url.searchParams.getAll('redirect').length, 1);
		assert.equal(url.searchParams.get('mode'), 'lug');
		assert.equal(
			url.searchParams.get('utm_source'),
			'x&redirect=//evil.com&mode=www',
		);
	});
});
