import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { CURSOR_INSTALL_URL, MCP_URL } from './site-links';

describe('CURSOR_INSTALL_URL', () => {
	it('installs a server named corsair with the hosted MCP address', () => {
		const url = new URL(CURSOR_INSTALL_URL);
		assert.equal(url.origin + url.pathname, 'https://cursor.com/install-mcp');
		assert.equal(url.searchParams.get('name'), 'corsair');
		const config = JSON.parse(atob(url.searchParams.get('config') ?? ''));
		assert.deepEqual(config, { url: MCP_URL });
	});
});
