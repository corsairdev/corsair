import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	GATEWAY_SKILLS,
	hasAppName,
	listNames,
	SKILL_CATEGORIES,
	skillApps,
	skillMeta,
} from './gateway-skills';

describe('GATEWAY_SKILLS', () => {
	it('has unique slugs that work as URL segments', () => {
		const slugs = GATEWAY_SKILLS.map((s) => s.slug);
		assert.equal(new Set(slugs).size, slugs.length);
		for (const slug of slugs) assert.match(slug, /^[a-z0-9]+(-[a-z0-9]+)*$/);
	});

	it('puts every skill in a listed category, and every category has skills', () => {
		const ids = new Set(SKILL_CATEGORIES.map((c) => c.id));
		for (const s of GATEWAY_SKILLS) assert.ok(ids.has(s.category), s.slug);
		for (const c of SKILL_CATEGORIES) {
			assert.ok(
				GATEWAY_SKILLS.some((s) => s.category === c.id),
				c.id,
			);
		}
	});

	it('names every app a skill uses', () => {
		for (const s of GATEWAY_SKILLS) {
			for (const id of skillApps(s))
				assert.ok(hasAppName(id), `${s.slug}: ${id}`);
		}
	});

	it('gives every skill at least one app to connect or a built-in', () => {
		for (const s of GATEWAY_SKILLS) {
			assert.ok(skillApps(s).length + s.builtIn.length > 0, s.slug);
		}
	});

	it('keeps meta descriptions within 160 characters', () => {
		for (const s of GATEWAY_SKILLS) {
			const { description } = skillMeta(s);
			assert.ok(description.length <= 160, `${s.slug}: ${description.length}`);
		}
	});

	it('never says Lug in text the pages show', () => {
		for (const s of GATEWAY_SKILLS) {
			const text = [
				s.name,
				s.summary,
				s.result,
				...s.steps,
				...(s.notes ?? []),
			].join(' ');
			assert.doesNotMatch(text, /\blug\b/i, s.slug);
		}
	});
});

describe('listNames', () => {
	it('joins app names the way a person would', () => {
		assert.equal(listNames(['gmail']), 'Gmail');
		assert.equal(
			listNames(['googlecalendar', 'exa']),
			'Google Calendar and Exa',
		);
		assert.equal(
			listNames(['gmail', 'slack', 'linear']),
			'Gmail, Slack and Linear',
		);
	});
});
