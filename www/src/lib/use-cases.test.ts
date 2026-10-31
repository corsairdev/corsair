import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildUseCaseJsonLd } from './use-case-seo';
import {
	featuredOperationIds,
	getUseCase,
	USE_CASE_APP_NAMES,
	USE_CASE_CATEGORIES,
	USE_CASES,
	useCasesByCategory,
	useCasesForApp,
} from './use-cases';

describe('use case data', () => {
	it('has unique, URL-safe slugs', () => {
		const slugs = USE_CASES.map((u) => u.slug);
		assert.equal(new Set(slugs).size, slugs.length);
		for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
	});

	it('keeps titles and descriptions within what search results show', () => {
		for (const u of USE_CASES) {
			// The root layout adds " | Corsair" (10 characters); Google shows ~60.
			assert.ok(u.metaTitle.length <= 50, `${u.slug} metaTitle is too long`);
			assert.ok(u.summary.length <= 160, `${u.slug} summary is too long`);
		}
	});

	it('names every app it uses and only lists tools for those apps', () => {
		for (const u of USE_CASES) {
			assert.ok(u.apps.length > 0, `${u.slug} has no apps`);
			for (const app of u.apps) {
				assert.ok(
					USE_CASE_APP_NAMES[app],
					`${u.slug}: no display name for ${app}`,
				);
			}
			for (const op of u.operations) {
				assert.ok(
					u.apps.includes(op.app),
					`${u.slug}: ${op.app} is not in apps`,
				);
				assert.match(op.id, /^[a-zA-Z]+(\.[a-zA-Z]+)+$/);
			}
			// Every app the page names is used by at least one tool.
			for (const app of u.apps) {
				assert.ok(
					u.operations.some((op) => op.app === app),
					`${u.slug}: ${app} has no tool`,
				);
			}
		}
	});

	it('has the sections every page renders', () => {
		for (const u of USE_CASES) {
			assert.ok(USE_CASE_CATEGORIES.includes(u.category));
			assert.ok(u.prompt.length > 40, `${u.slug} prompt is too short`);
			assert.ok(u.notes.length >= 3, `${u.slug} needs three notes`);
			assert.ok(u.limits.length >= 1, `${u.slug} needs a limit`);
			assert.ok(u.faqs.length >= 1, `${u.slug} needs a question`);
			const faqIds = u.faqs.map((f) => f.id);
			assert.equal(
				new Set(faqIds).size,
				faqIds.length,
				`${u.slug} repeats a FAQ id`,
			);
		}
	});

	it('only says a prompt repeats when it is a routine', () => {
		for (const u of USE_CASES) {
			const repeats = /\b(every|whenever)\b/i.test(u.prompt);
			assert.equal(
				Boolean(u.runs),
				repeats,
				`${u.slug}: runs and prompt disagree`,
			);
		}
	});
});

describe('scheduled use cases', () => {
	// Hub runs routine schedules as UTC cron with no time zone, so a prompt that
	// says "9am" without one runs at 9am UTC.
	it('name a time zone and answer the time zone question', () => {
		const scheduled = USE_CASES.filter((u) => u.runs?.startsWith('Every'));
		assert.ok(scheduled.length > 0);
		for (const u of scheduled) {
			assert.match(
				u.prompt,
				/\b(\d{1,2}(:\d{2})?(am|pm)) [A-Z][a-z]+( [A-Z][a-z]+)* time\b/,
				`${u.slug}: no time zone in the prompt`,
			);
			assert.match(u.runs ?? '', / time$/, `${u.slug}: no time zone in runs`);
			assert.ok(
				u.faqs.some((f) => f.id === 'routine-time-zone'),
				`${u.slug}: no time zone question`,
			);
		}
	});
});

describe('use case lookups', () => {
	it('finds a use case by slug', () => {
		assert.equal(getUseCase('slack-reminders')?.apps[0], 'slack');
		assert.equal(getUseCase('nope'), undefined);
	});

	it('lists an app’s use cases with the ones led by that app first', () => {
		const slack = useCasesForApp('Slack');
		assert.ok(slack.length > 0);
		const firstNotLed = slack.findIndex((u) => u.apps[0] !== 'slack');
		if (firstNotLed !== -1) {
			assert.ok(slack.slice(firstNotLed).every((u) => u.apps[0] !== 'slack'));
		}
		assert.deepEqual(useCasesForApp('not-an-app'), []);
	});

	it('groups every use case under one category, in category order', () => {
		const groups = useCasesByCategory();
		assert.equal(
			groups.reduce((n, g) => n + g.useCases.length, 0),
			USE_CASES.length,
		);
		const order = groups.map((g) => USE_CASE_CATEGORIES.indexOf(g.category));
		assert.deepEqual(
			order,
			[...order].sort((a, b) => a - b),
		);
	});

	it('collects the tools an app’s use cases rely on, once each', () => {
		const ids = featuredOperationIds('slack');
		assert.ok(ids.includes('messages.post'));
		assert.equal(new Set(ids).size, ids.length);
		assert.deepEqual(featuredOperationIds('not-an-app'), []);
	});
});

describe('buildUseCaseJsonLd', () => {
	it('emits breadcrumbs and an FAQ page with plain-text answers', () => {
		const ld = buildUseCaseJsonLd({
			slug: 'x',
			name: 'X',
			faqs: [{ id: 'a', question: 'Use `q`?', answer: 'Run `a`.' }],
		});
		// The builder types the graph loosely (see use-case-seo.ts); the test
		// reads the two nodes it expects.
		const graph = ld['@graph'] as Record<string, unknown>[];
		assert.equal(graph[0]['@type'], 'BreadcrumbList');
		const faq = graph[1] as {
			'@type': string;
			mainEntity: { name: string; acceptedAnswer: { text: string } }[];
		};
		assert.equal(faq['@type'], 'FAQPage');
		assert.equal(faq.mainEntity[0].name, 'Use q?');
		assert.equal(faq.mainEntity[0].acceptedAnswer.text, 'Run a.');
	});
});
