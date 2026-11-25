import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// messages.list returns only id and threadId, so "search results" never shows a partId.
const sites = ['../index.ts', '../README.md', './types.ts'];

describe('partId docs', () => {
	it.each(sites)('%s names the surface that returns partId', (site) => {
		const text = readFileSync(join(__dirname, site), 'utf8');
		const line = text
			.split('\n')
			.find(
				(l) =>
					l.includes('partId of an attachment part') ||
					l.includes('Fetch an attachment of a message by partId'),
			);
		expect(line).toBeDefined();
		expect(line).not.toContain('search results');
		expect(line).toContain(
			'database search of messages fetched with format full',
		);
	});
});
