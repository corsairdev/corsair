import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';
import { parse as parseYaml } from 'yaml';
import {
	listPluginDirs,
	pluginDocsProblemsIn,
	pluginDocsYamlProblems,
	starterPluginDocsYaml,
} from './plugin-docs-requirements.ts';

describe('pluginDocsYamlProblems', () => {
	it('accepts a real name and description', () => {
		assert.deepEqual(
			pluginDocsYamlProblems(
				'displayName: bunny.net\ndescription: Edge platform API for pull zones, storage zones and DNS zones.\n',
			),
			[],
		);
	});

	it('needs both fields', () => {
		assert.deepEqual(pluginDocsYamlProblems('domain: example.com\n'), [
			'needs a displayName (the provider name as they write it)',
			'needs a description (one sentence on what the plugin covers)',
		]);
	});

	it('rejects placeholders and one-word descriptions', () => {
		assert.deepEqual(
			pluginDocsYamlProblems('displayName: TODO\ndescription: TBD\n'),
			[
				'displayName is still a placeholder',
				'description is still a placeholder',
			],
		);
		assert.match(
			pluginDocsYamlProblems(
				'displayName: Acme\ndescription: Acme API.\n',
			)[0] ?? '',
			/too short/,
		);
	});

	it('accepts ordinary words that spell a marker in lower case', () => {
		assert.deepEqual(
			pluginDocsYamlProblems(
				'displayName: Todoist\ndescription: Task manager API; this plugin reads and edits todo items and projects.\n',
			),
			[],
		);
	});

	it('reports YAML it cannot parse', () => {
		assert.match(
			pluginDocsYamlProblems('displayName: [unclosed\n')[0] ?? '',
			/not valid YAML/,
		);
		assert.deepEqual(pluginDocsYamlProblems('- a\n- b\n'), [
			'must be a YAML mapping',
		]);
	});
});

describe('starterPluginDocsYaml', () => {
	it('starts with the name and fails until the description is written', () => {
		const text = starterPluginDocsYaml('GoogleCalendar');
		assert.match(text, /^displayName: "GoogleCalendar"$/m);
		assert.deepEqual(pluginDocsYamlProblems(text), [
			'description is still a placeholder',
		]);
	});

	it('keeps names with YAML punctuation whole', () => {
		for (const name of ['Acme: Cloud', 'Acme #1', '"Quoted" Inc', 'yes']) {
			// The parser may turn a bare `yes` into a boolean, which is the bug
			// this test guards against, so the field is checked, not assumed.
			const doc = parseYaml(starterPluginDocsYaml(name)) as {
				displayName: unknown;
			};
			assert.equal(doc.displayName, name);
		}
	});
});

describe('pluginDocsProblemsIn and listPluginDirs', () => {
	it('checks each plugin folder and skips the non-plugin packages', () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), 'plugin-docs-'));
		for (const dir of ['corsair', 'frpc-linux-x64', 'good', 'missing']) {
			fs.mkdirSync(path.join(root, dir));
		}
		fs.writeFileSync(
			path.join(root, 'good', 'plugin-docs.yaml'),
			'displayName: Good\ndescription: Good API for widgets, gadgets and the rest of it.\n',
		);
		assert.deepEqual(listPluginDirs(root).sort(), ['good', 'missing']);
		assert.deepEqual(pluginDocsProblemsIn(path.join(root, 'good')), []);
		assert.deepEqual(pluginDocsProblemsIn(path.join(root, 'missing')), [
			'Missing plugin-docs.yaml',
		]);
		fs.rmSync(root, { recursive: true, force: true });
	});
});
