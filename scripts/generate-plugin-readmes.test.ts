import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { PluginDocsIntrospection } from '../packages/corsair/core/inspect/index.ts';
import {
	buildChangesetContent,
	fillPackageMetadata,
	MISSING_METADATA_FIELDS,
	missingMetadataFields,
	renderPluginReadme,
} from './generate-plugin-readmes.ts';

const sampleIntrospection: PluginDocsIntrospection = {
	pluginId: 'acme',
	api: [
		{
			path: 'acme.api.messages.list',
			shortPath: 'messages.list',
			description: 'List messages',
			riskLevel: 'read',
			input: { kind: 'object', fields: [] },
			output: { kind: 'inline', type: 'unknown' },
		},
		{
			path: 'acme.api.messages.send',
			shortPath: 'messages.send',
			description: 'Send a message',
			riskLevel: 'write',
			input: { kind: 'object', fields: [] },
			output: { kind: 'inline', type: 'unknown' },
		},
	],
	webhooks: [
		{
			path: 'acme.webhooks.messages.created',
			description: 'A message was created',
			payload: { kind: 'inline', type: 'unknown' },
			usageExample: '',
		},
	],
	db: [],
};

test('renderPluginReadme puts every operation in the endpoint table', () => {
	const md = renderPluginReadme({
		pluginId: 'acme',
		npmName: '@corsair-dev/acme',
		description: 'Acme plugin for Corsair',
		data: sampleIntrospection,
		authTypes: ['api_key'],
		defaultAuthType: 'api_key',
	});
	assert.match(md, /^# @corsair-dev\/acme/);
	assert.match(md, /pnpm add @corsair-dev\/acme/);
	assert.match(md, /\| `messages\.list` \| `acme\.api\.messages\.list` \|/);
	assert.match(md, /\| `messages\.send` \| `acme\.api\.messages\.send` \|/);
	assert.match(md, /List messages/);
	assert.match(md, /https:\/\/docs\.corsair\.dev\/plugins\/acme/);
	assert.match(md, /## License\n\nApache-2\.0/);
	// Auth line derives from real metadata, not invented.
	assert.match(md, /API key/i);
	// Webhooks are surfaced when present.
	assert.match(md, /1 webhook event/i);
});

test('renderPluginReadme notes when a plugin has no webhooks', () => {
	const md = renderPluginReadme({
		pluginId: 'acme',
		npmName: '@corsair-dev/acme',
		description: 'Acme plugin for Corsair',
		data: { ...sampleIntrospection, webhooks: [] },
		authTypes: ['oauth_2'],
		defaultAuthType: 'oauth_2',
	});
	assert.match(md, /No webhooks/i);
	assert.match(md, /OAuth 2\.0/);
});

test('fillPackageMetadata fills only missing fields', () => {
	const pkg = {
		name: '@corsair-dev/acme',
		version: '0.1.0',
		description: 'Acme plugin for Corsair',
		license: 'Apache-2.0',
	};
	const { pkg: out, changed } = fillPackageMetadata(pkg, 'acme');
	assert.deepEqual(out.repository, {
		type: 'git',
		url: 'git+https://github.com/corsairdev/corsair.git',
		directory: 'packages/acme',
	});
	assert.equal(out.homepage, 'https://docs.corsair.dev/plugins/acme');
	assert.equal(out.author, 'Corsair (https://corsair.dev)');
	assert.ok(Array.isArray(out.keywords));
	assert.ok((out.keywords as string[]).includes('acme'));
	assert.ok((out.keywords as string[]).includes('mcp'));
	// license already present → untouched, not in changed set.
	assert.ok(!changed.includes('license'));
	assert.ok(changed.includes('repository'));
	assert.ok(changed.includes('homepage'));
	assert.ok(changed.includes('author'));
	assert.ok(changed.includes('keywords'));
});

test('fillPackageMetadata never clobbers an existing description or author', () => {
	const pkg = {
		name: '@corsair-dev/acme',
		version: '0.1.0',
		description: 'A carefully hand-written description',
		author: 'Jane Doe',
		homepage: 'https://example.com/custom',
	};
	const { pkg: out, changed } = fillPackageMetadata(pkg, 'acme');
	assert.equal(out.description, 'A carefully hand-written description');
	assert.equal(out.author, 'Jane Doe');
	assert.equal(out.homepage, 'https://example.com/custom');
	assert.ok(!changed.includes('description'));
	assert.ok(!changed.includes('author'));
	assert.ok(!changed.includes('homepage'));
});

test('fillPackageMetadata adds a missing license', () => {
	const pkg = { name: '@corsair-dev/acme', version: '0.1.0' };
	const { pkg: out, changed } = fillPackageMetadata(pkg, 'acme');
	assert.equal(out.license, 'Apache-2.0');
	assert.ok(changed.includes('license'));
});

test('missingMetadataFields detects gaps for --check', () => {
	const complete = {
		name: '@corsair-dev/acme',
		repository: { type: 'git', url: 'x' },
		homepage: 'x',
		keywords: ['a'],
		author: 'x',
		license: 'Apache-2.0',
	};
	assert.deepEqual(missingMetadataFields(complete), []);
	const partial = { name: '@corsair-dev/acme', keywords: [] };
	const gaps = missingMetadataFields(partial);
	for (const f of MISSING_METADATA_FIELDS) {
		assert.ok(gaps.includes(f), `expected ${f} to be reported missing`);
	}
});

test('buildChangesetContent lists exactly the touched packages at patch', () => {
	const md = buildChangesetContent(['@corsair-dev/beta', '@corsair-dev/acme']);
	// front-matter sorted, each at patch
	assert.match(md, /^---\n/);
	assert.match(md, /'@corsair-dev\/acme': patch/);
	assert.match(md, /'@corsair-dev\/beta': patch/);
	// summary line
	assert.match(md, /Add package README and npm metadata\./);
	// deterministic ordering: acme before beta
	assert.ok(md.indexOf('acme') < md.indexOf('beta'));
});
