import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

import nextConfig from '../../next.config';
import { MCP_URL } from './site-links';

const skill = readFileSync(
	new URL('../../public/skill.md', import.meta.url),
	'utf8',
);

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
	});

	it('gives the same MCP address as the site', () => {
		assert.ok(skill.includes(MCP_URL));
		const addresses = new Set(
			skill.match(/https:\/\/mcp\.corsair\.dev\/[^\s`"'|)]*/g),
		);
		assert.deepEqual([...addresses], [MCP_URL]);
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
