import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
	CURSOR_INSTALL_URL,
	hubLugClaimUrl,
	hubMcpConnectUrl,
	hubWwwPluginsLoginUrl,
	lugHandleProblem,
	MCP_URL,
} from './site-links';

describe('hubWwwPluginsLoginUrl', () => {
	it('signs developers in without the agent handoff, so Hub lands on /dashboard', () => {
		const url = new URL(hubWwwPluginsLoginUrl([' Gmail', 'airtable', 'gmail']));
		assert.equal(url.origin + url.pathname, 'https://hub.corsair.dev/login');
		assert.equal(url.searchParams.get('mode'), 'www');
		assert.equal(url.searchParams.get('plugins'), 'gmail,airtable');
		assert.equal(url.searchParams.has('title'), false);
		assert.equal(url.searchParams.has('redirect'), false);
	});
});

describe('hubMcpConnectUrl', () => {
	it('returns to /me asking to add the app', () => {
		const url = new URL(hubMcpConnectUrl('Linear'));
		assert.equal(url.origin + url.pathname, 'https://hub.corsair.dev/login');
		assert.equal(url.searchParams.get('mode'), 'www');
		assert.equal(url.searchParams.get('plugins'), 'linear');
		assert.equal(url.searchParams.get('redirect'), '/me?add=linear');
		assert.equal(url.searchParams.has('title'), false);
	});
});

describe('CURSOR_INSTALL_URL', () => {
	it('installs a server named corsair with the hosted MCP address', () => {
		const url = new URL(CURSOR_INSTALL_URL);
		assert.equal(url.origin + url.pathname, 'https://cursor.com/install-mcp');
		assert.equal(url.searchParams.get('name'), 'corsair');
		const config = JSON.parse(atob(url.searchParams.get('config') ?? ''));
		assert.deepEqual(config, { url: MCP_URL });
	});
});

describe('lug handles', () => {
	it('accepts what lug.dev accepts and rejects the rest', () => {
		assert.equal(lugHandleProblem('pranay'), null);
		assert.equal(lugHandleProblem('a-b-9'), null);
		assert.equal(lugHandleProblem('-pranay'), 'format');
		assert.equal(lugHandleProblem('Pranay'), 'format');
		assert.equal(lugHandleProblem('xn--abc'), 'format');
		assert.equal(lugHandleProblem('a'.repeat(33)), 'format');
		assert.equal(lugHandleProblem('admin'), 'reserved');
	});

	it('signs in through Lug and opens /me with the handle filled in', () => {
		const url = new URL(hubLugClaimUrl(' Pranay '));
		assert.equal(url.origin + url.pathname, 'https://hub.corsair.dev/login');
		assert.equal(url.searchParams.get('mode'), 'lug');
		assert.equal(url.searchParams.get('handle'), 'pranay');
		assert.equal(url.searchParams.get('redirect'), '/me?handle=pranay');
	});
});
