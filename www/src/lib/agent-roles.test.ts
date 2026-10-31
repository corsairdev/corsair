import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AGENT_ROLES } from './agent-roles';
import { creditsInUsd, MANAGED_TOOLS, priceText } from './managed-tools';
import { getUseCase, starterPrompt } from './use-cases';

describe('agent roles', () => {
	it('have unique ids and read as "Turn Claude into a/an …"', () => {
		const ids = AGENT_ROLES.map((r) => r.id);
		assert.equal(new Set(ids).size, ids.length);
		for (const role of AGENT_ROLES) assert.match(role.title, /^an? [a-z]/i);
	});

	it('show four steps and six apps, and every step uses a listed app', () => {
		for (const role of AGENT_ROLES) {
			assert.equal(role.steps.length, 4, role.id);
			assert.equal(role.apps.length, 6, role.id);
			const apps = new Set(role.apps.map((a) => a.id));
			assert.equal(apps.size, 6, `${role.id} repeats an app`);
			for (const step of role.steps) {
				assert.ok(apps.has(step.app), `${role.id}: ${step.app} is not listed`);
				assert.match(step.tool, /^[a-zA-Z]+(\.[a-zA-Z]+)+$/);
			}
		}
	});

	it('link only to use cases that exist', () => {
		for (const role of AGENT_ROLES) {
			if (role.useCase) assert.ok(getUseCase(role.useCase), role.useCase);
		}
	});

	it('name a time zone when a prompt runs on a schedule', () => {
		for (const role of AGENT_ROLES) {
			if (/\bevery\b.*\b\d{1,2}(:\d{2})?(am|pm)\b/i.test(role.prompt)) {
				assert.match(
					role.prompt,
					/(am|pm) [A-Z][a-z]+( [A-Z][a-z]+)* time\b/,
					role.id,
				);
			}
		}
	});
});

describe('managed tools', () => {
	it('price every live call in whole credits, and list each call once', () => {
		for (const tool of MANAGED_TOOLS) {
			const calls = tool.calls.map((c) => c.tool);
			assert.equal(new Set(calls).size, calls.length, tool.app);
			for (const call of tool.calls) {
				if (!tool.live) continue;
				assert.ok(call.price, `${tool.app}.${call.tool} is live with no price`);
				assert.ok(
					Number.isInteger(call.price.credits) && call.price.credits > 0,
					`${tool.app}.${call.tool}`,
				);
			}
		}
		const apps = MANAGED_TOOLS.map((t) => t.app);
		assert.equal(new Set(apps).size, apps.length);
	});

	it('prices credits in dollars at 100 per $1', () => {
		assert.equal(creditsInUsd(1), '$0.01');
		assert.equal(creditsInUsd(15), '$0.15');
		assert.equal(creditsInUsd(40), '$0.40');
	});

	it('says how each kind of price is charged', () => {
		assert.deepEqual(priceText({ kind: 'flat', credits: 1 }), {
			credits: '1 credit',
			usd: '$0.01',
		});
		assert.deepEqual(priceText({ kind: 'per', credits: 2, unit: 'page' }), {
			credits: '2 credits / page',
			usd: '$0.02 / page',
		});
		assert.equal(
			priceText({ kind: 'from', credits: 1 }).credits,
			'from 1 credit',
		);
		assert.equal(priceText({ kind: 'upTo', credits: 4 }).usd, 'up to $0.04');
	});
});

describe('starterPrompt', () => {
	it('asks for a read-only example in the named app', () => {
		const prompt = starterPrompt('TextRazor');
		assert.match(prompt, /^Using Corsair, /);
		assert.match(prompt, /TextRazor/);
		assert.match(prompt, /read-only/);
	});
});
