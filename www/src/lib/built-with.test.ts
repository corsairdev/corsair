import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	builtWithAppName,
	builtWithApps,
	builtWithByCategory,
	builtWithMoreApps,
	builtWithUsesMcp,
	parseBuiltWith,
} from './built-with';

// The overrides are unknown on purpose: the tests feed parseBuiltWith rows of the wrong shape, as the source could.
const project = (over: Record<string, unknown>) => ({
	id: 'p',
	name: 'P',
	url: 'https://p.example',
	repo: 'o/p',
	author: '@o',
	category: 'email-calendar',
	kind: ['hosted', 'oss'],
	lang: ['TypeScript'],
	corsair: ['gmail'],
	description: 'Does a thing.',
	event: '',
	hosted: true,
	added: '2026-11-20',
	verified: true,
	...over,
});

describe('parseBuiltWith', () => {
	it('keeps well-formed entries and drops the rest', () => {
		const data = parseBuiltWith({
			categories: [
				{ id: 'email-calendar', title: 'Email and calendar', blurb: '' },
			],
			projects: [
				project({ id: 'ok' }),
				project({ id: 'bad-url', url: 'javascript:alert(1)' }),
				{ id: 'missing-fields' },
				null,
			],
		});
		assert.deepEqual(
			data?.projects.map((p) => p.id),
			['ok'],
		);
	});

	it('cleans fields of the wrong type instead of passing them to the page', () => {
		const data = parseBuiltWith({
			categories: [
				{
					id: 'email-calendar',
					title: 'Email and calendar',
					blurb: { text: 'x' },
				},
				{ id: 'no-title' },
			],
			projects: [
				project({
					id: 'messy',
					author: { name: '@o' },
					corsair: [123, 'gmail', null, { id: 'slack' }],
					kind: ['oss', 7],
					lang: 'TypeScript',
					event: 42,
					added: false,
				}),
				project({ id: 'no-apps', corsair: 'gmail' }),
			],
		})!;
		assert.deepEqual(data.categories, [
			{ id: 'email-calendar', title: 'Email and calendar', blurb: '' },
		]);
		assert.deepEqual(
			data.projects.map((p) => p.id),
			['messy'],
		);
		const [messy] = data.projects;
		assert.equal(messy!.author, '');
		assert.deepEqual(messy!.corsair, ['gmail']);
		assert.deepEqual(messy!.kind, ['oss']);
		assert.deepEqual(messy!.lang, []);
		assert.equal(messy!.event, '');
		assert.equal(messy!.added, '');
		// What used to throw: every app name renders.
		assert.deepEqual(builtWithApps(messy!).map(builtWithAppName), ['Gmail']);
	});

	it('uses only a picture from the repo, with a real size', () => {
		const image = (v: unknown) =>
			parseBuiltWith({
				categories: [{ id: 'email-calendar', title: 'E', blurb: '' }],
				projects: [project({ image: v })],
			})!.projects[0]!.image;
		assert.deepEqual(
			image({ path: 'data/shots/p.jpg', width: 1280, height: 800 }),
			{
				src: 'https://raw.githubusercontent.com/corsairdev/awesome-corsair/main/data/shots/p.jpg',
				width: 1280,
				height: 800,
			},
		);
		assert.equal(image(null), null);
		assert.equal(image(undefined), null);
		assert.equal(
			image({ path: 'https://evil.example/x.jpg', width: 10, height: 10 }),
			null,
		);
		assert.equal(
			image({ path: 'data/shots/../../x.png', width: 10, height: 10 }),
			null,
		);
		assert.equal(
			image({ path: 'data/shots/p.svg', width: 10, height: 10 }),
			null,
		);
		assert.equal(
			image({ path: 'data/shots/p.png', width: 0, height: 10 }),
			null,
		);
		assert.equal(
			image({ path: 'data/shots/p.png', width: '1280', height: 800 }),
			null,
		);
	});

	it('returns null for a file that is not the list', () => {
		assert.equal(parseBuiltWith({ hello: 'world' }), null);
		assert.equal(parseBuiltWith(null), null);
		assert.equal(parseBuiltWith('[]'), null);
		assert.equal(parseBuiltWith({ categories: [], projects: {} }), null);
	});
});

describe('builtWithByCategory', () => {
	it('follows the source order, sorts by name and drops empty categories', () => {
		const data = parseBuiltWith({
			categories: [
				{ id: 'b', title: 'B', blurb: '' },
				{ id: 'empty', title: 'Empty', blurb: '' },
				{ id: 'a', title: 'A', blurb: '' },
			],
			projects: [
				project({ id: 'z', name: 'Zed', category: 'b' }),
				project({ id: 'y', name: 'Alpha', category: 'b' }),
				project({ id: 'x', name: 'Mid', category: 'a' }),
			],
		})!;
		const groups = builtWithByCategory(data);
		assert.deepEqual(
			groups.map((g) => [g.category.id, g.projects.map((p) => p.name)]),
			[
				['b', ['Alpha', 'Zed']],
				['a', ['Mid']],
			],
		);
	});
});

describe('apps', () => {
	it('says when a project reaches its apps through the MCP server, with no plugin logos too', () => {
		const only = (corsair: string[]) =>
			parseBuiltWith({ categories: [], projects: [project({ corsair })] })!
				.projects[0]!;
		assert.equal(builtWithUsesMcp(only(['mcp'])), true);
		assert.deepEqual(builtWithApps(only(['mcp'])), []);
		assert.equal(builtWithUsesMcp(only(['gmail'])), false);
	});

	it('shows logos for plugins only and counts the ones the source summed up', () => {
		const p = parseBuiltWith({
			categories: [],
			projects: [
				project({ corsair: ['gmail', 'mcp', 'github', 'plus-278-more'] }),
			],
		})!.projects[0]!;
		assert.deepEqual(builtWithApps(p), ['gmail', 'github']);
		assert.equal(builtWithMoreApps(p), 278);
		assert.equal(builtWithUsesMcp(p), true);
		assert.equal(builtWithAppName('googlecalendar'), 'Google Calendar');
		assert.equal(builtWithAppName('zendesk'), 'Zendesk');
		assert.equal(builtWithAppName('acme'), 'Acme');
		// Not Object's inherited properties: a function here breaks the page.
		assert.equal(builtWithAppName('constructor'), 'Constructor');
		assert.equal(builtWithAppName('tostring'), 'Tostring');
	});
});
