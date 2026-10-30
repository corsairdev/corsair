import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PortableText } from '@portabletext/react';
import * as React from 'react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// tsx compiles the components with the classic JSX runtime (the Next tsconfig
// has jsx: preserve), so React must be global before they load.
Object.assign(globalThis, { React });
const { portableTextComponents } = await import('./portable-text-components');

type CodeBlockFixture = {
	_type: 'codeBlock';
	_key: string;
	code?: string;
	filename?: string;
	language?: string;
};

function render(value: CodeBlockFixture[]) {
	return renderToStaticMarkup(
		createElement(PortableText<CodeBlockFixture>, {
			components: portableTextComponents,
			value,
			onMissingComponent: (message: string) => {
				throw new Error(message);
			},
		}),
	);
}

const config = `[mcp_servers.corsair]
url = "https://mcp.corsair.dev/mcp"`;

describe('blog code blocks', () => {
	it('renders the code verbatim, line breaks included, under its file name', () => {
		const html = render([
			{
				_type: 'codeBlock',
				_key: 'c1',
				filename: '~/.codex/config.toml',
				language: 'toml',
				code: config,
			},
		]);
		assert.match(html, /~\/\.codex\/config\.toml/);
		assert.match(
			html,
			/<pre[^>]*><code>\[mcp_servers\.corsair\]\nurl = &quot;https:\/\/mcp\.corsair\.dev\/mcp&quot;<\/code><\/pre>/,
		);
	});

	it('labels a block without a file name by its language', () => {
		const html = render([
			{
				_type: 'codeBlock',
				_key: 'c2',
				language: 'bash',
				code: 'codex mcp list',
			},
		]);
		assert.match(html, /<figcaption[^>]*>bash<\/figcaption>/);
	});

	it('renders nothing for an empty block', () => {
		assert.equal(
			render([{ _type: 'codeBlock', _key: 'c3', language: 'bash' }]),
			'',
		);
	});
});
