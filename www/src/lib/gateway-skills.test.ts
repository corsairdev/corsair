import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { parseGatewayContent } from './gateway-content';
import {
	builtInNames,
	listNames,
	skillApps,
	skillBySlug,
	skillMeta,
	skillWhen,
} from './gateway-skills';

// A small answer in the shape Hub's /api/public/gateway sends.
const SAMPLE = {
	version: 1,
	clients: [
		{
			id: 'claude',
			name: 'Claude app',
			domain: 'claude.ai',
			auth: 'sign-in',
			featured: true,
			guide: { steps: [{ text: 'Open Customize.' }] },
		},
	],
	skills: [
		{
			slug: 'morning-brief',
			name: 'Morning brief',
			summary: 'One message each weekday morning.',
			category: 'everyday',
			required: ['googlecalendar', 'gmail'],
			optional: ['gmail', 'slack'],
			builtIn: ['pm'],
			steps: ['Reads today.'],
			result: 'A brief.',
			schedule: 'Every weekday at 8:00',
		},
	],
	skillCategories: [
		{ id: 'everyday', name: 'Inbox and calendar', blurb: 'Mail.' },
	],
	builtIns: { pm: 'Issues', crm: 'CRM', files: 'Files', pg: 'Postgres' },
	appNames: {
		googlecalendar: 'Google Calendar',
		gmail: 'Gmail',
		slack: 'Slack',
	},
};

describe('parseGatewayContent', () => {
	it('accepts what Hub sends', () => {
		const content = parseGatewayContent(SAMPLE);
		assert.equal(content.skills[0]?.slug, 'morning-brief');
		assert.equal(content.clients[0]?.id, 'claude');
	});

	it('refuses another version or an empty list, so a build fails instead of shipping empty pages', () => {
		assert.throws(
			() => parseGatewayContent({ ...SAMPLE, version: 2 }),
			/version 2/,
		);
		assert.throws(
			() => parseGatewayContent({ ...SAMPLE, skills: [] }),
			/no skills/,
		);
		assert.throws(
			() => parseGatewayContent({ ...SAMPLE, clients: [] }),
			/no clients/,
		);
		assert.throws(() => parseGatewayContent(null), /not an object/);
		assert.throws(
			() => parseGatewayContent({ ...SAMPLE, skills: [{ name: 'x' }] }),
			/without a slug/,
		);
	});
});

describe('skill helpers', () => {
	const content = parseGatewayContent(SAMPLE);
	const skill = skillBySlug(content.skills, 'morning-brief');

	it('finds a skill by slug', () => {
		assert.ok(skill);
		assert.equal(skillBySlug(content.skills, 'nope'), undefined);
	});

	it('lists required apps first, each once', () => {
		assert.ok(skill);
		assert.deepEqual(skillApps(skill), ['googlecalendar', 'gmail', 'slack']);
	});

	it('names apps and built-ins', () => {
		assert.ok(skill);
		assert.equal(
			listNames(content.appNames, skillApps(skill)),
			'Google Calendar, Gmail and Slack',
		);
		assert.equal(listNames(content.appNames, ['unknownapp']), 'unknownapp');
		assert.deepEqual(builtInNames(content.builtIns, skill), ['Issues']);
	});

	it('writes the page title and when it runs', () => {
		assert.ok(skill);
		assert.equal(
			skillMeta(skill).title,
			'Morning brief: a skill for your AI agent',
		);
		assert.equal(skillWhen(skill), 'Every weekday at 8:00');
		assert.equal(skillWhen({ ...skill, schedule: undefined }), 'When you ask');
	});
});
