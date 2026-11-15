import assert from 'node:assert/strict';
import { test } from 'node:test';
import { escapeMdxText } from './mdx-escape.ts';

test('escapes the characters MDX parses as JSX or expressions', () => {
	assert.equal(
		escapeMdxText('RUNPOD_SECRET_<name>'),
		'RUNPOD_SECRET_&lt;name&gt;',
	);
	assert.equal(
		escapeMdxText('Polymarket <> Kalshi'),
		'Polymarket &lt;&gt; Kalshi',
	);
	assert.equal(
		escapeMdxText('Defaults to { type: "world" }.'),
		'Defaults to &#123; type: "world" &#125;.',
	);
});

test('leaves inline code spans unchanged', () => {
	assert.equal(escapeMdxText('Use `{id}` or <id>'), 'Use `{id}` or &lt;id&gt;');
	assert.equal(
		escapeMdxText('Run ``a ` <b>`` then <c>'),
		'Run ``a ` <b>`` then &lt;c&gt;',
	);
});

test('treats an unmatched backtick run as plain text', () => {
	assert.equal(escapeMdxText('a ` <b>'), 'a ` &lt;b&gt;');
	assert.equal(escapeMdxText('``x` <y>'), '``x` &lt;y&gt;');
});

test('does not open a code span at an escaped backtick', () => {
	assert.equal(escapeMdxText('Show \\` <x> `'), 'Show \\` &lt;x&gt; `');
	assert.equal(escapeMdxText('`a\\` <b>'), '`a\\` &lt;b&gt;');
});

test('returns an empty string for missing input', () => {
	assert.equal(escapeMdxText(undefined), '');
	assert.equal(escapeMdxText(''), '');
});
