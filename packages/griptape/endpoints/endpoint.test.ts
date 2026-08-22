import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('griptape endpoints scaffold', () => {
	it('does not keep the generator example file', () => {
		expect(existsSync(join(__dirname, 'example.ts'))).toBe(false);
	});

	it('wires assistant list and get endpoints', () => {
		const src = readFileSync(join(__dirname, 'index.ts'), 'utf8');

		expect(src).toContain("from './assistant-list'");
		expect(src).toContain("from './assistant-get'");
		expect(src).toContain('list: assistantList');
		expect(src).toContain('get: assistantGet');
		expect(src).not.toContain("from './example'");
	});
});
