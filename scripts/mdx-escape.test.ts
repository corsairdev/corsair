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

test('shows a bare address that is not a valid URL as code', () => {
	assert.equal(
		escapeMdxText('A proxy URL (e.g. http://user:pass@host:port) works.'),
		'A proxy URL (e.g. `http://user:pass@host:port`) works.',
	);
	assert.equal(
		escapeMdxText('Send to https://x.test:port.'),
		'Send to `https://x.test:port`.',
	);
});

test('leaves valid addresses, code spans and words containing http alone', () => {
	assert.equal(
		escapeMdxText(
			'See https://example.com/a_(b)?q=1, then (https://example.com).',
		),
		'See https://example.com/a_(b)?q=1, then (https://example.com).',
	);
	assert.equal(
		escapeMdxText('Use `http://user:pass@host:port`.'),
		'Use `http://user:pass@host:port`.',
	);
	assert.equal(escapeMdxText('xhttp://a:b'), 'xhttp://a:b');
	assert.equal(
		escapeMdxText('Full page URL, including https://'),
		'Full page URL, including https://',
	);
});

test('returns an empty string for missing input', () => {
	assert.equal(escapeMdxText(undefined), '');
	assert.equal(escapeMdxText(''), '');
});
