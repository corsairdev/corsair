import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import nextConfig from '../../next.config';
import { AGENT_SIGNUP_URL, MCP_URL, SKILL_URL } from './site-links';

const skill = readFileSync(
	new URL('../../public/skill.md', import.meta.url),
	'utf8',
);

// The tools Hub's MCP server offers (hub apps/cloud-runtime; docs/cloud/mcp.mdx).
const MCP_TOOLS = new Set([
	'list_integrations',
	'get_connect_link',
	'list_operations',
	'get_schema',
	'search',
	'read_data',
	'run_script',
	'get_job',
	'upload_file',
	'view_routines',
	'update_routine',
	'use_skill',
	'find_skill',
	'save_skill',
	'submit_feedback',
]);

function frontmatter(text: string): Record<string, string> {
	const match = text.match(/^---\n([\s\S]*?)\n---\n/);
	assert.ok(match, 'skill.md starts with a frontmatter block');
	const fields: Record<string, string> = {};
	let current = '';
	for (const line of match[1].split('\n')) {
		const field = line.match(/^([a-z_]+):\s*(.*)$/);
		if (field) {
			current = field[1];
			fields[current] = field[2];
		} else if (current) {
			fields[current] += ` ${line.trim()}`;
		}
	}
	return fields;
}

describe('public/skill.md', () => {
	const fields = frontmatter(skill);

	it('has the fields agents read to install and update it', () => {
		assert.equal(fields.name, 'corsair');
		assert.match(fields.version ?? '', /^\d+\.\d+\.\d+$/);
		assert.ok((fields.description ?? '').length > 80);
		assert.ok(skill.includes(SKILL_URL));
	});

	it('gives the same sign-in address as the site, and auth.md for agents on their own', () => {
		const addresses = new Set(
			skill.match(/https:\/\/mcp\.corsair\.dev\/[^\s`"'|)]*/g),
		);
		assert.deepEqual([...addresses], [MCP_URL]);
		assert.ok(skill.includes(AGENT_SIGNUP_URL));
	});

	it('names only tools the MCP server has', () => {
		// Every snake_case name in backticks is a tool name.
		const named = new Set(
			[...skill.matchAll(/`([a-z]+(?:_[a-z]+)+)`/g)].map((m) => m[1]),
		);
		const unknown = [...named].filter((name) => !MCP_TOOLS.has(name));
		assert.deepEqual(unknown, []);
		for (const core of ['search', 'list_operations', 'run_script']) {
			assert.ok(skill.includes(`\`${core}\``), core);
		}
	});

	it('says Corsair, not Lug', () => {
		assert.equal(/\bLug\b/.test(skill), false);
	});

	it('is also served at /SKILL.md', async () => {
		const rewrites = await nextConfig.rewrites?.();
		const list = Array.isArray(rewrites)
			? rewrites
			: (rewrites?.beforeFiles ?? []);
		assert.ok(
			list.some(
				(rule) =>
					rule.source === '/SKILL.md' && rule.destination === '/skill.md',
			),
		);
	});
});
