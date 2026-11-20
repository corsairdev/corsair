import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	builtWithAppName,
	builtWithApps,
	builtWithByCategory,
	builtWithMoreApps,
	parseBuiltWith,
} from './built-with';

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

	it('returns null for a file that is not the list', () => {
		assert.equal(parseBuiltWith({ hello: 'world' }), null);
		assert.equal(parseBuiltWith(null), null);
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
	it('shows logos for plugins only and counts the ones the source summed up', () => {
		const p = parseBuiltWith({
			categories: [],
			projects: [
				project({ corsair: ['gmail', 'mcp', 'github', 'plus-278-more'] }),
			],
		})!.projects[0]!;
		assert.deepEqual(builtWithApps(p), ['gmail', 'github']);
		assert.equal(builtWithMoreApps(p), 278);
		assert.equal(builtWithAppName('googlecalendar'), 'Google Calendar');
		assert.equal(builtWithAppName('zendesk'), 'Zendesk');
		assert.equal(builtWithAppName('acme'), 'Acme');
	});
});
