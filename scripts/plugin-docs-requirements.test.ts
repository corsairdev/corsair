import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
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
		assert.match(text, /^displayName: GoogleCalendar$/m);
		assert.deepEqual(pluginDocsYamlProblems(text), [
			'description is still a placeholder',
		]);
	});
});
