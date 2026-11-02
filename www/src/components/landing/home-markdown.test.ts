import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { AGENT_ROLES } from '@/lib/agent-roles';
import {
	AGENT_SETUP_PROMPT,
	HERO_SUBTITLE,
	HERO_TITLE,
	PILLARS,
} from '@/lib/home-content';
import { FAQ_ITEMS } from '@/lib/home-faq';
import { MANAGED_TOOLS } from '@/lib/managed-tools';
import { MCP_URL, SKILL_URL } from '@/lib/site-links';
import { buildHomeMarkdown } from './home-markdown';

describe('buildHomeMarkdown', () => {
	const markdown = buildHomeMarkdown();

	it('opens with frontmatter that points agents at the skill', () => {
		assert.ok(markdown.startsWith('---\ntitle: Corsair\n'));
		assert.ok(markdown.includes(`agent_skill: ${SKILL_URL}`));
		assert.ok(markdown.includes(`# ${HERO_TITLE}`));
		assert.ok(markdown.includes(HERO_SUBTITLE));
	});

	it('gives agents the setup line and the MCP address', () => {
		assert.ok(markdown.includes(AGENT_SETUP_PROMPT));
		assert.ok(markdown.includes(MCP_URL));
	});

	it('carries every section the page shows', () => {
		for (const pillar of PILLARS) {
			assert.ok(markdown.includes(pillar.title), pillar.title);
		}
		for (const role of AGENT_ROLES) {
			assert.ok(markdown.includes(role.prompt), role.id);
		}
		for (const tool of MANAGED_TOOLS.filter((t) => t.live)) {
			assert.ok(markdown.includes(`- ${tool.name}:`), tool.name);
		}
		for (const item of FAQ_ITEMS) {
			assert.ok(markdown.includes(`### ${item.question}`), item.id);
		}
	});

	it('has no template-string indentation left in it', () => {
		assert.equal(/\n\t/.test(markdown), false);
	});
});
