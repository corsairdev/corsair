import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type {
	HandleAvailabilityState,
	Passage,
	PassageEvent,
} from './claim-passage';
import {
	advance as advanceWith,
	blocker,
	claimLapsed,
	claimReady,
	guessClient,
	prefill as prefillWith,
	restore as restoreWith,
	save,
	start,
} from './claim-passage';

// Ported from lug.dev (hub apps/lug/src/lib/passage.test.ts). The catalog is a
// fixture here; the page passes the real one.
const APPS = new Set([
	'gmail',
	'slack',
	'github',
	'googlecalendar',
	'notion',
	'stripe',
	'linear',
	'jira',
	'hubspot',
	'figma',
	'zoom',
	'sentry',
]);
// The starter skills come from Hub; these are the slugs the tests use.
const SKILLS = new Set(['release-notes', 'revenue-digest', 'morning-brief']);
const advance = (p: Passage, e: PassageEvent) => advanceWith(p, e, APPS);
const prefill = (search: string) => prefillWith(search, APPS, SKILLS);
const restore = (search: string, saved: string | null, ua: string) =>
	restoreWith(search, saved, ua, APPS, SKILLS);

const CHROME =
	'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/131.0 Safari/537.36';

const ready = (available: boolean): HandleAvailabilityState => ({
	status: 'ready',
	data: available ? { available: true } : { available: false, reason: 'taken' },
});

function claimedBare(handle = 'yuvraj'): Passage {
	return advance(advance(start(CHROME), { type: 'typeHandle', raw: handle }), {
		type: 'next',
	});
}

function claimed(handle = 'yuvraj'): Passage {
	return ['gmail', 'slack', 'github', 'googlecalendar'].reduce(
		(p, id) => advance(p, { type: 'toggleApp', id }),
		claimedBare(handle),
	);
}

describe('start', () => {
	it('opens on the name step with no apps picked, link work and a guessed client', () => {
		assert.deepEqual(start(CHROME), {
			step: 'claim',
			handle: '',
			link: 'work',
			apps: [],
			clients: ['claude'],
			skill: '',
		});
	});
});

describe('guessClient', () => {
	for (const [ua, id] of [
		['Mozilla/5.0 ... Cursor/1.7.2 Chrome/132 Electron/34', 'cursor'],
		['Mozilla/5.0 ... Code/1.99.0 Chrome/132 Electron/34', 'vscode'],
		['Mozilla/5.0 ... Windsurf/1.9 Chrome/132 Electron/34', 'windsurf'],
		['Mozilla/5.0 ... Claude/0.14 Chrome/132 Electron/34', 'claude'],
		['Mozilla/5.0 ... ChatGPT/1.2025 Safari/605', 'chatgpt'],
		['Mozilla/5.0 ... Zed/0.180 ', 'zed'],
		[CHROME, 'claude'],
		['', 'claude'],
	] as const) {
		it(`${ua} → ${id}`, () => {
			assert.equal(guessClient(ua), id);
		});
	}
});

describe('claim', () => {
	it('tidies as you type', () => {
		assert.equal(
			advance(start(CHROME), { type: 'typeHandle', raw: 'Yuv Raj' }).handle,
			'yuv-raj',
		);
	});

	it('will not advance on a bad or reserved handle', () => {
		for (const raw of ['', '-x', 'admin']) {
			const p = advance(advance(start(CHROME), { type: 'typeHandle', raw }), {
				type: 'next',
			});
			assert.equal(p.step, 'claim');
		}
	});

	it('reports the blocking problem for the current step only', () => {
		const typed = (raw: string) =>
			advance(start(CHROME), { type: 'typeHandle', raw });
		assert.equal(blocker(typed('admin')), 'reserved');
		assert.equal(blocker(typed('a_b')), 'format');
		assert.equal(blocker(typed('yuv')), null);
	});

	it('advances to pick on a valid handle', () => {
		assert.equal(claimed().step, 'pick');
	});
});

describe('claimReady', () => {
	it('waits for Hub to say the name is free', () => {
		assert.equal(claimReady('acme', ready(true)), true);
		assert.equal(claimReady('acme', ready(false)), false);
		assert.equal(claimReady('acme', { status: 'idle' }), false);
		assert.equal(claimReady('acme', { status: 'checking' }), false);
	});

	it('lets a failed check through, since Hub checks again', () => {
		assert.equal(claimReady('acme', { status: 'error' }), true);
	});

	it('never passes a name that breaks the rules', () => {
		assert.equal(claimReady('', ready(true)), false);
		assert.equal(claimReady('admin', ready(true)), false);
		assert.equal(claimReady('a_b', { status: 'error' }), false);
	});
});

describe('pick', () => {
	it('toggles apps', () => {
		const off = advance(claimed(), { type: 'toggleApp', id: 'slack' });
		assert.deepEqual(off.apps, ['gmail', 'github', 'googlecalendar']);
		assert.ok(
			advance(off, { type: 'toggleApp', id: 'notion' }).apps.includes('notion'),
		);
	});

	it('ignores ids outside the catalog', () => {
		assert.equal(
			advance(claimed(), { type: 'toggleApp', id: 'not-a-real-app' }).apps
				.length,
			4,
		);
	});

	it('holds at 8 apps, the most Hub will seed', () => {
		let p = claimed();
		for (const id of ['notion', 'stripe', 'linear', 'jira', 'hubspot']) {
			p = advance(p, { type: 'toggleApp', id });
		}
		assert.equal(p.apps.length, 8);
		assert.ok(!p.apps.includes('hubspot'));
	});

	it('needs at least one app to continue', () => {
		const p = claimedBare();
		assert.equal(blocker(p), 'no-apps');
		assert.equal(advance(p, { type: 'next' }).step, 'pick');
	});

	it('adds and removes agents from the list only, keeping at least one', () => {
		const both = advance(claimed(), { type: 'toggleClient', id: 'cursor' });
		assert.deepEqual(both.clients, ['claude', 'cursor']);
		assert.deepEqual(
			advance(both, { type: 'toggleClient', id: 'claude' }).clients,
			['cursor'],
		);
		assert.deepEqual(
			advance(claimed(), { type: 'toggleClient', id: 'nope' }).clients,
			['claude'],
		);
		assert.deepEqual(
			advance(claimed(), { type: 'toggleClient', id: 'claude' }).clients,
			['claude'],
		);
	});
});

describe('review', () => {
	const reviewed = () => advance(claimed(), { type: 'next' });

	it('is reached from pick', () => {
		assert.equal(reviewed().step, 'review');
	});

	it('edits the link name with the link rules', () => {
		const p = advance(reviewed(), { type: 'typeLink', raw: 'Side Gig' });
		assert.equal(p.link, 'side-gig');
		assert.equal(blocker(p), null);
		assert.equal(
			blocker(advance(reviewed(), { type: 'typeLink', raw: '-x' })),
			'format',
		);
	});

	it('does not move past review', () => {
		assert.equal(advance(reviewed(), { type: 'next' }).step, 'review');
	});
});

describe('back and goto', () => {
	it('steps back one at a time and stops at the name step', () => {
		let p = advance(claimed(), { type: 'next' });
		p = advance(p, { type: 'back' });
		assert.equal(p.step, 'pick');
		p = advance(p, { type: 'back' });
		assert.equal(p.step, 'claim');
		assert.equal(advance(p, { type: 'back' }).step, 'claim');
	});

	it('keeps the draft when going back', () => {
		assert.equal(advance(claimed('yuv'), { type: 'back' }).handle, 'yuv');
	});

	it('jumps to any reachable step and refuses unreachable ones', () => {
		const review = advance(claimed(), { type: 'next' });
		assert.equal(
			advance(review, { type: 'goto', step: 'claim' }).step,
			'claim',
		);
		assert.equal(
			advance(advance(review, { type: 'goto', step: 'claim' }), {
				type: 'goto',
				step: 'review',
			}).step,
			'review',
		);
		assert.equal(
			advance(start(CHROME), { type: 'goto', step: 'review' }).step,
			'claim',
		);
	});
});

describe('save and restore', () => {
	it('round-trips a draft and the step', () => {
		const p = advance(advance(claimed(), { type: 'toggleClient', id: 'zed' }), {
			type: 'next',
		});
		const { search, saved } = save(p);
		assert.equal(search, '?step=review');
		assert.deepEqual(restore(search, saved, CHROME), p);
	});

	it('leaves the URL bare on the name step', () => {
		assert.equal(
			save(advance(start(CHROME), { type: 'typeHandle', raw: 'yuvraj' }))
				.search,
			'',
		);
	});

	it('clamps the step to what the draft can reach', () => {
		assert.equal(restore('?step=review', null, CHROME).step, 'claim');
		const saved = save(
			advance(claimed(), { type: 'toggleApp', id: 'gmail' }),
		).saved;
		assert.equal(
			restore(
				'?step=review',
				saved.replace(/"apps":\[[^\]]*\]/, '"apps":[]'),
				CHROME,
			).step,
			'pick',
		);
	});

	it('starts fresh on garbage', () => {
		assert.deepEqual(restore('?step=pick', '{not json', CHROME), start(CHROME));
		assert.deepEqual(
			restore('', JSON.stringify({ handle: 7, apps: 'x' }), CHROME),
			start(CHROME),
		);
	});

	it('keeps only known apps and clients from storage', () => {
		const p = restore(
			'?step=pick',
			JSON.stringify({
				handle: 'yuv',
				link: 'work',
				apps: ['gmail', 'evil', 'gmail'],
				clients: ['nope'],
			}),
			CHROME,
		);
		assert.equal(p.step, 'pick');
		assert.deepEqual(p.apps, ['gmail']);
		assert.deepEqual(p.clients, ['claude']);
	});

	it('restores the name step with an empty step param', () => {
		const restored = restore('', save(claimed()).saved, CHROME);
		assert.equal(restored.step, 'claim');
		assert.equal(restored.handle, 'yuvraj');
	});
});

describe('a link prefills the passage', () => {
	it("reads apps, handle and client, dropping what Corsair doesn't know", () => {
		assert.deepEqual(
			prefill(
				'?apps=Gmail,%20slack,notarealapp,gmail&handle=Acme%20Co&client=cursor&utm_source=x',
			),
			{
				handle: 'acme-co',
				apps: ['gmail', 'slack'],
				clients: ['cursor'],
				skill: '',
			},
		);
		assert.deepEqual(prefill('?plugins=github'), {
			handle: '',
			apps: ['github'],
			clients: undefined,
			skill: '',
		});
		assert.deepEqual(
			prefill('?handle=%3Cscript%3E&client=netscape&skill=nope'),
			{
				handle: '',
				apps: [],
				clients: undefined,
				skill: '',
			},
		);
		assert.deepEqual(prefill('?clients=cursor,nope,claude,cursor').clients, [
			'cursor',
			'claude',
		]);
		assert.equal(
			prefill(
				'?apps=gmail,slack,github,notion,linear,stripe,hubspot,figma,zoom,sentry',
			).apps.length,
			8,
		);
	});

	it('starts a name from the homepage at the app picker, whatever step the link names', () => {
		assert.deepEqual(restore('?handle=acme', null, CHROME), {
			step: 'pick',
			handle: 'acme',
			link: 'work',
			apps: [],
			clients: ['claude'],
			skill: '',
		});
		const p = restore(
			'?apps=gmail,slack&handle=acme&client=cursor&step=review',
			null,
			CHROME,
		);
		assert.deepEqual(p, {
			step: 'pick',
			handle: 'acme',
			link: 'work',
			apps: ['gmail', 'slack'],
			clients: ['cursor'],
			skill: '',
		});
	});

	it('starts at the name step without a name, keeping the apps for the picker', () => {
		const p = restore('?apps=gmail,slack', null, CHROME);
		assert.equal(p.step, 'claim');
		const picked = advance(advance(p, { type: 'typeHandle', raw: 'acme' }), {
			type: 'next',
		});
		assert.equal(picked.step, 'pick');
		assert.deepEqual(picked.apps, ['gmail', 'slack']);
		assert.equal(blocker(picked), null);
	});

	it('puts a reserved or malformed name from the link back on the name step', () => {
		assert.equal(restore('?handle=admin', null, CHROME).step, 'claim');
		assert.equal(restore('?handle=-x', null, CHROME).handle, '');
	});

	it("takes the link's name, apps and agents over the draft's, keeping the draft's link name", () => {
		const mine = save({
			...start(CHROME),
			handle: 'yuvraj',
			link: 'side',
			apps: ['notion'],
			clients: ['claude'],
		}).saved;
		const p = restore('?apps=gmail&handle=acme&client=cursor', mine, CHROME);
		assert.deepEqual(
			[p.step, p.handle, p.link, p.apps, p.clients],
			['pick', 'acme', 'side', ['gmail'], ['cursor']],
		);
	});

	it("keeps the draft's own picks when the link only names a handle", () => {
		const mine = save({
			...start(CHROME),
			handle: 'yuvraj',
			apps: ['notion'],
			skill: 'release-notes',
		}).saved;
		const p = restore('?handle=acme', mine, CHROME);
		assert.deepEqual(
			[p.handle, p.apps, p.skill],
			['acme', ['notion'], 'release-notes'],
		);
	});

	it("resumes a draft's own handle at the step in the URL", () => {
		assert.equal(
			restore('?step=pick', save(claimed()).saved, CHROME).step,
			'pick',
		);
		assert.equal(
			restore('?step=review', save(claimed()).saved, CHROME).step,
			'review',
		);
	});

	it("takes a skill's apps over a draft's, and keeps the skill through the steps", () => {
		const mine = save({
			...start(CHROME),
			handle: 'yuvraj',
			apps: ['notion'],
			clients: ['claude'],
		}).saved;
		const p = restore('?apps=stripe,slack&skill=revenue-digest', mine, CHROME);
		assert.deepEqual(
			[p.step, p.handle, p.apps, p.skill],
			['claim', 'yuvraj', ['stripe', 'slack'], 'revenue-digest'],
		);
		const reviewed = advance(advance(p, { type: 'next' }), { type: 'next' });
		assert.equal(reviewed.step, 'review');
		assert.equal(reviewed.skill, 'revenue-digest');
		assert.equal(
			restore('?step=review', save(reviewed).saved, CHROME).skill,
			'revenue-digest',
		);
	});

	it("drops a draft's skill when a link picks apps without one", () => {
		const mine = save({
			...start(CHROME),
			handle: 'yuvraj',
			skill: 'revenue-digest',
		}).saved;
		assert.equal(restore('?apps=gmail', mine, CHROME).skill, '');
	});

	it('reads apps whether the commas are literal or encoded, as claimHref writes them', () => {
		const literal = restore(
			'?apps=gmail,slack&skill=revenue-digest',
			null,
			CHROME,
		);
		const encoded = restore(
			'?apps=gmail%2Cslack&skill=revenue-digest',
			null,
			CHROME,
		);
		assert.deepEqual(encoded, literal);
		assert.deepEqual(
			[encoded.apps, encoded.skill],
			[['gmail', 'slack'], 'revenue-digest'],
		);
	});

	it('changes nothing without link params', () => {
		assert.deepEqual(restore('?utm_source=x', null, CHROME), start(CHROME));
	});
});

describe('claimLapsed', () => {
	const at = (step: Passage['step']) => ({
		...start(CHROME),
		handle: 'acme',
		apps: ['gmail'],
		step,
	});

	it('sends a visit back to the name step once its handle turns out taken', () => {
		assert.equal(claimLapsed(at('pick'), ready(false)), true);
		assert.equal(
			claimLapsed(at('review'), {
				status: 'ready',
				data: { available: false, reason: 'reserved' },
			}),
			true,
		);
	});

	it('leaves it alone while the check runs, fails, or says the handle is free', () => {
		for (const availability of [
			{ status: 'idle' as const },
			{ status: 'checking' as const },
			{ status: 'error' as const },
			ready(true),
		]) {
			assert.equal(
				claimLapsed(at('review'), availability),
				false,
				availability.status,
			);
		}
	});

	it('never fires on the name step itself, which shows the problem on its own', () => {
		assert.equal(claimLapsed(at('claim'), ready(false)), false);
	});
});
